'use client';

import { useState } from 'react';

export function CodeViewer({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={copy}
        className="absolute right-3 top-3 rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function InstallCommand({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);
  const command = `npx shadcn@latest add @saastro/${name}`;

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-3">
      <code className="flex-1 text-sm font-mono">{command}</code>
      <button
        onClick={copy}
        className="shrink-0 rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
