import AmazonFindCards from "../ui/Home/AmazonFindCards";

export default async function Home() {
  return (
    <div>
      <h1 className="text-center text-2xl">
        Here is are your saved lists of curated items:
      </h1>
      <AmazonFindCards />
    </div>
  );
}
