import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/state/cart';
import { Minus, Plus, X } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();

  const handleCheckout = () => {
    onOpenChange(false);
    navigate({ to: '/checkout' });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl font-light">Shopping Bag</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Your bag is empty</p>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const imageUrl = item.product.images[0]?.getDirectURL() || '/assets/generated/amor-product-placeholder-set.dim_1200x1200.png';
                return (
                  <div key={item.product.id} className="flex space-x-4">
                    <img
                      src={imageUrl}
                      alt={item.product.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-serif text-lg mb-1">{item.product.title}</h4>
                      <p className="text-sm text-accent mb-2">${item.product.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator />
            <SheetFooter className="flex-col space-y-4">
              <div className="flex justify-between text-lg">
                <span className="font-serif">Subtotal</span>
                <span className="font-light">${getSubtotal().toFixed(2)}</span>
              </div>
              <Button
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
