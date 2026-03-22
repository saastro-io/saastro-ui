import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Cta01Props = {
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
};

export function Cta01({ title, description, primaryCta, secondaryCta, className }: Cta01Props) {
  return (
    <section className={cn('relative w-full overflow-hidden px-6 py-24 md:py-32', className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-violet-600" />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        <p className="mt-4 text-lg text-white/80">{description}</p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" variant="secondary" className="text-base" asChild>
            <a href={primaryCta.href}>{primaryCta.label}</a>
          </Button>
          {secondaryCta && (
            <Button
              size="lg"
              variant="ghost"
              className="border border-white/30 text-base text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <a href={secondaryCta.href}>{secondaryCta.label}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
