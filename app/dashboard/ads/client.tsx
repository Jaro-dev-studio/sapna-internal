"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Megaphone,
  DollarSign,
  Eye,
  MousePointer,
  TrendingUp,
  Plus,
  Image,
  Video,
  Layers,
  Users,
  ArrowRight,
  Play,
  Pause,
  FileEdit,
} from "lucide-react";
import type { Campaign, Creative } from "@/lib/mock-data/types";

interface AdsClientProps {
  campaigns: Campaign[];
  creatives: Creative[];
  summary: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalSpend: number;
    totalRevenue: number;
    totalImpressions: number;
    totalConversions: number;
    avgRoas: number;
    totalCreatives: number;
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return new Intl.NumberFormat("en-US").format(value);
}

function getStatusColor(status: Campaign["status"] | Creative["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "PAUSED":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "DRAFT":
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    case "COMPLETED":
    case "ARCHIVED":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getPlatformIcon(platform: Campaign["platform"]): React.ReactNode {
  const className = "size-4";
  switch (platform) {
    case "META":
      return <span className={className}>Meta</span>;
    case "GOOGLE":
      return <span className={className}>Google</span>;
    case "TIKTOK":
      return <span className={className}>TikTok</span>;
    case "PINTEREST":
      return <span className={className}>Pinterest</span>;
    default:
      return null;
  }
}

function getCreativeTypeIcon(type: Creative["type"]): React.ReactNode {
  switch (type) {
    case "IMAGE":
      return <Image className="size-4" />;
    case "VIDEO":
      return <Video className="size-4" />;
    case "CAROUSEL":
      return <Layers className="size-4" />;
    case "UGC":
      return <Users className="size-4" />;
    default:
      return null;
  }
}

export function AdsClient({ campaigns, creatives, summary }: AdsClientProps) {
  const [tab, setTab] = useState("campaigns");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ads</h1>
          <p className="text-muted-foreground">
            Manage campaigns and creatives across all platforms
          </p>
        </div>
        <Button disabled>
          <Plus className="mr-2 size-4" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalSpend)}</div>
            <p className="text-xs text-muted-foreground">
              {summary.activeCampaigns} active campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-green-600 text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From ad conversions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgRoas.toFixed(2)}x</div>
            <p className="text-xs text-muted-foreground">
              Return on ad spend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.totalImpressions)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(summary.totalConversions)} conversions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="campaigns">
            <Megaphone className="mr-2 size-4" />
            Campaigns ({campaigns.length})
          </TabsTrigger>
          <TabsTrigger value="creatives">
            <Image className="mr-2 size-4" />
            Creatives ({creatives.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-6">
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
                    <Megaphone className="text-primary size-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <Badge variant="outline" className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {campaign.platform}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaign.site.name} - {campaign.objective || "General"}
                    </p>
                  </div>

                  <div className="grid grid-cols-5 gap-6 text-center">
                    <div>
                      <div className="text-xs text-muted-foreground">Spent</div>
                      <div className="font-semibold">{formatCurrency(campaign.spent)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Impressions</div>
                      <div className="font-semibold">{formatNumber(campaign.metrics?.impressions || 0)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Clicks</div>
                      <div className="font-semibold">{formatNumber(campaign.metrics?.clicks || 0)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Conv.</div>
                      <div className="font-semibold">{campaign.metrics?.conversions || 0}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">ROAS</div>
                      <div className="text-green-600 font-semibold">{(campaign.metrics?.roas || 0).toFixed(2)}x</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" disabled>
                      {campaign.status === "ACTIVE" ? (
                        <Pause className="size-4" />
                      ) : (
                        <Play className="size-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" disabled>
                      <FileEdit className="size-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      View
                      <ArrowRight className="ml-1 size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="creatives" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {creatives.map((creative) => (
              <Card key={creative.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded bg-muted">
                        {getCreativeTypeIcon(creative.type)}
                      </div>
                      <div>
                        <CardTitle className="text-sm">{creative.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {creative.type} - {creative.site.name}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(creative.status)}>
                      {creative.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {creative.headline && (
                    <p className="text-sm font-medium">{creative.headline}</p>
                  )}
                  {creative.description && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{creative.description}</p>
                  )}

                  {creative.metrics && (
                    <div className="grid grid-cols-3 gap-2 border-t pt-3">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Impr.</div>
                        <div className="text-sm font-semibold">{formatNumber(creative.metrics.impressions)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">CTR</div>
                        <div className="text-sm font-semibold">{creative.metrics.ctr.toFixed(1)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">CVR</div>
                        <div className="text-sm font-semibold">{creative.metrics.cvr.toFixed(1)}%</div>
                      </div>
                    </div>
                  )}

                  {creative.campaign && (
                    <div className="text-xs text-muted-foreground">
                      Campaign: {creative.campaign.name}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
