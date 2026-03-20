import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_MEMBER_PERMISSIONS,
  DEFAULT_VIEWER_PERMISSIONS,
} from "../config/permissions";
import { mockSites } from "../lib/mock-data/sites";
import { mockCampaigns, mockCreatives } from "../lib/mock-data/ads";
import { mockSEOAnalyses } from "../lib/mock-data/seo";
import { mockProducts } from "../lib/mock-data/products";
import { getAllAnalyticsSnapshots } from "../lib/mock-data/analytics";

const prisma = new PrismaClient();
const DEFAULT_ADMIN_EMAIL = "jaroslav.vorobey@gmail.com";
const LEGACY_ADMIN_EMAILS = ["admin@internal-tools.local"];
const DEFAULT_ADMIN_PASSWORD = "asdfghjklkjhgfdsa";

function normalizeSnapshotDate(date: Date): Date {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

async function main() {
  console.log("[Seed] Creating system roles...");

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: { permissions: DEFAULT_ADMIN_PERMISSIONS as any },
    create: {
      name: "Admin",
      description: "Full access to all resources and pages",
      isSystem: true,
      permissions: DEFAULT_ADMIN_PERMISSIONS as any,
    },
  });

  const memberRole = await prisma.role.upsert({
    where: { name: "Member" },
    update: { permissions: DEFAULT_MEMBER_PERMISSIONS as any },
    create: {
      name: "Member",
      description: "Standard access to tasks and recurring tasks",
      isSystem: true,
      permissions: DEFAULT_MEMBER_PERMISSIONS as any,
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: "Viewer" },
    update: { permissions: DEFAULT_VIEWER_PERMISSIONS as any },
    create: {
      name: "Viewer",
      description: "Read-only access to tasks",
      isSystem: true,
      permissions: DEFAULT_VIEWER_PERMISSIONS as any,
    },
  });

  console.log("[Seed] System roles created:", { adminRole: adminRole.id, memberRole: memberRole.id, viewerRole: viewerRole.id });

  const roleMap: Record<string, string> = {
    ADMIN: adminRole.id,
    MEMBER: memberRole.id,
    VIEWER: viewerRole.id,
  };

  const usersWithoutRole = await prisma.user.findMany({
    where: { roleId: null },
  });

  console.log(`[Seed] Migrating ${usersWithoutRole.length} users to role-based system...`);

  for (const user of usersWithoutRole) {
    const roleId = roleMap[user.role];
    if (roleId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { roleId },
      });
      console.log(`[Seed] Assigned user ${user.email} (${user.role}) -> roleId ${roleId}`);
    }
  }

  console.log("[Seed] Creating/updating admin user...");
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  for (const legacyEmail of LEGACY_ADMIN_EMAILS) {
    if (legacyEmail === adminEmail) {
      continue;
    }

    const legacyAdmin = await prisma.user.findUnique({
      where: { email: legacyEmail },
      select: { id: true },
    });

    if (!legacyAdmin) {
      continue;
    }

    const targetAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { id: true },
    });

    if (targetAdmin) {
      await prisma.user.delete({ where: { id: legacyAdmin.id } });
      console.log(`[Seed] Removed legacy admin user: ${legacyEmail}`);
      continue;
    }

    await prisma.user.update({
      where: { id: legacyAdmin.id },
      data: { email: adminEmail },
    });
    console.log(`[Seed] Migrated admin email ${legacyEmail} -> ${adminEmail}`);
  }

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPasswordHash,
      role: "ADMIN",
      roleId: adminRole.id,
      firstName: "Admin",
      lastName: "User",
    },
    create: {
      email: adminEmail,
      password: adminPasswordHash,
      role: "ADMIN",
      roleId: adminRole.id,
      firstName: "Admin",
      lastName: "User",
    },
  });
  console.log(`[Seed] Admin user ready: ${adminEmail}`);

  console.log("[Seed] Resetting existing e-commerce seed dataset...");
  await prisma.campaignMetrics.deleteMany();
  await prisma.creativeMetrics.deleteMany();
  await prisma.sEOKeyword.deleteMany();
  await prisma.analyticsSnapshot.deleteMany();
  await prisma.creative.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.sEOAnalysis.deleteMany();
  await prisma.productListing.deleteMany();
  await prisma.site.deleteMany();

  console.log("[Seed] Seeding sites...");
  for (const site of mockSites) {
    await prisma.site.create({
      data: {
        id: site.id,
        name: site.name,
        domain: site.domain,
        platform: site.platform,
        status: site.status,
        description: site.description,
        logoUrl: site.logoUrl,
        createdAt: site.createdAt,
        updatedAt: site.updatedAt,
      },
    });
  }

  console.log("[Seed] Seeding campaigns and campaign metrics...");
  for (const campaign of mockCampaigns) {
    await prisma.campaign.create({
      data: {
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
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
      },
    });

    if (campaign.metrics) {
      await prisma.campaignMetrics.create({
        data: {
          campaignId: campaign.id,
          impressions: campaign.metrics.impressions,
          clicks: campaign.metrics.clicks,
          conversions: campaign.metrics.conversions,
          spend: campaign.metrics.spend,
          revenue: campaign.metrics.revenue,
          ctr: campaign.metrics.ctr,
          cpc: campaign.metrics.cpc,
          cpm: campaign.metrics.cpm,
          roas: campaign.metrics.roas,
        },
      });
    }
  }

  console.log("[Seed] Seeding creatives and creative metrics...");
  for (const creative of mockCreatives) {
    await prisma.creative.create({
      data: {
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
        campaignId: creative.campaignId,
        createdAt: creative.createdAt,
        updatedAt: creative.updatedAt,
      },
    });

    if (creative.metrics) {
      await prisma.creativeMetrics.create({
        data: {
          creativeId: creative.id,
          impressions: creative.metrics.impressions,
          clicks: creative.metrics.clicks,
          conversions: creative.metrics.conversions,
          spend: creative.metrics.spend,
          ctr: creative.metrics.ctr,
          cvr: creative.metrics.cvr,
        },
      });
    }
  }

  console.log("[Seed] Seeding SEO analyses and keywords...");
  for (const analysis of mockSEOAnalyses) {
    await prisma.sEOAnalysis.create({
      data: {
        id: analysis.id,
        siteId: analysis.siteId,
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
        issues: analysis.issues as unknown as Prisma.JsonArray,
        recommendations: analysis.recommendations as unknown as Prisma.JsonArray,
        analyzedAt: analysis.analyzedAt,
        createdAt: analysis.createdAt,
        updatedAt: analysis.updatedAt,
      },
    });

    await prisma.sEOKeyword.createMany({
      data: analysis.keywords.map((keyword) => ({
        id: keyword.id,
        seoAnalysisId: analysis.id,
        keyword: keyword.keyword,
        position: keyword.position,
        previousPosition: keyword.previousPosition,
        searchVolume: keyword.searchVolume,
        difficulty: keyword.difficulty,
        url: keyword.url,
        trackedAt: analysis.analyzedAt,
      })),
      skipDuplicates: true,
    });
  }

  console.log("[Seed] Seeding product listings...");
  for (const product of mockProducts) {
    await prisma.productListing.create({
      data: {
        id: product.id,
        siteId: product.siteId,
        externalId: product.externalId,
        title: product.title,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        imageUrl: product.imageUrl,
        images: product.images as unknown as Prisma.JsonArray,
        category: product.category,
        tags: product.tags,
        inventory: product.inventory,
        sku: product.sku,
        status: product.status,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        optimizationScore: product.optimizationScore,
        optimizationSuggestions: product.optimizationSuggestions as unknown as Prisma.JsonArray,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
  }

  console.log("[Seed] Seeding analytics snapshots...");
  const analyticsSnapshotsBySite = getAllAnalyticsSnapshots();
  for (const [siteId, snapshots] of analyticsSnapshotsBySite.entries()) {
    for (const snapshot of snapshots) {
      const date = normalizeSnapshotDate(snapshot.date);
      await prisma.analyticsSnapshot.upsert({
        where: { siteId_date: { siteId, date } },
        update: {
          revenue: snapshot.revenue,
          orders: snapshot.orders,
          averageOrderValue: snapshot.averageOrderValue,
          visitors: snapshot.visitors,
          pageViews: snapshot.pageViews,
          bounceRate: snapshot.bounceRate,
          conversionRate: snapshot.conversionRate,
          cartAbandonment: snapshot.cartAbandonment,
          topProducts: snapshot.topProducts as unknown as Prisma.JsonArray,
          topSources: snapshot.topSources as unknown as Prisma.JsonArray,
          topPages: snapshot.topPages as unknown as Prisma.JsonArray,
        },
        create: {
          id: snapshot.id,
          siteId,
          date,
          revenue: snapshot.revenue,
          orders: snapshot.orders,
          averageOrderValue: snapshot.averageOrderValue,
          visitors: snapshot.visitors,
          pageViews: snapshot.pageViews,
          bounceRate: snapshot.bounceRate,
          conversionRate: snapshot.conversionRate,
          cartAbandonment: snapshot.cartAbandonment,
          topProducts: snapshot.topProducts as unknown as Prisma.JsonArray,
          topSources: snapshot.topSources as unknown as Prisma.JsonArray,
          topPages: snapshot.topPages as unknown as Prisma.JsonArray,
        },
      });
    }
  }

  console.log("[Seed] Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
