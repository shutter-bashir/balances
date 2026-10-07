import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 2_000_000;
const KEY = "balances:records";

// Where records live:
// - Upstash Redis when its variables are set (Vercel: added from the Marketplace).
// - Netlify Blobs when deployed on Netlify (built in, nothing to set up).
// - data/records.json while running locally with `npm run dev`.
// Hosted servers can't write to their own disk, so a live server with no storage refuses
// to save rather than pretending to.
const hasRedis = Boolean(
  (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN),
);
const redis = hasRedis ? Redis.fromEnv() : null;
const live = process.env.NODE_ENV === "production";

const dir = path.join(process.cwd(), "data");
const file = path.join(dir, "records.json");

class NoStorage extends Error {}

function netlifyStore() {
  try {
    // Strong consistency so a reload right after a save sees that save.
    return getStore({ name: "wallet", consistency: "strong" });
  } catch (err) {
    if (err.name === "MissingBlobsEnvironmentError") throw new NoStorage();
    throw err;
  }
}

async function load() {
  if (redis) return (await redis.get(KEY)) ?? {};
  if (live) return (await netlifyStore().get(KEY, { type: "json" })) ?? {};
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return {};
    throw err;
  }
}

async function save(records) {
  if (redis) return void (await redis.set(KEY, records));
  if (live) return void (await netlifyStore().setJSON(KEY, records));
  // Write to a temp file first so a crash mid-write can't corrupt the records.
  await mkdir(dir, { recursive: true });
  const tmp = file + ".tmp";
  await writeFile(tmp, JSON.stringify(records, null, 2));
  await rename(tmp, file);
}

const noStorage = () =>
  new Response("No storage configured for records on this host.", { status: 503 });

export async function GET() {
  try {
    return Response.json(await load(), { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof NoStorage || err.name === "MissingBlobsEnvironmentError") return noStorage();
    throw err;
  }
}

export async function PUT(request) {
  const text = await request.text();
  if (text.length > MAX_BYTES) return new Response("Too large", { status: 413 });
  let records;
  try {
    records = JSON.parse(text);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!records || typeof records !== "object" || Array.isArray(records)) {
    return new Response("Expected an object", { status: 400 });
  }

  try {
    await save(records);
  } catch (err) {
    if (err instanceof NoStorage || err.name === "MissingBlobsEnvironmentError") return noStorage();
    throw err;
  }
  return new Response(null, { status: 204 });
}
