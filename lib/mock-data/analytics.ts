import { AnalyticsSnapshot, AnalyticsSummary, TopProduct, TopSource, TopPage } from "./types";
import { mockSites } from "./sites";

function generateDailyData(siteId: string, days: number = 30): AnalyticsSnapshot[] {
  const snapshots: AnalyticsSnapshot[] = [];
  const today = new Date();
  
  const baseMetrics: Record<string, { revenue: number; orders: number; visitors: number }> = {
    site_1: { revenue: 4248, orders: 11, visitors: 950 },
    site_2: { revenue: 2977, orders: 19, visitors: 1410 },
    site_3: { revenue: 2163, orders: 27, visitors: 1173 },
    site_4: { revenue: 5226, orders: 14, visitors: 1737 },
    site_5: { revenue: 782, orders: 8, visitors: 413 },
  };

  const base = baseMetrics[siteId] || baseMetrics.site_1;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1;
    const randomVariation = 0.8 + Math.random() * 0.4;
    
    const revenue = Math.round(base.revenue * weekendMultiplier * randomVariation * 100) / 100;
    const orders = Math.round(base.orders * weekendMultiplier * randomVariation);
    const visitors = Math.round(base.visitors * weekendMultiplier * randomVariation);
    const pageViews = Math.round(visitors * (2 + Math.random()));
    
    snapshots.push({
      id: `snapshot_${siteId}_${i}`,
      siteId,
      date,
      revenue,
      orders,
      averageOrderValue: orders > 0 ? Math.round((revenue / orders) * 100) / 100 : 0,
      visitors,
      pageViews,
      bounceRate: 35 + Math.random() * 20,
      conversionRate: orders > 0 ? Math.round((orders / visitors) * 10000) / 100 : 0,
      cartAbandonment: 60 + Math.random() * 15,
      topProducts: getTopProductsForSite(siteId),
      topSources: getTopSourcesForSite(),
      topPages: getTopPagesForSite(siteId),
    });
  }

  return snapshots;
}

function getTopProductsForSite(siteId: string): TopProduct[] {
  const productsBysite: Record<string, TopProduct[]> = {
    site_1: [
      { id: "prod_1", name: "Velvet Accent Chair", revenue: 8249.85, units: 15 },
      { id: "prod_2", name: "Abstract Wall Art Set", revenue: 3799.80, units: 20 },
      { id: "top_3", name: "Marble Coffee Table", revenue: 2399.97, units: 3 },
    ],
    site_2: [
      { id: "prod_3", name: "Resistance Bands Set", revenue: 2799.30, units: 70 },
      { id: "prod_4", name: "Premium Yoga Mat", revenue: 2249.55, units: 45 },
      { id: "top_6", name: "Adjustable Dumbbells", revenue: 4499.85, units: 15 },
    ],
    site_3: [
      { id: "prod_5", name: "Hydrating Face Serum", revenue: 4050.00, units: 90 },
      { id: "prod_6", name: "Vitamin C Cream", revenue: 2660.00, units: 70 },
      { id: "top_9", name: "Rose Hip Oil", revenue: 1680.00, units: 60 },
    ],
    site_4: [
      { id: "prod_7", name: "Wireless Earbuds Pro", revenue: 7799.40, units: 60 },
      { id: "prod_8", name: "Smart Watch Band", revenue: 1749.65, units: 85 },
      { id: "top_12", name: "USB-C Hub", revenue: 2099.70, units: 42 },
    ],
    site_5: [
      { id: "prod_9", name: "Dog Puzzle Toy", revenue: 999.50, units: 50 },
      { id: "prod_10", name: "Premium Cat Tree", revenue: 1799.80, units: 20 },
      { id: "top_15", name: "Pet Carrier Bag", revenue: 899.85, units: 15 },
    ],
  };
  
  return productsBysite[siteId] || productsBysite.site_1;
}

function getTopSourcesForSite(): TopSource[] {
  return [
    { source: "Google Organic", visitors: Math.round(300 + Math.random() * 200), conversions: Math.round(5 + Math.random() * 10) },
    { source: "Facebook Ads", visitors: Math.round(200 + Math.random() * 150), conversions: Math.round(4 + Math.random() * 8) },
    { source: "Direct", visitors: Math.round(150 + Math.random() * 100), conversions: Math.round(3 + Math.random() * 5) },
    { source: "Instagram", visitors: Math.round(100 + Math.random() * 80), conversions: Math.round(2 + Math.random() * 4) },
    { source: "Email", visitors: Math.round(80 + Math.random() * 50), conversions: Math.round(3 + Math.random() * 6) },
  ];
}

function getTopPagesForSite(siteId: string): TopPage[] {
  const pages: Record<string, TopPage[]> = {
    site_1: [
      { path: "/", views: 2450, avgTimeOnPage: 45 },
      { path: "/collections/living-room", views: 1230, avgTimeOnPage: 78 },
      { path: "/products/velvet-chair", views: 890, avgTimeOnPage: 120 },
    ],
    site_2: [
      { path: "/", views: 3200, avgTimeOnPage: 38 },
      { path: "/collections/equipment", views: 1560, avgTimeOnPage: 65 },
      { path: "/products/resistance-bands", views: 1120, avgTimeOnPage: 95 },
    ],
    site_3: [
      { path: "/", views: 2100, avgTimeOnPage: 52 },
      { path: "/collections/skincare", views: 1450, avgTimeOnPage: 88 },
      { path: "/products/face-serum", views: 980, avgTimeOnPage: 145 },
    ],
    site_4: [
      { path: "/", views: 4100, avgTimeOnPage: 32 },
      { path: "/collections/audio", views: 1890, avgTimeOnPage: 56 },
      { path: "/products/earbuds-pro", views: 1340, avgTimeOnPage: 110 },
    ],
    site_5: [
      { path: "/", views: 980, avgTimeOnPage: 42 },
      { path: "/collections/dog-toys", views: 520, avgTimeOnPage: 68 },
      { path: "/collections/cat-furniture", views: 380, avgTimeOnPage: 75 },
    ],
  };
  
  return pages[siteId] || pages.site_1;
}

let cachedSnapshots: Map<string, AnalyticsSnapshot[]> | null = null;

export function getAllAnalyticsSnapshots(): Map<string, AnalyticsSnapshot[]> {
  if (!cachedSnapshots) {
    cachedSnapshots = new Map();
    mockSites.forEach(site => {
      cachedSnapshots!.set(site.id, generateDailyData(site.id, 30));
    });
  }
  return cachedSnapshots;
}

export function getAnalyticsForSite(siteId: string, days: number = 30): AnalyticsSnapshot[] {
  const allSnapshots = getAllAnalyticsSnapshots();
  const siteSnapshots = allSnapshots.get(siteId) || [];
  return siteSnapshots.slice(-days);
}

export function getAnalyticsSummary(days: number = 30): AnalyticsSummary {
  const allSnapshots = getAllAnalyticsSnapshots();
  
  let totalRevenue = 0;
  let totalOrders = 0;
  let totalVisitors = 0;
  let prevTotalRevenue = 0;
  let prevTotalOrders = 0;
  let prevTotalVisitors = 0;
  
  const siteBreakdown: AnalyticsSummary["siteBreakdown"] = [];
  const dailyDataMap: Map<string, { revenue: number; orders: number; visitors: number }> = new Map();
  
  mockSites.forEach(site => {
    const snapshots = allSnapshots.get(site.id) || [];
    const recentSnapshots = snapshots.slice(-days);
    const previousSnapshots = snapshots.slice(-days * 2, -days);
    
    const siteRevenue = recentSnapshots.reduce((sum, s) => sum + s.revenue, 0);
    const siteOrders = recentSnapshots.reduce((sum, s) => sum + s.orders, 0);
    const siteVisitors = recentSnapshots.reduce((sum, s) => sum + s.visitors, 0);
    
    totalRevenue += siteRevenue;
    totalOrders += siteOrders;
    totalVisitors += siteVisitors;
    
    prevTotalRevenue += previousSnapshots.reduce((sum, s) => sum + s.revenue, 0);
    prevTotalOrders += previousSnapshots.reduce((sum, s) => sum + s.orders, 0);
    prevTotalVisitors += previousSnapshots.reduce((sum, s) => sum + s.visitors, 0);
    
    siteBreakdown.push({
      siteId: site.id,
      siteName: site.name,
      revenue: Math.round(siteRevenue * 100) / 100,
      orders: siteOrders,
      visitors: siteVisitors,
      conversionRate: siteVisitors > 0 ? Math.round((siteOrders / siteVisitors) * 10000) / 100 : 0,
    });
    
    recentSnapshots.forEach(snapshot => {
      const dateKey = snapshot.date.toISOString().split("T")[0];
      const existing = dailyDataMap.get(dateKey) || { revenue: 0, orders: 0, visitors: 0 };
      dailyDataMap.set(dateKey, {
        revenue: existing.revenue + snapshot.revenue,
        orders: existing.orders + snapshot.orders,
        visitors: existing.visitors + snapshot.visitors,
      });
    });
  });
  
  const dailyData = Array.from(dailyDataMap.entries())
    .map(([date, data]) => ({
      date,
      revenue: Math.round(data.revenue * 100) / 100,
      orders: data.orders,
      visitors: data.visitors,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  const avgConversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const revenueChange = prevTotalRevenue > 0 ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 : 0;
  const ordersChange = prevTotalOrders > 0 ? ((totalOrders - prevTotalOrders) / prevTotalOrders) * 100 : 0;
  const visitorsChange = prevTotalVisitors > 0 ? ((totalVisitors - prevTotalVisitors) / prevTotalVisitors) * 100 : 0;
  const prevConversionRate = prevTotalVisitors > 0 ? (prevTotalOrders / prevTotalVisitors) * 100 : 0;
  const conversionChange = prevConversionRate > 0 ? ((avgConversionRate - prevConversionRate) / prevConversionRate) * 100 : 0;
  
  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    totalVisitors,
    avgConversionRate: Math.round(avgConversionRate * 100) / 100,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    revenueChange: Math.round(revenueChange * 10) / 10,
    ordersChange: Math.round(ordersChange * 10) / 10,
    visitorsChange: Math.round(visitorsChange * 10) / 10,
    conversionChange: Math.round(conversionChange * 10) / 10,
    dailyData,
    siteBreakdown: siteBreakdown.sort((a, b) => b.revenue - a.revenue),
  };
}
