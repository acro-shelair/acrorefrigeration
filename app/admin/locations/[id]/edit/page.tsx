import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CityEditor from "../../CityEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function CityEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: city } = await supabase
    .from("location_cities")
    .select("*")
    .eq("id", id)
    .single();
  if (!city) notFound();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CityEditor city={city} />
    </div>
  );
}
