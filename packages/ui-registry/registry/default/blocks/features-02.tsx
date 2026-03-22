import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Feature = {
  badge?: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
};

type Features02Props = {
  title?: string;
  description?: string;
  features: Feature[];
  className?: string;
};

export function Features02({ title, description, features, className }: Features02Props) {
  return (
    <section className={cn('w-full px-6 py-24 md:py-32', className)}>
      <div className="mx-auto max-w-6xl">
        {(title || description) && (
          <div className="mx-auto mb-20 max-w-2xl text-center">
            {title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>}
            {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
          </div>
        )}
        <div className="flex flex-col gap-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'grid items-center gap-12 lg:grid-cols-2',
                index % 2 === 1 && 'lg:direction-rtl',
              )}
            >
              <div className={cn(index % 2 === 1 && 'lg:order-2')}>
                {feature.badge && (
                  <Badge variant="secondary" className="mb-4">
                    {feature.badge}
                  </Badge>
                )}
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{feature.title}</h3>
                <p className="mt-4 text-muted-foreground">{feature.description}</p>
              </div>
              <div
                className={cn(
                  'aspect-video overflow-hidden rounded-xl border bg-muted',
                  index % 2 === 1 && 'lg:order-1',
                )}
              >
                {feature.imageSrc ? (
                  <img
                    src={feature.imageSrc}
                    alt={feature.imageAlt ?? ''}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/5">
                    <span className="text-2xl text-muted-foreground/30">Image</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
