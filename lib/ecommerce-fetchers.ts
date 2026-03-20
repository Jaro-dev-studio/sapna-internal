"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type {
  AnalyticsSnapshot,
  AnalyticsSummary,
  Campaign,
  Creative,
  ProductListing,
  ProductSuggestion,
  SEOAnalysis,
  SEOIssue,
  SEOKeyword,
  SEORecommendation,
  Site,
  TopPage,
  TopProduct,
  TopSource,
} from "@/lib/mock-data/types";

interface SiteDashboardSummary {
  totalSites: number;
  activeSites: number;
  totalRevenue: number;
  totalOrders: number;
  totalVisitors: number;
  avgConversionRate: number;
}

interface AdsDashboardSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpend: number;
  totalRevenue: number;
  totalImpressions: number;
  totalConversions: number;
  avgRoas: number;
  totalCreatives: number;
}

interface SEODashboardSummary {
  avgScore: number;
  totalKeywords: number;
  totalKeywordsTop10: number;
  totalOrganicTraffic: number;
  totalBacklinks: number;
  totalCriticalIssues: number;
  sitesAnalyzed: number;
}

interface ProductsDashboardSummary {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  avgOptimizationScore: number;
  productsNeedingOptimization: number;
  totalInventory: number;
}

interface SiteMetricAccumulator {
  revenue30d: number;
  orders30d: number;
  visitors30d: number;
  conversionRate: number;
  averageOrderValue: number;
}

function parseJsonArray<T>(value: Prisma.JsonValue | null | undefined): T[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value as T[];
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function getSiteMetrics(
  snapshots: Array<{ revenue: number; orders: number; visitors: number }>
): SiteMetricAccumulator {
  const revenue30d = snapshots.reduce((sum, snapshot) => sum + snapshot.revenue, 0);
  const orders30d = snapshots.reduce((sum, snapshot) => sum + snapshot.orders, 0);
  const visitors30d = snapshots.reduce((sum, snapshot) => sum + snapshot.visitors, 0);
  const conversionRate = visitors30d > 0 ? (orders30d / visitors30d) * 100 : 0;
  const averageOrderValue = orders30d > 0 ? revenue30d / orders30d : 0;

  return {
    revenue30d: roundToTwoDecimals(revenue30d),
    orders30d,
    visitors30d,
    conversionRate: roundToTwoDecimals(conversionRate),
    averageOrderValue: roundToTwoDecimals(averageOrderValue),
  };
}

function mapSiteToDashboardShape(
  site: {
    id: string;
    name: string;
    domain: string;
    platform: string;
    status: "ACTIVE" | "PAUSED" | "DISCONNECTED";
    description: string | null;
    logoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    analyticsData: Array<{ revenue: number; orders: number; visitors: number }>;
  }
): Site {
  const metrics = getSiteMetrics(site.analyticsData);

  return {
    id: site.id,
    name: site.name,
    domain: site.domain,
    platform: "shopify",
    status: site.status,
    description: site.description,
    logoUrl: site.logoUrl,
    metrics,
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
  };
}

function mapCampaign(
  campaign: {
    id: string;
    name: string;
    description: string | null;
    platform: Campaign["platform"];
    status: Campaign["status"];
    objective: string | null;
    budget: number;
    dailyBudget: number;
    spent: number;
    startDate: Date | null;
    endDate: Date | null;
    siteId: string;
    site: { id: string; name: string };
    metrics: {
      impressions: number;
      clicks: number;
      conversions: number;
      spend: number;
      revenue: number;
      ctr: number;
      cpc: number;
      cpm: number;
      roas: number;
    } | null;
    _count: { creatives: number };
    createdAt: Date;
    updatedAt: Date;
  }
): Campaign {
  return {
    id: campaign.id,
    name: campaign.name,
    description: campaign.description,
    platform: campaign.platform,
    status: campaign.status,
    objective: campaign.objective,
    budget: campaign.budget,
    dailyBudget: campaign.dailyBudget,
    spent: campaign.spent,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    siteId: campaign.siteId,
    site: campaign.site,
    metrics: campaign.metrics
      ? {
        impressions: campaign.metrics.impressions,
        clicks: campaign.metrics.clicks,
        conversions: campaign.metrics.conversions,
        spend: campaign.metrics.spend,
        revenue: campaign.metrics.revenue,
        ctr: campaign.metrics.ctr,
        cpc: campaign.metrics.cpc,
        cpm: campaign.metrics.cpm,
        roas: campaign.metrics.roas,
      }
      : null,
    creativesCount: campaign._count.creatives,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
  };
}

function mapCreative(
  creative: {
    id: string;
    name: string;
    type: Creative["type"];
    status: Creative["status"];
    headline: string | null;
    description: string | null;
    callToAction: string | null;
    imageUrl: string | null;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    siteId: string;
    site: { id: string; name: string };
    campaignId: string | null;
    campaign: { id: string; name: string } | null;
    metrics: {
      impressions: number;
      clicks: number;
      conversions: number;
      spend: number;
      ctr: number;
      cvr: number;
    } | null;
    createdAt: Date;
    updatedAt: Date;
  }
): Creative {
  return {
    id: creative.id,
    name: creative.name,
    type: creative.type,
    status: creative.status,
    headline: creative.headline,
    description: creative.description,
    callToAction: creative.callToAction,
    imageUrl: creative.imageUrl,
    videoUrl: creative.videoUrl,
    thumbnailUrl: creative.thumbnailUrl,
    siteId: creative.siteId,
    site: creative.site,
    campaignId: creative.campaignId,
    campaign: creative.campaign,
    metrics: creative.metrics
      ? {
        impressions: creative.metrics.impressions,
        clicks: creative.metrics.clicks,
        conversions: creative.metrics.conversions,
        spend: creative.metrics.spend,
        ctr: creative.metrics.ctr,
        cvr: creative.metrics.cvr,
      }
      : null,
    createdAt: creative.createdAt,
    updatedAt: creative.updatedAt,
  };
}

function mapSEOAnalysis(
  analysis: {
    id: string;
    siteId: string;
    site: { id: string; name: string; domain: string };
    overallScore: number;
    technicalScore: number;
    onPageScore: number;
    contentScore: number;
    backlinksScore: number;
    totalKeywords: number;
    keywordsTop10: number;
    keywordsTop100: number;
    organicTraffic: number;
    backlinksCount: number;
    domainAuthority: number;
    issues: Prisma.JsonValue | null;
    recommendations: Prisma.JsonValue | null;
    keywords: Array<{
      id: string;
      keyword: string;
      position: number | null;
      previousPosition: number | null;
      searchVolume: number;
      difficulty: number;
      url: string | null;
    }>;
    analyzedAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }
): SEOAnalysis {
  const issues = parseJsonArray<SEOIssue>(analysis.issues);
  const recommendations = parseJsonArray<SEORecommendation>(analysis.recommendations);
  const keywords: SEOKeyword[] = analysis.keywords.map((keyword) => {
    const change =
      keyword.position !== null && keyword.previousPosition !== null
        ? keyword.previousPosition - keyword.position
        : 0;

    return {
      id: keyword.id,
      keyword: keyword.keyword,
      position: keyword.position,
      previousPosition: keyword.previousPosition,
      change,
      searchVolume: keyword.searchVolume,
      difficulty: keyword.difficulty,
      url: keyword.url,
    };
  });

  return {
    id: analysis.id,
    siteId: analysis.siteId,
    site: analysis.site,
    overallScore: analysis.overallScore,
    technicalScore: analysis.technicalScore,
    onPageScore: analysis.onPageScore,
    contentScore: analysis.contentScore,
    backlinksScore: analysis.backlinksScore,
    totalKeywords: analysis.totalKeywords,
    keywordsTop10: analysis.keywordsTop10,
    keywordsTop100: analysis.keywordsTop100,
    organicTraffic: analysis.organicTraffic,
    backlinksCount: analysis.backlinksCount,
    domainAuthority: analysis.domainAuthority,
    issues,
    recommendations,
    keywords,
    analyzedAt: analysis.analyzedAt,
    createdAt: analysis.createdAt,
    updatedAt: analysis.updatedAt,
  };
}

function mapProductListing(
  product: {
    id: string;
    siteId: string;
    site: { id: string; name: string };
    externalId: string | null;
    title: string;
    description: string | null;
    price: number;
    compareAtPrice: number | null;
    imageUrl: string | null;
    images: Prisma.JsonValue | null;
    category: string | null;
    tags: string[];
    inventory: number;
    sku: string | null;
    status: ProductListing["status"];
    seoTitle: string | null;
    seoDescription: string | null;
    optimizationScore: number;
    optimizationSuggestions: Prisma.JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
  }
): ProductListing {
  const images = parseJsonArray<string>(product.images);
  const optimizationSuggestions = parseJsonArray<ProductSuggestion>(product.optimizationSuggestions);

  return {
    id: product.id,
    siteId: product.siteId,
    site: product.site,
    externalId: product.externalId,
    title: product.title,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    imageUrl: product.imageUrl,
    images,
    category: product.category,
    tags: product.tags,
    inventory: product.inventory,
    sku: product.sku,
    status: product.status,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    optimizationScore: product.optimizationScore,
    optimizationSuggestions,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function mapAnalyticsSnapshot(
  snapshot: {
    id: string;
    siteId: string;
    date: Date;
    revenue: number;
    orders: number;
    averageOrderValue: number;
    visitors: number;
    pageViews: number;
    bounceRate: number;
    conversionRate: number;
    cartAbandonment: number;
    topProducts: Prisma.JsonValue | null;
    topSources: Prisma.JsonValue | null;
    topPages: Prisma.JsonValue | null;
  }
): AnalyticsSnapshot {
  return {
    id: snapshot.id,
    siteId: snapshot.siteId,
    date: snapshot.date,
    revenue: snapshot.revenue,
    orders: snapshot.orders,
    averageOrderValue: snapshot.averageOrderValue,
    visitors: snapshot.visitors,
    pageViews: snapshot.pageViews,
    bounceRate: snapshot.bounceRate,
    conversionRate: snapshot.conversionRate,
    cartAbandonment: snapshot.cartAbandonment,
    topProducts: parseJsonArray<TopProduct>(snapshot.topProducts),
    topSources: parseJsonArray<TopSource>(snapshot.topSources),
    topPages: parseJsonArray<TopPage>(snapshot.topPages),
  };
}

function buildSitesSummary(sites: Site[]): SiteDashboardSummary {
  const activeSites = sites.filter((site) => site.status === "ACTIVE").length;
  const totalRevenue = sites.reduce((sum, site) => sum + site.metrics.revenue30d, 0);
  const totalOrders = sites.reduce((sum, site) => sum + site.metrics.orders30d, 0);
  const totalVisitors = sites.reduce((sum, site) => sum + site.metrics.visitors30d, 0);
  const avgConversionRate =
    sites.length > 0
      ? sites.reduce((sum, site) => sum + site.metrics.conversionRate, 0) / sites.length
      : 0;

  return {
    totalSites: sites.length,
    activeSites,
    totalRevenue: roundToTwoDecimals(totalRevenue),
    totalOrders,
    totalVisitors,
    avgConversionRate: roundToTwoDecimals(avgConversionRate),
  };
}

function buildAdsSummary(campaigns: Campaign[], creatives: Creative[]): AdsDashboardSummary {
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "ACTIVE").length;
  const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalRevenue = campaigns.reduce(
    (sum, campaign) => sum + (campaign.metrics?.revenue ?? 0),
    0
  );
  const totalImpressions = campaigns.reduce(
    (sum, campaign) => sum + (campaign.metrics?.impressions ?? 0),
    0
  );
  const totalConversions = campaigns.reduce(
    (sum, campaign) => sum + (campaign.metrics?.conversions ?? 0),
    0
  );

  return {
    totalCampaigns: campaigns.length,
    activeCampaigns,
    totalSpend: roundToTwoDecimals(totalSpend),
    totalRevenue: roundToTwoDecimals(totalRevenue),
    totalImpressions,
    totalConversions,
    avgRoas: totalSpend > 0 ? roundToTwoDecimals(totalRevenue / totalSpend) : 0,
    totalCreatives: creatives.length,
  };
}

function buildSEOSummary(analyses: SEOAnalysis[]): SEODashboardSummary {
  const totalScores = analyses.reduce((sum, analysis) => sum + analysis.overallScore, 0);
  const totalKeywords = analyses.reduce((sum, analysis) => sum + analysis.totalKeywords, 0);
  const totalKeywordsTop10 = analyses.reduce((sum, analysis) => sum + analysis.keywordsTop10, 0);
  const totalOrganicTraffic = analyses.reduce((sum, analysis) => sum + analysis.organicTraffic, 0);
  const totalBacklinks = analyses.reduce((sum, analysis) => sum + analysis.backlinksCount, 0);
  const totalCriticalIssues = analyses.reduce(
    (sum, analysis) =>
      sum + analysis.issues.filter((issue) => issue.severity === "critical").length,
    0
  );

  return {
    avgScore: analyses.length > 0 ? Math.round(totalScores / analyses.length) : 0,
    totalKeywords,
    totalKeywordsTop10,
    totalOrganicTraffic,
    totalBacklinks,
    totalCriticalIssues,
    sitesAnalyzed: analyses.length,
  };
}

function buildProductsSummary(products: ProductListing[]): ProductsDashboardSummary {
  const totalProducts = products.length;
  const activeProducts = products.filter((product) => product.status === "ACTIVE").length;
  const outOfStock = products.filter((product) => product.status === "OUT_OF_STOCK").length;
  const totalOptimizationScore = products.reduce(
    (sum, product) => sum + product.optimizationScore,
    0
  );
  const productsNeedingOptimization = products.filter(
    (product) => product.optimizationScore < 70
  ).length;
  const totalInventory = products.reduce((sum, product) => sum + product.inventory, 0);

  return {
    totalProducts,
    activeProducts,
    outOfStock,
    avgOptimizationScore:
      totalProducts > 0 ? Math.round(totalOptimizationScore / totalProducts) : 0,
    productsNeedingOptimization,
    totalInventory,
  };
}

export async function getSites(): Promise<{
  data: Site[] | null;
  error: string | null;
}> {
  try {
    console.log("[Sites] Fetching all sites from database...");

    const sites = await prisma.site.findMany({
      include: {
        analyticsData: {
          select: {
            revenue: true,
            orders: true,
            visitors: true,
          },
          orderBy: { date: "desc" },
          take: 30,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedSites = sites.map(mapSiteToDashboardShape);
    return { data: mappedSites, error: null };
  } catch (error) {
    console.error("Error fetching sites:", error);
    return { data: null, error: "Failed to fetch sites" };
  }
}

export async function getSite(id: string): Promise<{
  data: Site | null;
  error: string | null;
}> {
  try {
    console.log("[Sites] Fetching site from database:", id);

    const site = await prisma.site.findUnique({
      where: { id },
      include: {
        analyticsData: {
          select: {
            revenue: true,
            orders: true,
            visitors: true,
          },
          orderBy: { date: "desc" },
          take: 30,
        },
      },
    });

    if (!site) {
      return { data: null, error: "Site not found" };
    }

    return { data: mapSiteToDashboardShape(site), error: null };
  } catch (error) {
    console.error("Error fetching site:", error);
    return { data: null, error: "Failed to fetch site" };
  }
}

export async function getSitesDashboardData(): Promise<{
  data: {
    sites: Site[];
    summary: SiteDashboardSummary;
  } | null;
  error: string | null;
}> {
  try {
    console.log("[Sites] Fetching sites dashboard data from database...");

    const { data: sites, error } = await getSites();
    if (error || !sites) {
      return { data: null, error: error ?? "Failed to fetch sites" };
    }

    return {
      data: {
        sites,
        summary: buildSitesSummary(sites),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching sites dashboard:", error);
    return { data: null, error: "Failed to fetch sites dashboard" };
  }
}

export async function getCampaigns(): Promise<{
  data: Campaign[] | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching campaigns from database...");

    const campaigns = await prisma.campaign.findMany({
      include: {
        site: { select: { id: true, name: true } },
        metrics: true,
        _count: { select: { creatives: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: campaigns.map(mapCampaign), error: null };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return { data: null, error: "Failed to fetch campaigns" };
  }
}

export async function getCampaign(id: string): Promise<{
  data: Campaign | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching campaign from database:", id);

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        site: { select: { id: true, name: true } },
        metrics: true,
        _count: { select: { creatives: true } },
      },
    });

    if (!campaign) {
      return { data: null, error: "Campaign not found" };
    }

    return { data: mapCampaign(campaign), error: null };
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return { data: null, error: "Failed to fetch campaign" };
  }
}

export async function getCampaignsForSite(siteId: string): Promise<{
  data: Campaign[] | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching campaigns for site from database:", siteId);

    const campaigns = await prisma.campaign.findMany({
      where: { siteId },
      include: {
        site: { select: { id: true, name: true } },
        metrics: true,
        _count: { select: { creatives: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: campaigns.map(mapCampaign), error: null };
  } catch (error) {
    console.error("Error fetching site campaigns:", error);
    return { data: null, error: "Failed to fetch campaigns" };
  }
}

export async function getCreatives(): Promise<{
  data: Creative[] | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching creatives from database...");

    const creatives = await prisma.creative.findMany({
      include: {
        site: { select: { id: true, name: true } },
        campaign: { select: { id: true, name: true } },
        metrics: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: creatives.map(mapCreative), error: null };
  } catch (error) {
    console.error("Error fetching creatives:", error);
    return { data: null, error: "Failed to fetch creatives" };
  }
}

export async function getCreativesForSite(siteId: string): Promise<{
  data: Creative[] | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching creatives for site from database:", siteId);

    const creatives = await prisma.creative.findMany({
      where: { siteId },
      include: {
        site: { select: { id: true, name: true } },
        campaign: { select: { id: true, name: true } },
        metrics: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: creatives.map(mapCreative), error: null };
  } catch (error) {
    console.error("Error fetching site creatives:", error);
    return { data: null, error: "Failed to fetch creatives" };
  }
}

export async function getCreativesForCampaign(campaignId: string): Promise<{
  data: Creative[] | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching creatives for campaign from database:", campaignId);

    const creatives = await prisma.creative.findMany({
      where: { campaignId },
      include: {
        site: { select: { id: true, name: true } },
        campaign: { select: { id: true, name: true } },
        metrics: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: creatives.map(mapCreative), error: null };
  } catch (error) {
    console.error("Error fetching campaign creatives:", error);
    return { data: null, error: "Failed to fetch creatives" };
  }
}

export async function getAdsDashboardData(): Promise<{
  data: {
    campaigns: Campaign[];
    creatives: Creative[];
    summary: AdsDashboardSummary;
  } | null;
  error: string | null;
}> {
  try {
    console.log("[Ads] Fetching ads dashboard data from database...");

    const [campaignsResult, creativesResult] = await Promise.all([
      getCampaigns(),
      getCreatives(),
    ]);

    if (campaignsResult.error || !campaignsResult.data) {
      return { data: null, error: campaignsResult.error ?? "Failed to fetch campaigns" };
    }

    if (creativesResult.error || !creativesResult.data) {
      return { data: null, error: creativesResult.error ?? "Failed to fetch creatives" };
    }

    return {
      data: {
        campaigns: campaignsResult.data,
        creatives: creativesResult.data,
        summary: buildAdsSummary(campaignsResult.data, creativesResult.data),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching ads dashboard:", error);
    return { data: null, error: "Failed to fetch ads dashboard" };
  }
}

export async function getSEOAnalyses(): Promise<{
  data: SEOAnalysis[] | null;
  error: string | null;
}> {
  try {
    console.log("[SEO] Fetching SEO analyses from database...");

    const analyses = await prisma.sEOAnalysis.findMany({
      include: {
        site: { select: { id: true, name: true, domain: true } },
        keywords: {
          select: {
            id: true,
            keyword: true,
            position: true,
            previousPosition: true,
            searchVolume: true,
            difficulty: true,
            url: true,
          },
          orderBy: { trackedAt: "desc" },
        },
      },
      orderBy: { analyzedAt: "desc" },
    });

    return { data: analyses.map(mapSEOAnalysis), error: null };
  } catch (error) {
    console.error("Error fetching SEO analyses:", error);
    return { data: null, error: "Failed to fetch SEO analyses" };
  }
}

export async function getSEOAnalysisForSite(siteId: string): Promise<{
  data: SEOAnalysis | null;
  error: string | null;
}> {
  try {
    console.log("[SEO] Fetching SEO analysis for site from database:", siteId);

    const analysis = await prisma.sEOAnalysis.findFirst({
      where: { siteId },
      include: {
        site: { select: { id: true, name: true, domain: true } },
        keywords: {
          select: {
            id: true,
            keyword: true,
            position: true,
            previousPosition: true,
            searchVolume: true,
            difficulty: true,
            url: true,
          },
          orderBy: { trackedAt: "desc" },
        },
      },
      orderBy: { analyzedAt: "desc" },
    });

    if (!analysis) {
      return { data: null, error: "SEO analysis not found for this site" };
    }

    return { data: mapSEOAnalysis(analysis), error: null };
  } catch (error) {
    console.error("Error fetching site SEO analysis:", error);
    return { data: null, error: "Failed to fetch SEO analysis" };
  }
}

export async function getSEODashboardData(): Promise<{
  data: {
    analyses: SEOAnalysis[];
    summary: SEODashboardSummary;
  } | null;
  error: string | null;
}> {
  try {
    console.log("[SEO] Fetching SEO dashboard data from database...");

    const { data: analyses, error } = await getSEOAnalyses();
    if (error || !analyses) {
      return { data: null, error: error ?? "Failed to fetch SEO analyses" };
    }

    return {
      data: {
        analyses,
        summary: buildSEOSummary(analyses),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching SEO dashboard:", error);
    return { data: null, error: "Failed to fetch SEO dashboard" };
  }
}

export async function getProductListings(): Promise<{
  data: ProductListing[] | null;
  error: string | null;
}> {
  try {
    console.log("[Products] Fetching product listings from database...");

    const products = await prisma.productListing.findMany({
      include: {
        site: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: products.map(mapProductListing), error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: null, error: "Failed to fetch products" };
  }
}

export async function getProductListing(id: string): Promise<{
  data: ProductListing | null;
  error: string | null;
}> {
  try {
    console.log("[Products] Fetching product from database:", id);

    const product = await prisma.productListing.findUnique({
      where: { id },
      include: {
        site: { select: { id: true, name: true } },
      },
    });

    if (!product) {
      return { data: null, error: "Product not found" };
    }

    return { data: mapProductListing(product), error: null };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { data: null, error: "Failed to fetch product" };
  }
}

export async function getProductsForSite(siteId: string): Promise<{
  data: ProductListing[] | null;
  error: string | null;
}> {
  try {
    console.log("[Products] Fetching products for site from database:", siteId);

    const products = await prisma.productListing.findMany({
      where: { siteId },
      include: {
        site: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: products.map(mapProductListing), error: null };
  } catch (error) {
    console.error("Error fetching site products:", error);
    return { data: null, error: "Failed to fetch products" };
  }
}

export async function getProductsDashboardData(): Promise<{
  data: {
    products: ProductListing[];
    summary: ProductsDashboardSummary;
  } | null;
  error: string | null;
}> {
  try {
    console.log("[Products] Fetching products dashboard data from database...");

    const { data: products, error } = await getProductListings();
    if (error || !products) {
      return { data: null, error: error ?? "Failed to fetch products" };
    }

    return {
      data: {
        products,
        summary: buildProductsSummary(products),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching products dashboard:", error);
    return { data: null, error: "Failed to fetch products dashboard" };
  }
}

export async function getAnalyticsDashboardData(days: number = 30): Promise<{
  data: AnalyticsSummary | null;
  error: string | null;
}> {
  try {
    console.log("[Analytics] Fetching analytics dashboard data from database...");

    const sites = await prisma.site.findMany({
      select: {
        id: true,
        name: true,
        analyticsData: {
          select: {
            date: true,
            revenue: true,
            orders: true,
            visitors: true,
          },
          orderBy: { date: "desc" },
          take: days * 2,
        },
      },
    });

    let totalRevenue = 0;
    let totalOrders = 0;
    let totalVisitors = 0;
    let previousTotalRevenue = 0;
    let previousTotalOrders = 0;
    let previousTotalVisitors = 0;

    const dailyDataMap: Map<string, { revenue: number; orders: number; visitors: number }> =
      new Map();
    const siteBreakdown: AnalyticsSummary["siteBreakdown"] = [];

    for (const site of sites) {
      const sortedSnapshots = [...site.analyticsData].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );
      const recentSnapshots = sortedSnapshots.slice(-days);
      const previousSnapshots = sortedSnapshots.slice(-days * 2, -days);

      const siteRevenue = recentSnapshots.reduce((sum, snapshot) => sum + snapshot.revenue, 0);
      const siteOrders = recentSnapshots.reduce((sum, snapshot) => sum + snapshot.orders, 0);
      const siteVisitors = recentSnapshots.reduce((sum, snapshot) => sum + snapshot.visitors, 0);

      totalRevenue += siteRevenue;
      totalOrders += siteOrders;
      totalVisitors += siteVisitors;

      previousTotalRevenue += previousSnapshots.reduce(
        (sum, snapshot) => sum + snapshot.revenue,
        0
      );
      previousTotalOrders += previousSnapshots.reduce(
        (sum, snapshot) => sum + snapshot.orders,
        0
      );
      previousTotalVisitors += previousSnapshots.reduce(
        (sum, snapshot) => sum + snapshot.visitors,
        0
      );

      siteBreakdown.push({
        siteId: site.id,
        siteName: site.name,
        revenue: roundToTwoDecimals(siteRevenue),
        orders: siteOrders,
        visitors: siteVisitors,
        conversionRate: siteVisitors > 0 ? roundToTwoDecimals((siteOrders / siteVisitors) * 100) : 0,
      });

      for (const snapshot of recentSnapshots) {
        const dateKey = snapshot.date.toISOString().split("T")[0];
        const current = dailyDataMap.get(dateKey) ?? { revenue: 0, orders: 0, visitors: 0 };
        dailyDataMap.set(dateKey, {
          revenue: current.revenue + snapshot.revenue,
          orders: current.orders + snapshot.orders,
          visitors: current.visitors + snapshot.visitors,
        });
      }
    }

    const dailyData = [...dailyDataMap.entries()]
      .map(([date, metrics]) => ({
        date,
        revenue: roundToTwoDecimals(metrics.revenue),
        orders: metrics.orders,
        visitors: metrics.visitors,
      }))
      .sort((firstDay, secondDay) => firstDay.date.localeCompare(secondDay.date));

    const avgConversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const revenueChange =
      previousTotalRevenue > 0
        ? ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100
        : 0;
    const ordersChange =
      previousTotalOrders > 0
        ? ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100
        : 0;
    const visitorsChange =
      previousTotalVisitors > 0
        ? ((totalVisitors - previousTotalVisitors) / previousTotalVisitors) * 100
        : 0;
    const previousConversionRate =
      previousTotalVisitors > 0
        ? (previousTotalOrders / previousTotalVisitors) * 100
        : 0;
    const conversionChange =
      previousConversionRate > 0
        ? ((avgConversionRate - previousConversionRate) / previousConversionRate) * 100
        : 0;

    return {
      data: {
        totalRevenue: roundToTwoDecimals(totalRevenue),
        totalOrders,
        totalVisitors,
        avgConversionRate: roundToTwoDecimals(avgConversionRate),
        avgOrderValue: roundToTwoDecimals(avgOrderValue),
        revenueChange: Math.round(revenueChange * 10) / 10,
        ordersChange: Math.round(ordersChange * 10) / 10,
        visitorsChange: Math.round(visitorsChange * 10) / 10,
        conversionChange: Math.round(conversionChange * 10) / 10,
        dailyData,
        siteBreakdown: siteBreakdown.sort((firstSite, secondSite) => secondSite.revenue - firstSite.revenue),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching analytics dashboard:", error);
    return { data: null, error: "Failed to fetch analytics" };
  }
}

export async function getSiteAnalytics(siteId: string, days: number = 30): Promise<{
  data: AnalyticsSnapshot[] | null;
  error: string | null;
}> {
  try {
    console.log("[Analytics] Fetching site analytics from database:", siteId);

    const snapshots = await prisma.analyticsSnapshot.findMany({
      where: { siteId },
      orderBy: { date: "desc" },
      take: days,
    });

    const orderedSnapshots = snapshots
      .map(mapAnalyticsSnapshot)
      .sort((firstSnapshot, secondSnapshot) => firstSnapshot.date.getTime() - secondSnapshot.date.getTime());

    return { data: orderedSnapshots, error: null };
  } catch (error) {
    console.error("Error fetching site analytics:", error);
    return { data: null, error: "Failed to fetch site analytics" };
  }
}
