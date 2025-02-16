export default function Footer() {
  return (
    <div className="border-t border-gray-200 dark:border-gray-800">
      <div className="px-4 sm:px-6 lg:px-20 py-6">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            shopy<span className="text-[#464646]">bara</span>
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
    </div>
  );
}
