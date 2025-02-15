import { getAmazonFinds } from "@/app/lib/data";
import AmazonFindCard from "./AmazonFindCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default async function AmazonFindCards() {
  const results = await getAmazonFinds();

  return (
    <Carousel>
      <CarouselContent>
        {results.map((result) => (
          <CarouselItem key={result.id} className="h-[24rem] basis-1/4">
            <AmazonFindCard key={result.id} {...result} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
