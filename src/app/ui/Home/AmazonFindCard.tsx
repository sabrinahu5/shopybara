import type { AmazonFindCard } from "@/app/types/amazonFinds";

export default function AmazonFindCard(results: AmazonFindCard) {
  return (
    <a href={results.url_to_product} target="_blank">
      <div className="flex flex-col gap-4 overflow-hidden text-ellipsis rounded-[10px] border border-[#F3F3FB] bg-[#FFFFFF] p-4 shadow-md">
        <div className="flex flex-col gap-3 overflow-hidden text-[#26262F]">
          <img
            src={results.image_url}
            className="h-40 w-40 border border-[#F3F3FB] object-cover"
          />
          <h1 className="font-semibold">{results.title}</h1>
        </div>
        <div className="flex flex-col gap-2 h-19 overflow-hidden text-ellipsis text-xs">
          <p>{results.description}</p>
          <p>
            <span className="font-semibold">Price:</span> {results.price}
          </p>
        </div>
      </div>
    </a>
  );
}
