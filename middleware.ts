import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Always allow access - no authentication required
  return NextResponse.next();
}

export const config = {
  matcher: ["/booking", "/driver-dashboard", "/tracking"],
};