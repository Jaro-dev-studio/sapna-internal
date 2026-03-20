import { getSEOAnalysisForSite } from "@/lib/fetchers";
import { SEODetailClient } from "./client";

interface SEODetailPageProps {
  params: Promise<{ siteId: string }>;
}

export default async function SEODetailPage({ params }: SEODetailPageProps) {
  const { siteId } = await params;
  const { data, error } = await getSEOAnalysisForSite(siteId);

  if (!data || error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{error || "SEO analysis not found"}</p>
      </div>
    );
  }

  return <SEODetailClient analysis={data} />;
}
