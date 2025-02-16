import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getAmazonFinds(userId: string) {
  const { data, error } = await supabase
    .from("amazon_finds")
    .select("*")
    .eq('profile_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  return data;
}
