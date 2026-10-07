import { NextResponse } from "next/server";
import { COOKIE, safeEqual, sessionToken } from "./lib/session";

// Every page, image and API call needs the password cookie, except the login page itself
// and the icons/manifest a phone fetches when adding the app to its home screen.
//
// Kept as middleware.js (Edge runtime) rather than Next 16's proxy.js (Node runtime):
// Netlify's CLI can't bundle a Node-runtime proxy when deploying from Windows.
export async function middleware(request) {
  const password = process.env.APP_PASSWORD;
  if (!password) {
    // Never serve a live deployment openly; only `npm run dev` runs without a password.
    if (process.env.NODE_ENV === "production") {
      return new Response("Set the APP_PASSWORD environment variable in your hosting settings, then redeploy.", {
        status: 503,
      });
    }
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE)?.value;
  if (cookie && safeEqual(cookie, await sessionToken(password))) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return new Response("Sign in first", { status: 401 });
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/((?!login|api/login|_next/static|_next/image|favicon\\.ico|icon|apple-icon|manifest\\.webmanifest).*)",
  ],
};
