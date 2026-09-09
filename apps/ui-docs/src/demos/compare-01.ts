// Demo props de compare-01 — objeto plano: el bloque es .astro (las Props viven
// en su frontmatter).
export const props = {
  eyebrow: "Why not a marketplace",
  title: "You are not renting an audience. You are running a business.",
  description: "The same five decisions, made the other way around.",
  labels: { left: "Marketplace", right: "Your own site" },
  rows: [
    {
      left: "They take a cut of every lesson.",
      right: "You charge in full, straight to your bank.",
    },
    {
      left: "Your students belong to the platform.",
      right: "Your students are yours, exportable.",
    },
    {
      left: "You compete on price with everyone.",
      right: "You set your own prices.",
    },
    {
      left: "The brand on the invoice is theirs.",
      right: "The brand on the invoice is yours.",
    },
    {
      left: "Rules change without notice.",
      right: "You decide when something changes.",
    },
  ],
};
