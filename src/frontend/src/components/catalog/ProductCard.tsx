import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/backend';
import { useToggleWishlist, useGetWishlist } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean;
}

export default function ProductCard({ product, showNewBadge = false }: ProductCardProps) {
  const { identity } = useInternetIdentity();
  const { data: wishlist = [] } = useGetWishlist();
  const toggleWishlist = useToggleWishlist();

  const isInWishlist = wishlist.includes(product.id);
  const imageUrl = product.images[0]?.getDirectURL() || '/assets/generated/amor-product-placeholder-set.dim_1200x1200.png';

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
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

  return (
    <Card className="group overflow-hidden border-0 shadow-luxury hover:shadow-luxury-lg transition-all duration-300">
      <Link to="/product/$productId" params={{ productId: product.id }}>
        <div className="image-zoom-container aspect-square relative overflow-hidden bg-muted/20">
          <img
            src={imageUrl}
            alt={product.title}
            className="image-zoom w-full h-full object-cover"
          />
          {showNewBadge && product.isNew && (
            <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
              New
            </Badge>
          )}
          {product.isLimitedEdition && (
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
              Limited Edition
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur"
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-accent text-accent' : ''}`} />
          </Button>
        </div>
      </Link>
      <CardContent className="p-6">
        <Link to="/product/$productId" params={{ productId: product.id }}>
          <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">
            {product.title}
          </h3>
          <p className="text-lg font-light text-accent">${product.price.toFixed(2)}</p>
        </Link>
      </CardContent>
    </Card>
  );
}
