import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Hero02Props = {
  badge?: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export function Hero02({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt = '',
  className,
}: Hero02Props) {
  return (
    <section className={cn('w-full px-6 py-24 md:py-32', className)}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          {badge && (
            <Badge variant="secondary" className="mb-4">
              {badge}
            </Badge>
          )}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-6 text-lg text-muted-foreground">{description}</p>
          <div className="mt-10 flex items-center gap-4">
            <a href={primaryCta.href} className={cn(buttonVariants({ size: 'lg' }))}>
              {primaryCta.label}
            </a>
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
          {imageSrc ? (
            <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-4xl text-muted-foreground/30">Screenshot</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
