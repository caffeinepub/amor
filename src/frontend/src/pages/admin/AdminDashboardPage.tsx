import { useGetProducts, useGetBlogListing } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, ShoppingCart, Mail } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: products = [] } = useGetProducts();
  const { data: blogData } = useGetBlogListing(null);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package },
    { label: 'Blog Posts', value: blogData?.posts.length || 0, icon: FileText },
    { label: 'Orders', value: 0, icon: ShoppingCart },
    { label: 'Messages', value: 0, icon: Mail },
  ];

  return (
    <div>
      <h2 className="font-serif text-3xl font-light mb-8">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
