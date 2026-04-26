import { NextRequest, NextResponse } from "next/server";

interface JwtPayload {
  userId?: string;
  id?: string;
  sub?: string;
  role?: string;
  userRole?: string;
}

const getRoleFromToken = (token: string): string | undefined => {
  try {
    // Simple JWT decode without external library
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded: JwtPayload = JSON.parse(jsonPayload);
    return decoded.role || decoded.userRole;
  } catch {
    return undefined;
  }
};

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Check if user is authenticated
  if (!accessToken) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(pathName)}`, request.url)
    );
  }

  const userRole = getRoleFromToken(accessToken);

  // Admin routes - only ADMIN can access
  if (pathName.startsWith("/admin") || pathName.startsWith("/adminProfile")) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // User routes - only non-ADMIN can access
  if (
    pathName.startsWith("/profile") ||
    pathName.startsWith("/my-events") ||
    pathName.startsWith("/my-invitations")
  ) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Authorized → continue
  return NextResponse.next();
}

// Middleware paths
export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/adminProfile",
    "/profile",
    "/profile/:path*",
    "/my-events",
    "/my-events/:path*",
    "/my-invitations",
    "/my-invitations/:path*",
    "/paymentGateway",
  ],
};