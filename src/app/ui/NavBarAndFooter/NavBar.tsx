import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function NavBar() {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 sm:px-6 lg:px-20 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            shopy<span className="text-[#464646]">bara</span>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 text-[#464646] dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </div>
            <div className="px-4 py-2 text-white rounded-lg transition-colors">
              <SignedOut>
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
