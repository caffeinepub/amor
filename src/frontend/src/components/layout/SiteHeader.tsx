import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingBag, Heart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/state/cart';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '@/hooks/useQueries';
import { useState } from 'react';
import LoginButton from '../auth/LoginButton';
import CartSheet from '../cart/CartSheet';

export default function SiteHeader() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const { items } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const isAuthenticated = !!identity;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/new-designs', label: 'New Designs' },
    { to: '/blog', label: 'Journal' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-luxury flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="font-serif text-3xl font-light tracking-wide">AMOR</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-light tracking-wide transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate({ to: '/wishlist' })}
                  className="hidden sm:inline-flex"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate({ to: '/account' })}
                  className="hidden sm:inline-flex"
                >
                  <User className="h-5 w-5" />
                </Button>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="hidden sm:block">
                <LoginButton />
              </div>
            )}

            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: '/admin' })}
                className="hidden lg:inline-flex"
              >
                Admin
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col space-y-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-light tracking-wide transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <>
                      <Link
                        to="/wishlist"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-light tracking-wide transition-colors hover:text-accent"
                      >
                        Wishlist
                      </Link>
                      <Link
                        to="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-light tracking-wide transition-colors hover:text-accent"
                      >
                        Account
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-light tracking-wide transition-colors hover:text-accent"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="pt-4 border-t">
                    <LoginButton />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
