export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Your Pinterest boards,
            <br />
            <span className="text-teal-600">brought to life</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Discover and shop furniture that matches your Pinterest inspiration,
            powered by AI that understands your style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors"
            >
              Get Started
            </a>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="p-6">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Connect Pinterest
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Link your Pinterest boards with one click
              </p>
            </div>

            <div className="p-6">
              <div className="text-2xl mb-3">✨</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Get Matches
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI finds products that match your style
              </p>
            </div>

            <div className="p-6">
              <div className="text-2xl mb-3">🛋️</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Shop Confidently
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Purchase furniture you know will fit your vision
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
