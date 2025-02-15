import AmazonFindCards from "../ui/Home/AmazonFindCards";
import { playfairDisplay } from "../ui/fonts";
import PinterestModalWrapper from "./PinterestModalWrapper";

export default async function Home() {
  return (
    <div className="flex flex-col gap-6 px-20 py-4">
      <PinterestModalWrapper />
      <h1 className={`${playfairDisplay.className} antialiased text-xl`}>
        Here are your most recently saved list of curated items:
      </h1>
      <AmazonFindCards />
      <h1 className={`${playfairDisplay.className} antialiased text-xl text-center pt-3`}>
        Want to find more items?
      </h1>
    </div>
  );
}
