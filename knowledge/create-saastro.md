## Scaffolding Philosophy

`create-saastro` is the onboarding layer for SaastroCMS — the tool that answers "how do I start?" It exists because Astro's own `create astro` gives you a blank canvas, but SaastroCMS has opinions: Cloudflare Workers as the runtime, a specific admin panel structure, visual editing via query param, and content collections wired to the CMS. The scaffolder encodes those opinions so users don't have to discover them.

## The Common/Template Split

The most significant architectural decision is the two-layer file model: a `common/` directory of files shared by all templates, and per-template directories that win on conflict. This matters because admin routing, API routes, and wrangler configuration are identical across every project type — duplicating them across four templates would create a maintenance burden whenever the CMS interface evolves. At the same time, each template needs to override layouts and pages freely. The "template wins" merge strategy is what makes this work without a complex merge algorithm: common files are defaults, templates are overrides.

## Admin Routing as a Single Catch-All

The admin panel at `templates/common/src/pages/admin/[...slug].astro` deserves attention. Rather than generating one Astro route per admin view, it uses a single catch-all that parses URL segments at runtime to select among `CollectionsList`, `EntriesList`, `EntryEditor`, and `MediaLibrary`. This is intentional: the admin interface is a client-side-navigated SPA-like experience embedded in Astro. Having four separate static routes would require duplicating layout context and would make it harder to change the admin URL structure as the CMS evolves. The catch-all centralizes that routing decision in one place.

## Visual Editing via Query Param

The `?__saastrocms_visual=true` activation pattern (surfaced in `BaseLayout.astro` via `isVisualEditorActive`) reflects a constraint: visual editing injects editor tooling into the DOM, which is appropriate for authoring but not for production visitors. A query param is the minimal way to gate this without a separate authenticated route or a build-time flag — any page becomes editable just by appending the param, which keeps the editing experience frictionless for content authors.

## Four Templates, Not One

The template set (blog, portfolio, docs, minimal) was chosen to cover distinct content modeling shapes rather than visual styles. Each template has a different primary collection structure — posts with pubDate and tags, projects with order and featured flags, docs with section and order, or a generic pages collection. This means the scaffolder is seeding a data model, not just a visual theme. The minimal template exists explicitly for users who want the CMS integration without the opinionated structure, acknowledging that not every project fits a predefined shape.

## Deployment Coupling

Every template includes Cloudflare Workers adapter and wrangler configuration. This is an opinionated choice that trades flexibility for a working deployment story out of the box — new projects can `wrangler deploy` without any additional configuration. The tradeoff is that users targeting other platforms must reconfigure.