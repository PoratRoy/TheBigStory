import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./auth";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // 1. Define public paths
  const isPublicPath = pathname === '/sign-in' || pathname.startsWith('/api/auth');

  // 2. Protection Logic
  if (!session && !isPublicPath) {
    const loginUrl = new URL('/sign-in', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Already authenticated users shouldn't see the sign-in page
  if (session && pathname === '/sign-in') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ]
};
