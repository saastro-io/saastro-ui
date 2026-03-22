import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Feature = {
  icon: ReactNode;
  title: string;
  description: string;
};

type Features01Props = {
  title?: string;
  description?: string;
  features: Feature[];
  className?: string;
};

export function Features01({ title, description, features, className }: Features01Props) {
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
          {features.map((feature, index) => (
            <Card key={index} className="border bg-card">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
