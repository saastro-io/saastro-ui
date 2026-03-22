import { cn } from '@/lib/utils';

type Stat = {
  value: string | number;
  label: string;
  prefix?: string;
  suffix?: string;
};

type Stats01Props = {
  title?: string;
  stats: Stat[];
  className?: string;
};

export function Stats01({ title, stats, className }: Stats01Props) {
  return (
    <section className={cn('w-full px-6 py-24 md:py-32', className)}>
      <div className="mx-auto max-w-6xl">
        {title && (
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={cn('text-center', index > 0 && 'lg:border-l lg:border-border')}
            >
              <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                {stat.prefix}
                {stat.value}
                {stat.suffix}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
