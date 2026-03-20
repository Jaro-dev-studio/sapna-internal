"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Megaphone, Package, Search, Store } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AnalyticsSnapshot, Campaign, Creative, ProductListing, SEOAnalysis, Site } from "@/lib/mock-data/types";

interface SiteDetailClientProps {
  site: Site;
  campaigns: Campaign[];
  creatives: Creative[];
  products: ProductListing[];
  seo: SEOAnalysis | null;
  analytics: AnalyticsSnapshot[];
  errors: string[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function SiteDetailClient({
  site,
  campaigns,
  creatives,
  products,
  seo,
  analytics,
  errors,
}: SiteDetailClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{site.name}</h1>
          <p className="text-muted-foreground">{site.domain}</p>
        </div>
        <Badge variant="outline">{site.status}</Badge>
      </div>

      {errors.length > 0 ? (
        <div className="rounded border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
          Some sections failed to load: {errors.join(", ")}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Revenue (30d)</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{formatCurrency(site.metrics.revenue30d)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{campaigns.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Creatives</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{creatives.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Products</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{products.length}</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="size-4" />
              SEO
            </CardTitle>
            <CardDescription>Latest site-level SEO analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {seo ? (
              <>
                <p className="text-sm">Overall score: <span className="font-semibold">{seo.overallScore}/100</span></p>
                <p className="text-sm text-muted-foreground">Organic traffic: {seo.organicTraffic.toLocaleString()}</p>
                <Link href={`/dashboard/seo/${site.id}`}>
                  <Button variant="outline" size="sm">
                    Open SEO Detail
                    <ArrowRight className="ml-1 size-3" />
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No SEO analysis available yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-4" />
              Analytics
            </CardTitle>
            <CardDescription>Recent site analytics snapshots</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Loaded {analytics.length} snapshots for the last 30 days.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="size-4" />
              Campaign details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {campaigns.slice(0, 5).map((campaign) => (
              <Link
                key={campaign.id}
                href={`/dashboard/ads/campaigns/${campaign.id}`}
                className="block rounded border border-border p-2 text-sm hover:bg-muted/40"
              >
                {campaign.name}
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="size-4" />
              Creative details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {creatives.slice(0, 5).map((creative) => (
              <Link
                key={creative.id}
                href={`/dashboard/ads/creatives/${creative.id}`}
                className="block rounded border border-border p-2 text-sm hover:bg-muted/40"
              >
                {creative.name}
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="size-4" />
              Product details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {products.slice(0, 5).map((product) => (
              <Link
                key={product.id}
                href={`/dashboard/products/${product.id}`}
                className="block rounded border border-border p-2 text-sm hover:bg-muted/40"
              >
                {product.title}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
