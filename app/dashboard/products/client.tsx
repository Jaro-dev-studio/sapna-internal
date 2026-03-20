"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Search,
  Filter,
  Lightbulb,
  TrendingUp,
  LayoutGrid,
  List,
} from "lucide-react";
import Link from "next/link";
import type { ProductListing } from "@/lib/mock-data/types";

interface ProductsClientProps {
  products: ProductListing[];
  summary: {
    totalProducts: number;
    activeProducts: number;
    outOfStock: number;
    avgOptimizationScore: number;
    productsNeedingOptimization: number;
    totalInventory: number;
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function getStatusColor(status: ProductListing["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "DRAFT":
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    case "OUT_OF_STOCK":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    case "ARCHIVED":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

function getScoreProgressColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

export function ProductsClient({ products, summary }: ProductsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [siteFilter, setSiteFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const uniqueSites = [...new Set(products.map(p => p.site.name))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSite = siteFilter === "all" || product.site.name === siteFilter;
    return matchesSearch && matchesSite;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Optimize product listings across all your sites
          </p>
        </div>
        <Button disabled>
          <Package className="mr-2 size-4" />
          Sync Products
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {summary.activeProducts} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Optimization</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(summary.avgOptimizationScore)}`}>
              {summary.avgOptimizationScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              Score across all products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Optimization</CardTitle>
            <Lightbulb className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-yellow-600 text-2xl font-bold">
              {summary.productsNeedingOptimization}
            </div>
            <p className="text-xs text-muted-foreground">
              Products scoring below 70%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.outOfStock > 0 ? "text-red-600" : "text-green-600"}`}>
              {summary.outOfStock}
            </div>
            <p className="text-xs text-muted-foreground">
              Products unavailable
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={siteFilter} onValueChange={setSiteFilter}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 size-4" />
              <SelectValue placeholder="All Sites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              {uniqueSites.map(site => (
                <SelectItem key={site} value={site}>{site}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="line-clamp-1 text-sm">{product.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {product.site.name} - {product.category || "Uncategorized"}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={getStatusColor(product.status)}>
                    {product.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
                    {product.compareAtPrice && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        {formatCurrency(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Stock: {product.inventory}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Optimization Score</span>
                    <span className={`font-medium ${getScoreColor(product.optimizationScore)}`}>
                      {product.optimizationScore}%
                    </span>
                  </div>
                  <Progress value={product.optimizationScore} className="h-2" />
                </div>

                {product.optimizationSuggestions.length > 0 && (
                  <div className="bg-yellow-500/10 text-yellow-700 flex items-center gap-2 rounded-lg p-2 text-sm">
                    <Lightbulb className="size-4 shrink-0" />
                    <span className="line-clamp-1">
                      {product.optimizationSuggestions.length} suggestion(s)
                    </span>
                  </div>
                )}

                <div className="flex justify-end border-t pt-3">
                  <Link href={`/dashboard/products/${product.id}`}>
                    <Button variant="ghost" size="sm" className="h-8">
                      Optimize
                      <ArrowRight className="ml-1 size-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Package className="size-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium">{product.title}</h3>
                    <Badge variant="outline" className={getStatusColor(product.status)}>
                      {product.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.site.name} - {product.category || "Uncategorized"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(product.price)}</div>
                  <div className="text-sm text-muted-foreground">Stock: {product.inventory}</div>
                </div>
                <div className="w-24 text-center">
                  <div className={`text-lg font-semibold ${getScoreColor(product.optimizationScore)}`}>
                    {product.optimizationScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">Optimized</div>
                </div>
                <Link href={`/dashboard/products/${product.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                    <ArrowRight className="ml-1 size-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="mb-4 size-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
