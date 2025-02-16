"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      setUser(data.user);
    };

    checkUser();
  }, [user]);

  const handleSignIn = async () => {
    const response = await fetch("/api/signin");
    const { url } = await response.json();

    if ()
    router.push("/home");
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    router.push("/");
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 sm:px-6 lg:px-20 pt-4">
        <div className="flex justify-between items-center">
          <a
            href="/"
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            shopy<span className="text-[#464646]">bara</span>
          </a>
          <div className="flex gap-4">
            {!user ? (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 text-[#464646] dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </button>
            ) : (
              <div className="flex items-center">
                <h1>Hi {user!.email}</h1>
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
