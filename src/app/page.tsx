"use client";

import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SpotifyAlbumDemo from "./ui/Home/SpotifyAlbumDemo";
import { InfiniteMovingCards } from "./ui/Home/InfiniteMovingCards";
import { WordRotate } from "./ui/Home/FlipWords";

const amazonFinds = [
  {
    id: "1",
    profile_id: "default",
    created_at: new Date(),
    title: "Modern Velvet Accent Chair",
    description:
      "Luxurious velvet armchair with gold-finished steel legs, perfect for living room corners",
    url_to_product: "https://amazon.com/sample-product-1",
    image_url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
    price: "$299.99",
  },
  {
    id: "2",
    profile_id: "default",
    created_at: new Date(),
    title: "Minimalist Coffee Table",
    description: "Scandinavian-style wooden coffee table with white marble top",
    url_to_product: "https://amazon.com/sample-product-2",
    image_url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88",
    price: "$199.99",
  },
  {
    id: "3",
    profile_id: "default",
    created_at: new Date(),
    title: "Geometric Area Rug 5x7",
    description:
      "Contemporary geometric pattern rug in neutral tones, soft pile height",
    url_to_product: "https://amazon.com/sample-product-3",
    image_url:
      "https://plus.unsplash.com/premium_photo-1725570022235-31331a924383?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$129.99",
  },
  {
    id: "4",
    profile_id: "default",
    created_at: new Date(),
    title: "Industrial Pendant Light",
    description: "Matte black metal pendant light with exposed bulb design",
    url_to_product: "https://amazon.com/sample-product-4",
    image_url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f",
    price: "$89.99",
  },
  {
    id: "5",
    profile_id: "default",
    created_at: new Date(),
    title: "Floating Wall Shelves Set",
    description: "Set of 3 wooden floating shelves with hidden brackets",
    url_to_product: "https://amazon.com/sample-product-5",
    image_url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d",
    price: "$49.99",
  },
];

export default function LandingPage() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const words = ["Spotify", "Pinterest"];

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push("/onboarding");
      }
    };

    checkUser();
  }, [supabase, router]);

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Sign up error:", error.message);
      return;
    }
  };

  return (
    <div className="dark:bg-gray-900">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center">
        <div className="px-4 sm:px-6 lg:px-20 w-full">
          <div className="text-left max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-relaxed">
              <span>Your </span>
              <WordRotate words={words} /> <br />
              <span> Turned to Room Inspo</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              Discover and shop furniture that matches your Pinterest
              inspiration, powered by AI that understands your style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-right mb-16">
              <button
                onClick={handleSignUp}
                className="px-8 py-0.5  border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] "
              >
                Get Started
              </button>
            </div>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            {/* Scroll down indicator */}
            <div className="animate-bounce">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                See how it works
              </p>
              <svg
                className="w-6 h-6 mx-auto text-gray-600 dark:text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <div className="w-full">
          <SpotifyAlbumDemo />
          <InfiniteMovingCards
            items={amazonFinds}
            direction="right"
            speed="fast"
          />
        </div>
      </section>
    </div>
  );
}
