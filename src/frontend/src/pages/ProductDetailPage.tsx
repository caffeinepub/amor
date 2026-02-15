import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProductDetails, useGetProducts, useToggleWishlist, useGetWishlist } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/state/cart';
import { toast } from 'sonner';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import ProductCard from '@/components/catalog/ProductCard';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: product, isLoading } = useGetProductDetails(productId);
  const { data: allProducts = [] } = useGetProducts();
  const { data: wishlist = [] } = useGetWishlist();
  const toggleWishlist = useToggleWishlist();
  const { addItem } = useCartStore();

  if (isLoading) {
    return (
      <div className="container-luxury section-spacing">
        <p className="text-center text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-luxury section-spacing text-center">
        <h1 className="font-serif text-4xl mb-4">Product Not Found</h1>
        <Button onClick={() => navigate({ to: '/shop' })}>Back to Shop</Button>
      </div>
    );
  }

  const isInWishlist = wishlist.includes(product.id);
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addItem(product);
    toast.success('Added to cart');
  };

  const handleWishlistToggle = async () => {
    if (!identity) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }
    try {
      await toggleWishlist.mutateAsync(product.id);
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const imageUrl = product.images[0]?.getDirectURL() || '/assets/generated/amor-product-placeholder-set.dim_1200x1200.png';

  return (
    <div className="page-transition">
      <div className="container-luxury section-spacing">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted/20">
              <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.isNew && (
                <Badge className="mb-2 bg-accent text-accent-foreground">New</Badge>
              )}
              {product.isLimitedEdition && (
                <Badge className="mb-2 ml-2 bg-primary text-primary-foreground">Limited Edition</Badge>
              )}
              <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">{product.title}</h1>
              <p className="text-3xl font-light text-accent">${product.price.toFixed(2)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <div>
                <h3 className="font-serif text-lg mb-2">Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="capitalize">{product.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Gold Type</dt>
                    <dd>{product.goldType === 'eighteenK' ? '18K' : '14K'} Gold</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Stone</dt>
                    <dd className="capitalize">{product.stoneType}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <Button
                size="lg"
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={handleWishlistToggle}>
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-accent text-accent' : ''}`} />
              </Button>
              <Button size="lg" variant="outline" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t pt-16">
            <h2 className="font-serif text-3xl font-light mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
