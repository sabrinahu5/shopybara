"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

export default function NavBar() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []); // Empty dependency array

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `http://${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.url) {
        router.push(data.url);
      }

      redirect("/onboarding");
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 sm:px-6 lg:px-20 pt-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              shopy<span className="text-[#464646]">bara</span>
            </div>
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 sm:px-6 lg:px-20 pt-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            shopy<span className="text-[#464646]">bara</span>
          </div>
          <div className="flex gap-4">
            {!user ? (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 text-[#464646] dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-[#464646] dark:text-gray-300">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-[#464646] dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
