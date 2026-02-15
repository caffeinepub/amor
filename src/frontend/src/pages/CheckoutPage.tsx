import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCartStore } from '@/state/cart';
import { usePlaceOrder } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { items, getSubtotal, clearCart } = useCartStore();
  const placeOrder = usePlaceOrder();

  const [shippingName, setShippingName] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingPostal, setShippingPostal] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container-luxury section-spacing text-center">
        <h1 className="font-serif text-4xl mb-4">Your cart is empty</h1>
        <Button onClick={() => navigate({ to: '/shop' })}>Continue Shopping</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Please sign in to place an order');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await placeOrder.mutateAsync({
        id: orderId,
        customer: identity.getPrincipal(),
        products: items.map((item) => item.product.id),
        status: { pending: null } as any,
        timestamp: BigInt(Date.now() * 1000000),
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate({ to: '/order-confirmation/$orderId', params: { orderId } });
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-transition">
      <div className="container-luxury section-spacing">
        <h1 className="font-serif text-4xl md:text-5xl font-light mb-12 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingEmail}
                      onChange={(e) => setShippingEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal">Postal Code *</Label>
                      <Input
                        id="postal"
                        value={shippingPostal}
                        onChange={(e) => setShippingPostal(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={shippingCountry}
                      onChange={(e) => setShippingCountry(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl mb-4">Payment</h2>
                <div className="bg-muted/20 p-6 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Payment processing will be integrated with Stripe. For now, orders will be marked as pending.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-muted/20 p-8 rounded-lg sticky top-24">
              <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const imageUrl = item.product.images[0]?.getDirectURL() || '/assets/generated/amor-product-placeholder-set.dim_1200x1200.png';
                  return (
                    <div key={item.product.id} className="flex space-x-4">
                      <img src={imageUrl} alt={item.product.title} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-serif text-sm">{item.product.title}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
              <Separator className="my-6" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-serif">
                  <span>Total</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
