import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetOrders, useGetCallerUserProfile } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderStatus } from '@/backend';

export default function AccountPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: orders = [], isLoading } = useGetOrders(identity?.getPrincipal().toString() || '');

  if (!identity) {
    return (
      <div className="container-luxury section-spacing text-center">
        <h1 className="font-serif text-4xl mb-4">Sign in to view your account</h1>
      </div>
    );
  }

  const getOrderStatusDisplay = (status: OrderStatus): { text: string; variant: 'default' | 'secondary' | 'outline' } => {
    if (status === OrderStatus.shipped) {
      return { text: 'Shipped', variant: 'secondary' };
    } else if (status === OrderStatus.delivered) {
      return { text: 'Delivered', variant: 'outline' };
    } else {
      return { text: 'Pending', variant: 'default' };
    }
  };

  return (
    <div className="page-transition">
      <div className="container-luxury section-spacing">
        <div className="text-center mb-16 fade-in">
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-4">My Account</h1>
          {userProfile && (
            <p className="text-muted-foreground">Welcome back, {userProfile.name}</p>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-light mb-8">Order History</h2>
          
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-muted-foreground">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const date = new Date(Number(order.timestamp) / 1000000);
                const statusDisplay = getOrderStatusDisplay(order.status);

                return (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="font-serif text-xl font-light">Order #{order.id.slice(-8)}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <Badge variant={statusDisplay.variant}>{statusDisplay.text}</Badge>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">
                        {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
