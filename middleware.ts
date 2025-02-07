import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function matchRoute(route: string, path: string): boolean {
  const routeSegments = route.split("/").filter(Boolean);
  const pathSegments = path.split("/").filter(Boolean);

  if (routeSegments.length !== pathSegments.length) {
    return false;
  }

  return routeSegments.every((segment, index) => {
    return segment.startsWith(":") || segment === pathSegments[index];
  });
}

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) return NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
  matcher: ["/create-blog"],
};
