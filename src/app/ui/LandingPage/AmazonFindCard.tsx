import type { AmazonFindCard } from "@/app/types/amazonFinds";
import { DirectionAwareHover } from "./DirectionAwareHover";
import Link from "next/link";

export default function AmazonFindCard(results: AmazonFindCard) {
  return (
    <Link href={results.url_to_product} target="_blank" rel="noopener noreferrer">
      <DirectionAwareHover
        imageUrl={results.image_url}
        imageClassName="object-contain hover:object-cover p-2"
      >
        <div className="space-y-2">
          <h3 className="font-bold text-lg line-clamp-2">{results.title}</h3>
          <p className="text-sm opacity-80">{results.price}</p>
        </div>
      </DirectionAwareHover>
    </Link>
  );
}
