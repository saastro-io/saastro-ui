import type { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type LinkItem = {
  label: string;
  href: string;
};

type Column = {
  title: string;
  links: LinkItem[];
};

type SocialLink = {
  icon: ReactNode;
  href: string;
  label: string;
};

type Footer01Props = {
  logo?: ReactNode;
  columns: Column[];
  copyright?: string;
  socialLinks?: SocialLink[];
  className?: string;
};

export function Footer01({
  logo,
  columns,
  copyright = `© ${new Date().getFullYear()} All rights reserved.`,
  socialLinks,
  className,
}: Footer01Props) {
  return (
    <footer className={cn('w-full px-6 py-16', className)}>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {logo && <div className="sm:col-span-2 lg:col-span-1">{logo}</div>}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-semibold">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">{copyright}</p>
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
