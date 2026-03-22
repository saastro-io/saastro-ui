import * as React from 'react';

import { cn } from '@/lib/utils';

const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="input-group"
      className={cn(
        'flex w-full [&>:first-child]:rounded-r-none [&>:last-child]:rounded-l-none [&>:not(:first-child):not(:last-child)]:rounded-none [&>:not(:first-child)]:-ml-px [&>*:focus-within]:z-10',
        className,
      )}
      {...props}
    />
  ),
);
InputGroup.displayName = 'InputGroup';

interface InputGroupAddonProps extends React.HTMLAttributes<HTMLSpanElement> {
  position?: 'start' | 'end';
}

const InputGroupAddon = React.forwardRef<HTMLSpanElement, InputGroupAddonProps>(
  ({ className, position = 'start', ...props }, ref) => (
    <span
      ref={ref}
      data-slot="input-group-addon"
      data-position={position}
      className={cn(
        'inline-flex h-9 items-center justify-center border border-input bg-muted px-3 text-sm text-muted-foreground',
        position === 'start' && 'rounded-l-md border-r-0',
        position === 'end' && 'rounded-r-md border-l-0',
        className,
      )}
      {...props}
    />
  ),
);
InputGroupAddon.displayName = 'InputGroupAddon';

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    data-slot="input-group-input"
    className={cn(
      'flex h-9 w-full border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
));
InputGroupInput.displayName = 'InputGroupInput';

export { InputGroup, InputGroupAddon, InputGroupInput };
