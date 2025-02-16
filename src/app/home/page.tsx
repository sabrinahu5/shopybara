import AmazonFindCards from "../ui/Home/AmazonFindCards";
import { playfairDisplay } from "../ui/fonts";
import PinterestModalWrapper from "./PinterestModalWrapper";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

export default async function Home() {
  // Create supabase server component client and obtain user session from Supabase Auth
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }
  return (
    <div className="flex flex-col gap-6 px-20 py-4">
      <PinterestModalWrapper />
      <h1 className={`${playfairDisplay.className} antialiased text-xl`}>
        Here are your most recently saved list of curated items:
      </h1>
      <AmazonFindCards />
      <h1
        className={`${playfairDisplay.className} antialiased text-xl text-center pt-3`}
      >
        Want to find more items?
      </h1>
      <a
        href={`${process.env.FRONTEND_URL}/home?newUser=true`}
        className="flex justify-center"
      >
        <div className="w-[80px] px-4 py-2 b text-[#262626] bg-[#FFFFFF] border-gray-300 border rounded-md shadow-md">
          Yes!!!!
        </div>
      </a>
    </div>
  );
}
