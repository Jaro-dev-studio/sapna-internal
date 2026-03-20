"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Megaphone,
  DollarSign,
  Eye,
  TrendingUp,
  Plus,
  Image,
  Video,
  Layers,
  Users,
  ArrowRight,
  Play,
  Pause,
  Link2,
  RefreshCcw,
} from "lucide-react";
import {
  connectAdPlatform,
  createAdCampaign,
  createAdCreative,
  disconnectAdPlatform,
  syncAdPlatformConnection,
} from "@/lib/actions";
import type { Campaign, Creative, Site } from "@/lib/mock-data/types";
import type { AdPlatformConnectionData } from "@/lib/ecommerce-fetchers";

interface AdsClientProps {
  campaigns: Campaign[];
  creatives: Creative[];
  sites: Site[];
  connections: AdPlatformConnectionData[];
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

function getConnectionStatusColor(status: AdPlatformConnectionData["status"]): string {
  if (status === "CONNECTED") return "bg-green-500/10 text-green-600 border-green-500/20";
  if (status === "ERROR") return "bg-red-500/10 text-red-600 border-red-500/20";
  return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
}

export function AdsClient({ campaigns, creatives, sites, connections, summary }: AdsClientProps) {
  const [tab, setTab] = useState("campaigns");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [connectionForm, setConnectionForm] = useState({
    siteId: sites[0]?.id ?? "",
    platform: "META" as "META" | "GOOGLE",
    accountId: "",
    accountName: "",
  });
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    siteId: sites[0]?.id ?? "",
    platform: "META" as Campaign["platform"],
    objective: "",
    budget: "0",
    dailyBudget: "0",
  });
  const [creativeForm, setCreativeForm] = useState({
    name: "",
    type: "IMAGE" as Creative["type"],
    siteId: sites[0]?.id ?? "",
    campaignId: "none",
    headline: "",
    callToAction: "",
  });

  async function handleCreateCampaign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await createAdCampaign({
        name: campaignForm.name,
        siteId: campaignForm.siteId,
        platform: campaignForm.platform,
        objective: campaignForm.objective || undefined,
        budget: Number(campaignForm.budget) || 0,
        dailyBudget: Number(campaignForm.dailyBudget) || 0,
      });

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setCampaignForm((current) => ({
        ...current,
        name: "",
        objective: "",
      }));
      setMessage("Campaign created.");
    });
  }

  async function handleCreateCreative(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await createAdCreative({
        name: creativeForm.name,
        type: creativeForm.type,
        siteId: creativeForm.siteId,
        campaignId: creativeForm.campaignId === "none" ? undefined : creativeForm.campaignId,
        headline: creativeForm.headline || undefined,
        callToAction: creativeForm.callToAction || undefined,
      });

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setCreativeForm((current) => ({
        ...current,
        name: "",
        headline: "",
        callToAction: "",
      }));
      setMessage("Creative created.");
    });
  }

  async function handleConnectPlatform(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await connectAdPlatform({
        siteId: connectionForm.siteId,
        platform: connectionForm.platform,
        accountId: connectionForm.accountId,
        accountName: connectionForm.accountName,
      });

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setConnectionForm((current) => ({
        ...current,
        accountId: "",
        accountName: "",
      }));
      setMessage("Platform connected.");
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ads</h1>
          <p className="text-muted-foreground">
            Manage campaigns and creatives across all platforms
          </p>
        </div>
        <Button onClick={() => setTab("campaigns")}>
          <Plus className="mr-2 size-4" />
          Create Campaign
        </Button>
      </div>

      {message ? (
        <div className="rounded border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
          {message}
        </div>
      ) : null}

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
          <TabsTrigger value="integrations">
            <Link2 className="mr-2 size-4" />
            Integrations ({connections.length})
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Megaphone className="mr-2 size-4" />
            Campaigns ({campaigns.length})
          </TabsTrigger>
          <TabsTrigger value="creatives">
            <Image className="mr-2 size-4" />
            Creatives ({creatives.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected ad platforms</CardTitle>
              <CardDescription>
                Connect and manage Google Ads / Meta account links per site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between rounded border border-border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {connection.site.name} - {connection.platform}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {connection.accountName || "No account name"} ({connection.accountId || "N/A"})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getConnectionStatusColor(connection.status)}>
                      {connection.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          const result = await syncAdPlatformConnection(connection.id);
                          setMessage(result.error ?? "Connection synced.");
                        })
                      }
                    >
                      <RefreshCcw className="mr-1 size-3" />
                      Sync
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          const result = await disconnectAdPlatform(connection.id);
                          setMessage(result.error ?? "Connection disconnected.");
                        })
                      }
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connect new platform</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3 md:grid-cols-2" onSubmit={handleConnectPlatform}>
                <div className="space-y-1">
                  <Label>Site</Label>
                  <Select
                    value={connectionForm.siteId}
                    onValueChange={(value) => setConnectionForm((current) => ({ ...current, siteId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Platform</Label>
                  <Select
                    value={connectionForm.platform}
                    onValueChange={(value) =>
                      setConnectionForm((current) => ({
                        ...current,
                        platform: value as "META" | "GOOGLE",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="META">Meta</SelectItem>
                      <SelectItem value="GOOGLE">Google Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Account ID</Label>
                  <Input
                    required
                    value={connectionForm.accountId}
                    onChange={(event) =>
                      setConnectionForm((current) => ({ ...current, accountId: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Account Name</Label>
                  <Input
                    required
                    value={connectionForm.accountName}
                    onChange={(event) =>
                      setConnectionForm((current) => ({ ...current, accountName: event.target.value }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={isPending}>
                    Connect Platform
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Create campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3 md:grid-cols-3" onSubmit={handleCreateCampaign}>
                <div className="space-y-1 md:col-span-3">
                  <Label>Campaign name</Label>
                  <Input
                    required
                    value={campaignForm.name}
                    onChange={(event) =>
                      setCampaignForm((current) => ({ ...current, name: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Site</Label>
                  <Select
                    value={campaignForm.siteId}
                    onValueChange={(value) => setCampaignForm((current) => ({ ...current, siteId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Platform</Label>
                  <Select
                    value={campaignForm.platform}
                    onValueChange={(value) =>
                      setCampaignForm((current) => ({
                        ...current,
                        platform: value as Campaign["platform"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="META">Meta</SelectItem>
                      <SelectItem value="GOOGLE">Google</SelectItem>
                      <SelectItem value="TIKTOK">TikTok</SelectItem>
                      <SelectItem value="PINTEREST">Pinterest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Objective</Label>
                  <Input
                    value={campaignForm.objective}
                    onChange={(event) =>
                      setCampaignForm((current) => ({ ...current, objective: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Budget</Label>
                  <Input
                    type="number"
                    value={campaignForm.budget}
                    onChange={(event) =>
                      setCampaignForm((current) => ({ ...current, budget: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Daily budget</Label>
                  <Input
                    type="number"
                    value={campaignForm.dailyBudget}
                    onChange={(event) =>
                      setCampaignForm((current) => ({ ...current, dailyBudget: event.target.value }))
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={isPending}>
                    Create
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

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
                    <Link href={`/dashboard/ads/campaigns/${campaign.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                        <ArrowRight className="ml-1 size-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="creatives" className="mt-6">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Create creative</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3 md:grid-cols-3" onSubmit={handleCreateCreative}>
                <div className="space-y-1 md:col-span-3">
                  <Label>Creative name</Label>
                  <Input
                    required
                    value={creativeForm.name}
                    onChange={(event) =>
                      setCreativeForm((current) => ({ ...current, name: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Type</Label>
                  <Select
                    value={creativeForm.type}
                    onValueChange={(value) =>
                      setCreativeForm((current) => ({ ...current, type: value as Creative["type"] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IMAGE">Image</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="CAROUSEL">Carousel</SelectItem>
                      <SelectItem value="UGC">UGC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Site</Label>
                  <Select
                    value={creativeForm.siteId}
                    onValueChange={(value) => setCreativeForm((current) => ({ ...current, siteId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Campaign</Label>
                  <Select
                    value={creativeForm.campaignId}
                    onValueChange={(value) =>
                      setCreativeForm((current) => ({ ...current, campaignId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No campaign</SelectItem>
                      {campaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Headline</Label>
                  <Input
                    value={creativeForm.headline}
                    onChange={(event) =>
                      setCreativeForm((current) => ({ ...current, headline: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Call to action</Label>
                  <Input
                    value={creativeForm.callToAction}
                    onChange={(event) =>
                      setCreativeForm((current) => ({
                        ...current,
                        callToAction: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={isPending}>
                    Create
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

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

                  <div className="flex justify-end border-t pt-3">
                    <Link href={`/dashboard/ads/creatives/${creative.id}`}>
                      <Button size="sm" variant="ghost">
                        View Details
                        <ArrowRight className="ml-1 size-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
