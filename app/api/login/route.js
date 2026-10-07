import { COOKIE, MAX_AGE, safeEqual, sessionToken } from "../../../lib/session";

export const runtime = "nodejs";

export async function POST(request) {
  const password = process.env.APP_PASSWORD;
  const form = await request.formData();
  const attempt = String(form.get("password") ?? "");

  if (!password || !safeEqual(attempt, password)) {
    // Slow down guessing a little.
    await new Promise((r) => setTimeout(r, 600));
    return Response.redirect(new URL("/login?error=1", request.url), 303);
  }

  const secure = new URL(request.url).protocol === "https:";
  const cookie = [
    `${COOKIE}=${await sessionToken(password)}`,
    "Path=/",
    `Max-Age=${MAX_AGE}`,
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  return new Response(null, { status: 303, headers: { Location: "/", "Set-Cookie": cookie } });
}
