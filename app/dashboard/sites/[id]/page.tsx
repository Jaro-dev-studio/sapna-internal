import { getCampaignsForSite, getCreativesForSite, getProductsForSite, getSEOAnalysisForSite, getSite, getSiteAnalytics } from "@/lib/fetchers";
import { SiteDetailClient } from "./client";

interface SiteDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SiteDetailPage({ params }: SiteDetailPageProps) {
  const { id } = await params;

  const [
    { data: site, error: siteError },
    { data: campaigns, error: campaignsError },
    { data: creatives, error: creativesError },
    { data: products, error: productsError },
    { data: seo, error: seoError },
    { data: analytics, error: analyticsError },
  ] = await Promise.all([
    getSite(id),
    getCampaignsForSite(id),
    getCreativesForSite(id),
    getProductsForSite(id),
    getSEOAnalysisForSite(id),
    getSiteAnalytics(id, 30),
  ]);

  if (!site || siteError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{siteError || "Site not found"}</p>
      </div>
    );
  }

  return (
    <SiteDetailClient
      site={site}
      campaigns={campaigns ?? []}
      creatives={creatives ?? []}
      products={products ?? []}
      seo={seo}
      analytics={analytics ?? []}
      errors={[campaignsError, creativesError, productsError, seoError, analyticsError].filter(Boolean) as string[]}
    />
  );
}
