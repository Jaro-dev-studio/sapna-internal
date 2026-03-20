import { Site } from "./types";

export const mockSites: Site[] = [
  {
    id: "site_1",
    name: "Luxe Home Decor",
    domain: "luxehomedecor.com",
    platform: "shopify",
    status: "ACTIVE",
    description: "Premium home decor and furnishing products",
    logoUrl: null,
    metrics: {
      revenue30d: 127450.00,
      orders30d: 342,
      visitors30d: 28500,
      conversionRate: 1.2,
      averageOrderValue: 372.66,
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "site_2",
    name: "FitGear Pro",
    domain: "fitgearpro.com",
    platform: "shopify",
    status: "ACTIVE",
    description: "Fitness equipment and athletic wear",
    logoUrl: null,
    metrics: {
      revenue30d: 89320.00,
      orders30d: 567,
      visitors30d: 42300,
      conversionRate: 1.34,
      averageOrderValue: 157.53,
    },
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "site_3",
    name: "Organic Beauty Co",
    domain: "organicbeautyco.com",
    platform: "shopify",
    status: "ACTIVE",
    description: "Natural and organic skincare products",
    logoUrl: null,
    metrics: {
      revenue30d: 64890.00,
      orders30d: 823,
      visitors30d: 35200,
      conversionRate: 2.34,
      averageOrderValue: 78.85,
    },
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "site_4",
    name: "TechHub Gadgets",
    domain: "techhubgadgets.com",
    platform: "shopify",
    status: "ACTIVE",
    description: "Consumer electronics and tech accessories",
    logoUrl: null,
    metrics: {
      revenue30d: 156780.00,
      orders30d: 412,
      visitors30d: 52100,
      conversionRate: 0.79,
      averageOrderValue: 380.53,
    },
    createdAt: new Date("2023-11-01"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "site_5",
    name: "Pet Paradise",
    domain: "petparadiseshop.com",
    platform: "shopify",
    status: "PAUSED",
    description: "Pet supplies and accessories",
    logoUrl: null,
    metrics: {
      revenue30d: 23450.00,
      orders30d: 234,
      visitors30d: 12400,
      conversionRate: 1.89,
      averageOrderValue: 100.21,
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-15"),
  },
];

export function getSiteById(id: string): Site | undefined {
  return mockSites.find(site => site.id === id);
}

export function getSitesSummary() {
  const activeSites = mockSites.filter(s => s.status === "ACTIVE").length;
  const totalRevenue = mockSites.reduce((sum, s) => sum + s.metrics.revenue30d, 0);
  const totalOrders = mockSites.reduce((sum, s) => sum + s.metrics.orders30d, 0);
  const totalVisitors = mockSites.reduce((sum, s) => sum + s.metrics.visitors30d, 0);
  const avgConversionRate = mockSites.reduce((sum, s) => sum + s.metrics.conversionRate, 0) / mockSites.length;

  return {
    totalSites: mockSites.length,
    activeSites,
    totalRevenue,
    totalOrders,
    totalVisitors,
    avgConversionRate,
  };
}
