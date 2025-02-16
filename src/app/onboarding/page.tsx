import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Onboarding() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <p>Hello {data.user.email}</p>
    </div>
  );
}
