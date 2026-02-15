import { Link } from '@tanstack/react-router';
import { SiInstagram } from 'react-icons/si';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container-luxury section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-light">AMOR</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crafted Emotion. Eternal Gold.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-light">Shop</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                All Jewelry
              </Link>
              <Link to="/new-designs" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                New Designs
              </Link>
              <Link to="/wishlist" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Wishlist
              </Link>
            </nav>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-light">About</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Journal
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                Contact
              </Link>
              <Link to="/account" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                My Account
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-light">Contact</h4>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <p>Antalya, Turkey</p>
              <a href="tel:+905384395356" className="hover:text-accent transition-colors">
                +90 538 439 5356
              </a>
              <a href="mailto:info@amor.gold" className="hover:text-accent transition-colors">
                info@amor.gold
              </a>
              <a
                href="https://instagram.com/_amor.gold"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-accent transition-colors"
              >
                <SiInstagram className="h-4 w-4" />
                <span>@_amor.gold</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} AMOR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
