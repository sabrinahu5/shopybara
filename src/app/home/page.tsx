import { createClient } from "@/utils/supabase/server";
import AmazonFindCards from "../ui/LandingPage/AmazonFindCards";
import { playfairDisplay } from "../ui/fonts";
import PinterestModalWrapper from "./PinterestModalWrapper";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
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
