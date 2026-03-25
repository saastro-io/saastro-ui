'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonProVariants = cva(
  `
      inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0

      font-medium text-base

      transition-all

      disabled:pointer-events-none
      disabled:opacity-50

      [&_svg]:pointer-events-none
      [&_svg:not([class*='size-'])]:size-6
      [&_svg]:shrink-0

      outline-none
      focus-visible:border-ring
      focus-visible:ring-ring/50
      focus-visible:ring-[3px]
      aria-invalid:ring-destructive/20
      dark:aria-invalid:ring-destructive/40
      aria-invalid:border-destructive
    `,
  {
    variants: {
      variant: {
        default: `
            bg-primary
            text-primary-foreground
            hover:bg-yellow-500
          `,
        destructive: `
            bg-destructive
            text-destructive-foreground
            hover:bg-destructive/90
          `,
        outline: `
            border
            border-input
            bg-background
            hover:bg-accent
            hover:text-accent-foreground
          `,
        secondary: `
            bg-secondary
            text-secondary-foreground
            hover:bg-secondary/80
          `,
        ghost: `
            hover:bg-accent
            hover:text-accent-foreground
          `,
        link: `
            text-primary
            underline-offset-4
            hover:underline
          `,
        accent: `
            bg-accent
            text-accent-foreground
            hover:bg-accent/90
          `,
        foreground: `
            bg-foreground
            text-muted
          `,
      },
      iconfx: {
        none: '',
        left: `
          [&>svg]:w-0
          [&>svg]:translate-x-[0%]
          [&>svg]:pr-0
          [&>svg]:opacity-0
          [&>svg]:transition-all
          [&>svg]:duration-200
          group-hover:[&>svg]:w-5
          group-hover:[&>svg]:translate-x-100
          group-hover:[&>svg]:pr-2
          group-hover:[&>svg]:opacity-100
        `,
        right: `
          [&>svg]:w-0
          [&>svg]:translate-x-[100%]
          [&>svg]:pl-0
          [&>svg]:opacity-0
          [&>svg]:transition-all
          [&>svg]:duration-200
          group-hover:[&>svg]:w-5
          group-hover:[&>svg]:translate-x-0
          group-hover:[&>svg]:pl-2
          group-hover:[&>svg]:opacity-100
        `,
      },
      effect: {
        default: '',
        expandIcon: `
            group
            gap-0
            relative
          `,
        ringHover: `
            transition-all
            duration-300
            hover:ring-2
            hover:ring-primary/90
            hover:ring-offset-2
          `,
        shine: `
          relative
          overflow-hidden
          before:absolute
          before:inset-0
          before:rounded-[inherit]
          before:content-['']
          before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)]
          before:bg-[length:250%_250%]
          before:bg-no-repeat
          before:bg-[position:200%_0]
          before:animate-[shine_3s_ease-out_infinite]
        `,

        shineHover: `
          relative
          overflow-hidden
          before:absolute
          before:inset-0
          before:rounded-[inherit]
          before:content-['']
          before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)]
          before:bg-[length:250%_250%]
          before:bg-no-repeat
          before:bg-[position:200%_0]
          before:transition-[background-position]
          hover:before:bg-[position:-100%_0]
          before:duration-1000
        `,
        gooeyRight: `
            relative
            z-0
            overflow-hidden
            transition-all
            duration-500
            before:absolute
            before:inset-0
            before:-z-10
            before:translate-x-[150%]
            before:translate-y-[150%]
            before:scale-[2.5]
            before:rounded-[100%]
            before:bg-gradient-to-r
            before:from-white/40
            before:transition-transform
            before:duration-1000
            hover:before:translate-x-[0%]
            hover:before:translate-y-[0%]
          `,
        gooeyLeft: `
            relative z-0 overflow-hidden transition-all duration-500
            after:absolute after:inset-0 after:-z-10
            after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5]
            after:rounded-[100%] after:bg-gradient-to-l after:from-white/40
            after:transition-transform after:duration-1000
            hover:after:translate-x-[0%] hover:after:translate-y-[0%]
        `,
        underline: `
            relative
            !no-underline
            after:absolute
            after:bg-[currentColor]
            after:bottom-2
            after:h-[1px]
            after:w-2/3
            after:origin-bottom-left
            after:scale-x-100
            hover:after:origin-bottom-right
            hover:after:scale-x-0
            after:transition-transform
            after:ease-in-out
            after:duration-300
          `,
        hoverUnderline: `
            relative
            !no-underline
            after:absolute
            after:bg-[currentColor]
            after:bottom-2
            after:h-[1px]
            after:w-2/3
            after:origin-bottom-right
            after:scale-x-0
            hover:after:origin-bottom-left
            hover:after:scale-x-100
            after:transition-transform
            after:ease-in-out
            after:duration-300
          `,
        gradientSlideShow: `
            bg-[size:400%]
            bg-linear-to-r/longer from-indigo-500 to-teal-400
            animate-gradient-flow
          `,
      },
      rounded: {
        xs: 'rounded-xs',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        '4xl': 'rounded-4xl',
      },
      size: {
        xxs: 'h-6 px-2 text-xs font-semibold',
        xs: 'h-8 px-4 text-sm font-semibold',
        sm: 'h-9 px-4 text-sm font-semibold',
        md: 'h-10 px-4 text-base font-semibold',
        lg: 'h-12 px-6 text-lg font-semibold',
        xl: 'h-12 px-8 text-xl font-semibold',
        '2xl': 'h-14 px-8 text-2xl font-semibold',
        '3xl': 'h-16 px-8 text-3xl font-semibold',
        '4xl': 'h-20 px-10 text-4xl font-semibold',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'md',
      effect: 'default',
      iconfx: 'none',
    },
  },
);

function ButtonPro<T extends React.ElementType = 'button'>({
  className,
  variant,
  size,
  effect,
  rounded,
  iconfx,
  asChild = false,
  href,
  ...props
}: React.ComponentProps<T> &
  VariantProps<typeof buttonProVariants> & {
    asChild?: boolean;
    href?: string;
  }) {
  const Comp = asChild ? Slot : href ? 'a' : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonProVariants({ variant, size, effect, rounded, iconfx }), className)}
      {...(href && { href })}
      {...props}
    />
  );
}

export { ButtonPro, buttonProVariants };

export type ButtonProVariantProps = VariantProps<typeof buttonProVariants>;
export type ButtonProBaseProps = React.ComponentProps<'button'> & {
  href?: string;
};
export type ButtonProProps = ButtonProBaseProps & ButtonProVariantProps & { asChild?: boolean };
