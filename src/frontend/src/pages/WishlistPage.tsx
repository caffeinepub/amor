import { useGetWishlist, useGetProducts } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import ProductCard from '@/components/catalog/ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export default function WishlistPage() {
  const { identity } = useInternetIdentity();
  const { data: wishlistIds = [], isLoading: loadingWishlist } = useGetWishlist();
  const { data: allProducts = [], isLoading: loadingProducts } = useGetProducts();

  const wishlistProducts = allProducts.filter((product) => wishlistIds.includes(product.id));

  if (!identity) {
    return (
      <div className="container-luxury section-spacing text-center">
        <h1 className="font-serif text-4xl mb-4">Sign in to view your wishlist</h1>
        <p className="text-muted-foreground mb-8">Save your favorite pieces for later</p>
      </div>
    );
  }

  const isLoading = loadingWishlist || loadingProducts;

  return (
    <div className="page-transition">
      <div className="container-luxury section-spacing">
        <div className="text-center mb-16 fade-in">
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-4">Wishlist</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your saved pieces
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading wishlist...</p>
        ) : wishlistProducts.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-8">Your wishlist is empty</p>
            <Link to="/shop">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Discover Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistProducts.map((product, index) => (
              <div key={product.id} className="fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
