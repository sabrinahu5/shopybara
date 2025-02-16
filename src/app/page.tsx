'use client'

import { createBrowserSupabaseClient } from "@/lib/client-utils";
import SpotifyAlbumDemo from "./ui/Home/SpotifyAlbumDemo";
import { InfiniteMovingCards } from "./ui/Home/InfiniteMovingCards";

const amazonFinds = [
  {
    id: "1",
    created_at: new Date(),
    title: "Modern Velvet Accent Chair",
    description: "Luxurious velvet armchair with gold-finished steel legs, perfect for living room corners",
    url_to_product: "https://amazon.com/sample-product-1",
    image_url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
    price: "$299.99"
  },
  {
    id: "2",
    created_at: new Date(),
    title: "Minimalist Coffee Table",
    description: "Scandinavian-style wooden coffee table with white marble top",
    url_to_product: "https://amazon.com/sample-product-2",
    image_url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88",
    price: "$199.99"
  },
  {
    id: "3",
    created_at: new Date(),
    title: "Geometric Area Rug 5x7",
    description: "Contemporary geometric pattern rug in neutral tones, soft pile height",
    url_to_product: "https://amazon.com/sample-product-3",
    image_url: "https://images.unsplash.com/photo-1531985673600-75d2b348ad3c",
    price: "$129.99"
  },
  {
    id: "4",
    created_at: new Date(),
    title: "Industrial Pendant Light",
    description: "Matte black metal pendant light with exposed bulb design",
    url_to_product: "https://amazon.com/sample-product-4",
    image_url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f",
    price: "$89.99"
  },
  {
    id: "5",
    created_at: new Date(),
    title: "Floating Wall Shelves Set",
    description: "Set of 3 wooden floating shelves with hidden brackets",
    url_to_product: "https://amazon.com/sample-product-5",
    image_url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d",
    price: "$49.99"
  }
];

export default async function LandingPage() {
  const supabase = createBrowserSupabaseClient();

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      }
    });

    if (error) {
      console.error('Sign up error:', error.message);
      return;
    }
  };

  return (
    <div className="dark:bg-gray-900">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center">
        <div className="px-4 sm:px-6 lg:px-20 w-full">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              <small>your</small> Spotify Songs <small>&</small> Pinterest Boards,
              <br />
              <span className="">Turned to Room Inspos</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              Discover and shop furniture that matches your Pinterest inspiration,
              powered by AI that understands your style.
            </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={handleSignUp}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors"
            >
              Get Started
            </button>
          </div>

            {/* Features Section - Moved here */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="p-6 rounded-lg">
                <div className="text-2xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Connect Pinterest
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Link your Pinterest boards with one click
                </p>
              </div>

              <div className="p-6 rounded-lg">
                <div className="text-2xl mb-3">✨</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Get Matches
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI finds products that match your style
                </p>
              </div>

              <div className="p-6 rounded-lg">
                <div className="text-2xl mb-3">🛋️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Shop Confidently
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Purchase furniture you know will fit your vision
                </p>
              </div>
            </div>

            {/* Scroll down indicator */}
            <div className="animate-bounce">
              <p className="text-gray-600 dark:text-gray-400 mb-2">See how it works</p>
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
