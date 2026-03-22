'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type NavLink = {
  label: string;
  href: string;
};

type Navbar01Props = {
  logo?: ReactNode;
  links: NavLink[];
  cta?: { label: string; href: string };
  className?: string;
};

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

export function Navbar01({ logo, links, cta, className }: Navbar01Props) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 px-6 backdrop-blur',
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
        <div className="flex items-center gap-8">
          {logo && <div className="font-bold">{logo}</div>}
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {cta && (
            <Button className="hidden md:inline-flex" asChild>
              <a href={cta.href}>{cta.label}</a>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 pt-8">
                {links.map((link) => (
                  <a key={link.label} href={link.href} className="text-lg font-medium">
                    {link.label}
                  </a>
                ))}
                {cta && (
                  <Button className="mt-4" asChild>
                    <a href={cta.href}>{cta.label}</a>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
