import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useGetProducts, useGetNewestProducts } from '@/hooks/useQueries';
import ProductCard from '@/components/catalog/ProductCard';
import { ArrowRight } from 'lucide-react';
import { SiInstagram } from 'react-icons/si';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: allProducts = [] } = useGetProducts();
  const { data: newestProducts = [] } = useGetNewestProducts();

  const featuredProducts = allProducts.slice(0, 6);
  const latestDesigns = newestProducts.slice(0, 3);

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/80 z-10" />
        <img
          src="/assets/generated/amor-hero.dim_2400x1200.png"
          alt="AMOR Luxury Jewelry"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-6 fade-in-up">
          <h1 className="editorial-heading font-serif mb-6">AMOR</h1>
          <p className="text-xl md:text-2xl font-light tracking-wide mb-8 max-w-2xl mx-auto">
            Crafted Emotion. Eternal Gold.
          </p>
          <Button
            size="lg"
            onClick={() => navigate({ to: '/shop' })}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-light tracking-wide px-8"
          >
            Explore Collection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="section-spacing bg-muted/20">
        <div className="container-luxury">
          <div className="text-center mb-16 fade-in">
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">Featured Collection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our curated selection of timeless pieces
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          {featuredProducts.length === 0 && (
            <p className="text-center text-muted-foreground">No products available yet.</p>
          )}
        </div>
      </section>

      {/* About the Brand */}
      <section className="section-spacing">
        <div className="container-luxury max-w-4xl text-center">
          <div className="fade-in-up">
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-8">About AMOR</h2>
            <p className="text-lg md:text-xl font-light leading-relaxed mb-8 text-muted-foreground">
              AMOR is where emotion meets craftsmanship. Each piece is designed to express timeless love through gold and light.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate({ to: '/blog' })}
              className="font-light tracking-wide"
            >
              Discover More
            </Button>
          </div>
        </div>
      </section>

      {/* New Designs Preview */}
      {latestDesigns.length > 0 && (
        <section className="section-spacing bg-muted/20">
          <div className="container-luxury">
            <div className="text-center mb-16 fade-in">
              <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">New Designs</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our latest creations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {latestDesigns.map((product, index) => (
                <div key={product.id} className="fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <ProductCard product={product} showNewBadge />
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate({ to: '/new-designs' })}
                className="font-light tracking-wide"
              >
                View All Designs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Instagram Section */}
      <section className="section-spacing">
        <div className="container-luxury text-center">
          <div className="fade-in-up">
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-8">Follow Our Journey</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join us on Instagram for behind-the-scenes moments and inspiration
            </p>
            <a
              href="https://instagram.com/_amor.gold"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors"
            >
              <SiInstagram className="h-6 w-6" />
              <span className="text-lg font-light">@_amor.gold</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
