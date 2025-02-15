import type { AmazonFindCard } from "@/app/types/amazonFinds";

export default function AmazonFindCard(results: AmazonFindCard) {
  return (
    <a href={results.url_to_product} target="_blank">
      <div className="h-full flex flex-col gap-4 overflow-hidden text-ellipsis rounded-[10px] bg-[#FFFFFF] shadow-md">
        <img src={results.image_url} className="w-full h-3/4 object-cover" />
        <div className="px-3 pb-3">
          <h1 className="font-semibold">{results.title}</h1>
          <div className="flex flex-col gap-2 overflow-hidden text-ellipsis text-xs pt-2">
            <p>{results.description}</p>
            <p>
              <span className="font-semibold">Price:</span> {results.price}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}
