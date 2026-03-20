import { getProductsDashboardData } from "@/lib/fetchers";
import { ProductsClient } from "./client";

export default async function ProductsPage() {
  const { data, error } = await getProductsDashboardData();

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{error || "Failed to load products"}</p>
      </div>
    );
  }

  return <ProductsClient products={data.products} summary={data.summary} />;
}
