import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Hero01Props = {
  badge?: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
};

export function Hero01({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
}: Hero01Props) {
  return (
    <section className={cn('w-full px-6 py-24 md:py-32 lg:py-40', className)}>
      <div className="mx-auto max-w-3xl text-center">
        {badge && (
          <Badge variant="secondary" className="mb-4">
            {badge}
          </Badge>
        )}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl">{description}</p>
        <div className="mt-10 flex items-center justify-center gap-4">
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
    </section>
  );
}
