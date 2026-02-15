import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Home, Package, ShoppingCart, FileText, Sparkles, Mail, Settings } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="container-luxury section-spacing">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-luxury section-spacing text-center">
        <h1 className="font-serif text-4xl mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8">You don't have permission to access the admin panel</p>
        <Button onClick={() => navigate({ to: '/' })}>Return Home</Button>
      </div>
    );
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: Home },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/blog', label: 'Blog', icon: FileText },
    { to: '/admin/designs', label: 'Designs', icon: Sparkles },
    { to: '/admin/messages', label: 'Messages', icon: Mail },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="page-transition">
      <div className="container-luxury section-spacing">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl font-light">Admin Panel</h1>
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            Back to Site
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                  activeProps={{ className: 'bg-muted' }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
