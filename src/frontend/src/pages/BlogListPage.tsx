import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetBlogListing } from '@/hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function BlogListPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: blogData, isLoading } = useGetBlogListing(selectedCategory);

  const posts = blogData?.posts || [];
  const categories = blogData?.categories || [];
  const featured = blogData?.featured;

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-transition">
      <div className="container-luxury section-spacing">
        <div className="text-center mb-16 fade-in">
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-4">Journal</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stories, inspiration, and insights from the world of AMOR
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading articles...</p>
        ) : (
          <>
            {/* Featured Article */}
            {featured && !searchQuery && (
              <Link to="/blog/$postId" params={{ postId: featured.id }} className="block mb-16">
                <Card className="overflow-hidden border-0 shadow-luxury hover:shadow-luxury-lg transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="aspect-video md:aspect-auto">
                      <img
                        src={featured.image.getDirectURL()}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                      <Badge className="w-fit mb-4">Featured</Badge>
                      <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">{featured.title}</h2>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{featured.content}</p>
                      <p className="text-sm text-muted-foreground">By {featured.author}</p>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            )}

            {/* Posts Grid */}
            {filteredPosts.length === 0 ? (
              <p className="text-center text-muted-foreground">No articles found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    to="/blog/$postId"
                    params={{ postId: post.id }}
                    className="fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Card className="overflow-hidden border-0 shadow-luxury hover:shadow-luxury-lg transition-all h-full">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.image.getDirectURL()}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <Badge className="mb-2">{post.category}</Badge>
                        <h3 className="font-serif text-xl mb-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.content}</p>
                        <p className="text-xs text-muted-foreground">By {post.author}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
