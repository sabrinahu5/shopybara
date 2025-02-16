import { SignUpButton } from "@clerk/nextjs";
import SpotifyAlbumDemo from "./ui/Home/SpotifyAlbumDemo";

export default function LandingPage() {
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
              <SignUpButton mode="modal">
                <button className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors">
                  Get Started
                </button>
              </SignUpButton>
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
        </div>
      </section>
    </div>
  );
}
