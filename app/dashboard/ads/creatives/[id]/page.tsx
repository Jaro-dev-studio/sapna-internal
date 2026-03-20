import { getCreative } from "@/lib/fetchers";
import { CreativeDetailClient } from "./client";

interface CreativeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CreativeDetailPage({ params }: CreativeDetailPageProps) {
  const { id } = await params;
  const { data: creative, error } = await getCreative(id);

  if (!creative || error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{error || "Creative not found"}</p>
      </div>
    );
  }

  return <CreativeDetailClient creative={creative} />;
}
