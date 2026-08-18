import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Hero03Props = {
  badge?: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  className?: string;
};

export function Hero03({ badge, title, description, cta, className }: Hero03Props) {
  return (
    <section
      className={cn('relative w-full overflow-hidden px-6 py-24 md:py-32 lg:py-40', className)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-violet-600" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.3))]" />
      <div className="relative mx-auto max-w-3xl text-center">
        {badge && (
          <Badge variant="outline" className="mb-4 border-white/30 bg-white/10 text-white">
            {badge}
          </Badge>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 text-lg text-white/80 sm:text-xl">{description}</p>
        <div className="mt-10">
          <a
            href={cta.href}
            className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'text-base')}
          >
            {cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
