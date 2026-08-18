// Demo de features-01 — INTERINO hasta la F5: `icon` es ReactNode, así que la
// demo no puede ser datos planos. En la F5 la API pasa a icon: 'zap'|'shield'|
// 'code' con mapa interno de SVGs y este fichero muere junto a su wrapper.
import { Features01 } from '@blocks/features-01';

function ZapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function Features01Demo() {
  return (
    <Features01
      title="Everything you need"
      description="All the tools to build great landing pages, out of the box."
      features={[
        {
          icon: <ZapIcon />,
          title: 'Lightning Fast',
          description:
            'Built for performance. Server-rendered by default with zero JavaScript shipped.',
        },
        {
          icon: <ShieldIcon />,
          title: 'Type-Safe',
          description: 'Full TypeScript support with proper prop types for every block component.',
        },
        {
          icon: <CodeIcon />,
          title: 'Copy & Paste',
          description:
            'Install with the shadcn CLI or copy the source code directly into your project.',
        },
      ]}
    />
  );
}
