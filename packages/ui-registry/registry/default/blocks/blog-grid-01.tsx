import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Post = {
  title: string;
  excerpt: string;
  date: string;
  category?: string;
  imageUrl?: string;
  href: string;
};

type BlogGrid01Props = {
  title?: string;
  description?: string;
  posts: Post[];
  className?: string;
};

export function BlogGrid01({ title, description, posts, className }: BlogGrid01Props) {
  return (
    <section className={cn('w-full px-6 py-24 md:py-32', className)}>
      <div className="mx-auto max-w-6xl">
        {(title || description) && (
          <div className="mx-auto mb-16 max-w-2xl text-center">
            {title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>}
            {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <a key={post.href} href={post.href} className="group">
              <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-lg">
                <div className="aspect-video overflow-hidden bg-muted">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/5">
                      <span className="text-xl text-muted-foreground/30">Blog</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  {post.category && (
                    <Badge variant="secondary" className="w-fit">
                      {post.category}
                    </Badge>
                  )}
                  <CardTitle className="line-clamp-2 text-lg group-hover:text-primary">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  <p className="mt-4 text-xs text-muted-foreground">{post.date}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
