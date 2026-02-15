import { useParams, Link } from '@tanstack/react-router';
import { useGetBlogPost, useGetBlogListing } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogPostPage() {
  const { postId } = useParams({ from: '/blog/$postId' });
  const { data: post, isLoading } = useGetBlogPost(postId);
  const { data: blogData } = useGetBlogListing(null);

  const relatedPosts = blogData?.posts.filter((p) => p.id !== postId).slice(0, 3) || [];

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (isLoading) {
    return (
      <div className="container-luxury section-spacing">
        <p className="text-center text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-luxury section-spacing text-center">
        <h1 className="font-serif text-4xl mb-4">Article Not Found</h1>
        <Link to="/blog">
          <Button>Back to Journal</Button>
        </Link>
      </div>
    );
  }

  const date = new Date(Number(post.date) / 1000000);

  return (
    <div className="page-transition">
      <article className="container-luxury section-spacing max-w-4xl">
        <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-accent mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Journal
        </Link>

        <div className="aspect-video overflow-hidden rounded-lg mb-8">
          <img src={post.image.getDirectURL()} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <span>By {post.author}</span>
              <span className="mx-2">•</span>
              <span>{date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-16">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="border-t pt-16">
            <h2 className="font-serif text-3xl font-light mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to="/blog/$postId" params={{ postId: relatedPost.id }}>
                  <Card className="overflow-hidden border-0 shadow-luxury hover:shadow-luxury-lg transition-all h-full">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.image.getDirectURL()}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-serif text-lg mb-2">{relatedPost.title}</h3>
                      <p className="text-xs text-muted-foreground">By {relatedPost.author}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
