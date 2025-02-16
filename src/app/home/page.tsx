"use client";

import { createBrowserSupabaseClient } from "@/lib/client-utils";
import AmazonFindCards from "../ui/LandingPage/AmazonFindCards";
import { playfairDisplay } from "../ui/fonts";
import PinterestModalWrapper from "./PinterestModalWrapper";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function Home() {
  // Create supabase server component client and obtain user session from Supabase Auth
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
    <div className="flex flex-col gap-6 px-20 py-4">
      <PinterestModalWrapper />
      <h1 className={`${playfairDisplay.className} antialiased text-xl`}>
        Here are is your most recently saved list of curated items:
      </h1>
      <AmazonFindCards />
      <h1
        className={`${playfairDisplay.className} antialiased text-xl text-center pt-3`}
      >
        Want to find more items?
      </h1>
    </div>
  );
}
