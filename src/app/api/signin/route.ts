import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `http://${process.env.FRONTEND_URL}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    provider: "google",
    url: data.url,
  });
}
