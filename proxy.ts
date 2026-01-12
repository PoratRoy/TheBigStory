import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function proxy(request: NextRequest) {
  // 1. Let Auth0 handle authentication routes (/auth/login, /auth/callback, etc.)
  const authResponse = await auth0.middleware(request);
  if (authResponse) return authResponse;

  // 2. Check for an active session
  const session = await auth0.getSession(request);
  const { pathname } = request.nextUrl;

  // 3. Define public paths
  // We include /sign-in and internal auth routes (already handled above but just in case)
  const isPublicPath = pathname === '/sign-in' || pathname.startsWith('/auth');

  // 4. Protection Logic
  if (!session && !isPublicPath) {
    // Redirect unauthenticated users to the custom sign-in page
    const loginUrl = new URL('/sign-in', request.url);
    // Optionally preserve the original destination
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Already authenticated users shouldn't see the sign-in page
  if (session && pathname === '/sign-in') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ]
};
