import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });

  return (
    <div className="page-transition">
      <div className="container-luxury section-spacing">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-accent mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">Thank You!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your order has been placed successfully. We'll send you a confirmation email shortly.
          </p>
          <div className="bg-muted/20 p-6 rounded-lg mb-8">
            <p className="text-sm text-muted-foreground mb-2">Order Number</p>
            <p className="font-mono text-lg">{orderId}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/account">
              <Button variant="outline" size="lg">
                View Order History
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
