import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Logo = {
  name: string;
  imageUrl?: string;
  icon?: ReactNode;
};

type Logos01Props = {
  title?: string;
  logos: Logo[];
  className?: string;
};

export function Logos01({
  title = 'Trusted by leading companies',
  logos,
  className,
}: Logos01Props) {
  return (
    <section className={cn('w-full px-6 py-16 md:py-24', className)}>
      <div className="mx-auto max-w-6xl">
        {title && (
          <p className="mb-10 text-center text-sm font-medium text-muted-foreground">{title}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="grayscale opacity-60 transition-all hover:opacity-100 hover:grayscale-0"
            >
              {logo.imageUrl ? (
                <img src={logo.imageUrl} alt={logo.name} className="h-8 w-auto object-contain" />
              ) : logo.icon ? (
                <div className="flex h-8 items-center">{logo.icon}</div>
              ) : (
                <span className="text-lg font-semibold text-foreground">{logo.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
