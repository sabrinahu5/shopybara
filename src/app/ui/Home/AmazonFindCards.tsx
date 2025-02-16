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
    <Carousel className="w-full">
      <CarouselContent className="-ml-2 md:-ml-4">
        {results.map((result) => (
          <CarouselItem key={result.id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
            <AmazonFindCard key={result.id} {...result} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
