// Demo props de steps-01 — objeto plano: el bloque es .astro (las Props viven
// en su frontmatter). Tres pasos porque es lo que llena la rejilla de
// escritorio; el bloque acepta los que le den.
export const props = {
  eyebrow: "How it works",
  title: "Three steps and you are live",
  description:
    "No setup call, no migration project. Connect, configure, publish.",
  steps: [
    {
      title: "Connect your repo",
      description:
        "Point us at a GitHub repository. We read what is there — no rewrite, no lock-in.",
    },
    {
      title: "Configure the content",
      description:
        "Collections, locales and forms are declared once. The editor picks them up on the next load.",
    },
    {
      title: "Publish",
      description:
        "Every push builds and deploys. Rollback is a redeploy of the previous version.",
    },
  ],
};
