import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Los items importan con las rutas del CONSUMIDOR (`@/components/ui/button`,
// `@/lib/utils`), que en este repo viven en registry/default/{ui,lib}. El
// orden importa: el alias más específico va primero.
const reg = (p: string) =>
  fileURLToPath(new URL(`./registry/default/${p}`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\/components\/ui\//, replacement: reg("ui/") },
      { find: /^@\/lib\//, replacement: reg("lib/") },
    ],
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.tsx"],
  },
});
