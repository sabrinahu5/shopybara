"use client";
import { redirect } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function Onboarding() {
  const supabase = createBrowserSupabaseClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      hi
    </div>
  );
}
