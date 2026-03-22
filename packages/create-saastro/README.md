# create-saastro

Scaffold a new SaastroCMS project with Astro in seconds.

## Usage

```bash
# With npm
npx create-saastro

# With pnpm
pnpm create saastrocms

# With yarn
yarn create saastrocms

# With bun
bun create saastrocms
```

## Options

```bash
create-saastro [project-name] [options]

Options:
  -t, --template <template>  Template to use (blog, portfolio, docs, minimal)
  --npm                      Use npm as package manager
  --pnpm                     Use pnpm as package manager
  --yarn                     Use yarn as package manager
  --bun                      Use bun as package manager
  --no-git                   Skip git initialization
  --no-install               Skip dependency installation
  -y, --yes                  Accept all defaults
```

## Templates

### Blog

A blog with posts, categories, and authors. Perfect for personal blogs or news sites.

### Portfolio

A portfolio site with projects and about page. Great for showcasing your work.

### Docs

A documentation site with sidebar navigation. Ideal for product documentation.

### Minimal

A minimal setup with just the CMS integration. Start from scratch with full control.

## What's Included

Each template includes:

- Astro 5 with Cloudflare Workers adapter
- SaastroCMS integration with visual editing
- Content collections with Zod validation
- Admin panel at `/admin`
- API routes for content and media
- TypeScript configuration
- Cloudflare wrangler configuration

## Getting Started

After creating your project:

1. Navigate to the project directory:

   ```bash
   cd my-project
   ```

2. Copy the environment file and add your credentials:

   ```bash
   cp .env.example .env
   ```

3. Create a GitHub OAuth App at https://github.com/settings/developers

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Visit `/admin` to access the content management panel

## Environment Variables

Required variables in `.env`:

```env
GITHUB_CLIENT_ID=       # GitHub OAuth App Client ID
GITHUB_CLIENT_SECRET=   # GitHub OAuth App Client Secret
GITHUB_OWNER=           # Your GitHub username
GITHUB_REPO=            # Repository name for content
GITHUB_BRANCH=          # Branch to use (default: main)
SESSION_SECRET=         # Random 32+ character string
ENCRYPTION_KEY=         # 32 bytes hex for encryption
```

## Learn More

- [SaastroCMS Documentation](https://saastrocms.com/docs)
- [Astro Documentation](https://docs.astro.build)
- [Cloudflare Workers](https://developers.cloudflare.com/workers)

## License

MIT
