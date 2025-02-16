import { getAmazonFinds } from "@/app/lib/data";
import { createServerSupabaseClient } from "@/lib/server-utils";
import AmazonFindCard from "./AmazonFindCard";

export default async function AmazonFindCards() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const amazonFinds = await getAmazonFinds(user.id);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {amazonFinds.map((find) => (
        <AmazonFindCard key={find.id} {...find} />
      ))}
    </div>
  );
}
