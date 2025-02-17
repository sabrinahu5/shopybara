import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      // Check if user has completed onboarding
      const hasCompletedOnboarding = user.user_metadata.has_completed_onboarding;

      // Create response with cookies
      const response = NextResponse.redirect(
        hasCompletedOnboarding ? `${origin}/home` : `${origin}/onboarding`
      );

      // Copy over the cookies from the supabase response
      const supabaseCookies = cookieStore.getAll();
      supabaseCookies.forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, cookie);
      });

      return response;
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
