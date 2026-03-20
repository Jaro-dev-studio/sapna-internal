import { getProductListing } from "@/lib/fetchers";
import { ProductDetailClient } from "./client";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const { data, error } = await getProductListing(id);

  if (!data || error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{error || "Product not found"}</p>
      </div>
    );
  }

  return <ProductDetailClient product={data} />;
}
