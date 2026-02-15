import { useState } from 'react';
import { useFilterProducts } from '@/hooks/useQueries';
import ProductCard from '@/components/catalog/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Category, GoldType, StoneType, SortOption } from '@/backend';

export default function ShopPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [goldType, setGoldType] = useState<GoldType | null>(null);
  const [stoneType, setStoneType] = useState<StoneType | null>(null);
  const [sortBy, setSortBy] = useState<SortOption | null>(null);

  const { data: filteredData, isLoading } = useFilterProducts(category, priceRange, goldType, stoneType, sortBy);

  const products = filteredData?.products || [];

  const handleReset = () => {
    setCategory(null);
    setPriceRange([0, 10000]);
    setGoldType(null);
    setStoneType(null);
    setSortBy(null);
  };

  return (
    <div className="page-transition">
      <div className="container-luxury section-spacing">
        <div className="text-center mb-16 fade-in">
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-4">Shop</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our complete collection of fine jewelry
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl">Filters</h3>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Reset
                </Button>
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category || ''} onValueChange={(val) => setCategory(val === 'all' ? null : val as Category)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="rings">Rings</SelectItem>
                      <SelectItem value="necklaces">Necklaces</SelectItem>
                      <SelectItem value="bracelets">Bracelets</SelectItem>
                      <SelectItem value="earrings">Earrings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={(val) => setPriceRange(val as [number, number])}
                  />
                </div>

                {/* Gold Type */}
                <div className="space-y-2">
                  <Label>Gold Type</Label>
                  <Select value={goldType || ''} onValueChange={(val) => setGoldType(val === 'all' ? null : val as GoldType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="eighteenK">18K Gold</SelectItem>
                      <SelectItem value="fourteenK">14K Gold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Stone Type */}
                <div className="space-y-2">
                  <Label>Stone Type</Label>
                  <Select value={stoneType || ''} onValueChange={(val) => setStoneType(val === 'all' ? null : val as StoneType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Stones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stones</SelectItem>
                      <SelectItem value="diamond">Diamond</SelectItem>
                      <SelectItem value="ruby">Ruby</SelectItem>
                      <SelectItem value="sapphire">Sapphire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy || ''} onValueChange={(val) => setSortBy(val === 'default' ? null : val as SortOption)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="priceLowToHigh">Price: Low to High</SelectItem>
                      <SelectItem value="priceHighToLow">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-center text-muted-foreground">No products found matching your filters.</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <div key={product.id} className="fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
