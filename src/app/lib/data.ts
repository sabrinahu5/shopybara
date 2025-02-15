import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getAmazonFinds() {
  const { data, error } = await supabase.from("amazon_finds").select("*");
  if (error) {
    throw error;
  }
  return data;
}
