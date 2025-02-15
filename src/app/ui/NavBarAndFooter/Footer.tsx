export default function NavBar() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            shopy<span className="text-teal-600">bara</span>
          </div>
          <div className="flex gap-6">
            <a
              href="/privacy"
              className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
