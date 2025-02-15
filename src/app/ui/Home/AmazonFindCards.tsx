import { getAmazonFinds } from "@/app/lib/data";
import AmazonFindCard from "./AmazonFindCard";

export default async function AmazonFindCards() {
  const results = await getAmazonFinds();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {results.map((result) => (
        <AmazonFindCard key={result.id} {...result} />
      ))}
    </div>
  );
}
