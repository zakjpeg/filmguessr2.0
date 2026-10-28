
import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export default async function middleware(request: NextRequest) {
  return createClient(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
