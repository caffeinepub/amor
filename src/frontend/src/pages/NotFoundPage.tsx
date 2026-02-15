import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="page-transition">
      <div className="container-luxury section-spacing text-center">
        <h1 className="font-serif text-6xl md:text-8xl font-light mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link to="/">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
