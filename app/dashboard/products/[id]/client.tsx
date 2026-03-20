"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProductListing } from "@/lib/mock-data/types";

interface ProductDetailClientProps {
  product: ProductListing;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-muted-foreground">{product.site.name}</p>
        </div>
        <Badge variant="outline">{product.status}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Price</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{formatCurrency(product.price)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Inventory</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{product.inventory}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Optimization score</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{product.optimizationScore}%</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">SKU</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{product.sku || "-"}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{product.description || "No description"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimization suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {product.optimizationSuggestions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No suggestions.</p>
          ) : (
            product.optimizationSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="rounded border border-border p-3">
                <p className="font-medium">{suggestion.suggestion}</p>
                <p className="text-sm text-muted-foreground">Priority: {suggestion.priority}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
