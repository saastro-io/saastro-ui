import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Newsletter01Props = {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => void;
  className?: string;
};

export function Newsletter01({
  title = 'Stay up to date',
  description = 'Subscribe to our newsletter for the latest updates.',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  onSubmit,
  className,
}: Newsletter01Props) {
  return (
    <section className={cn('w-full px-6 py-24 md:py-32', className)}>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-4 text-muted-foreground">{description}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const email = formData.get('email') as string;
            onSubmit?.(email);
          }}
          className="mt-8 flex gap-3"
        >
          <Input type="email" name="email" placeholder={placeholder} required className="flex-1" />
          <Button type="submit">{buttonText}</Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">No spam. Unsubscribe at any time.</p>
      </div>
    </section>
  );
}
