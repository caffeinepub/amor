import { useGetLimitedEditionProducts, useGetNewestProducts } from '@/hooks/useQueries';
import ProductCard from '@/components/catalog/ProductCard';

export default function NewDesignsPage() {
  const { data: newestProducts = [], isLoading: loadingNew } = useGetNewestProducts();
  const { data: limitedProducts = [], isLoading: loadingLimited } = useGetLimitedEditionProducts();

  const isLoading = loadingNew || loadingLimited;

  return (
    <div className="page-transition">
      <div className="container-luxury section-spacing">
        <div className="text-center mb-16 fade-in">
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-4">New Designs</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our latest creations, each piece telling its own story of craftsmanship and emotion
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading designs...</p>
        ) : (
          <>
            {/* New Arrivals */}
            {newestProducts.length > 0 && (
              <section className="mb-20">
                <h2 className="font-serif text-3xl font-light mb-8">New Arrivals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {newestProducts.map((product, index) => (
                    <div key={product.id} className="fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <ProductCard product={product} showNewBadge />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Limited Edition */}
            {limitedProducts.length > 0 && (
              <section className="border-t pt-20">
                <h2 className="font-serif text-3xl font-light mb-8">Limited Edition</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {limitedProducts.map((product, index) => (
                    <div key={product.id} className="fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {newestProducts.length === 0 && limitedProducts.length === 0 && (
              <p className="text-center text-muted-foreground">No new designs available yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
