/**
 * create-saastro CLI
 * Scaffold a new SaastroCMS project with Astro
 */

import { program } from 'commander';
import enquirer from 'enquirer';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

type Template = 'blog' | 'portfolio' | 'docs' | 'minimal';

type ProjectConfig = {
  name: string;
  template: Template;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  typescript: boolean;
  git: boolean;
  install: boolean;
};

const TEMPLATES: Record<Template, { name: string; description: string }> = {
  blog: {
    name: 'Blog',
    description: 'A blog with posts, categories, and authors',
  },
  portfolio: {
    name: 'Portfolio',
    description: 'A portfolio site with projects and about page',
  },
  docs: {
    name: 'Documentation',
    description: 'A documentation site with sidebar navigation',
  },
  minimal: {
    name: 'Minimal',
    description: 'A minimal setup with just the CMS integration',
  },
};

async function main() {
  console.log();
  console.log(pc.bold(pc.cyan('  create-saastro')));
  console.log(pc.dim('  Scaffold a new SaastroCMS project'));
  console.log();

  program
    .name('create-saastro')
    .description('Scaffold a new SaastroCMS project with Astro')
    .argument('[project-name]', 'Name of the project')
    .option('-t, --template <template>', 'Template to use (blog, portfolio, docs, minimal)')
    .option('--npm', 'Use npm as package manager')
    .option('--pnpm', 'Use pnpm as package manager')
    .option('--yarn', 'Use yarn as package manager')
    .option('--bun', 'Use bun as package manager')
    .option('--no-git', 'Skip git initialization')
    .option('--no-install', 'Skip dependency installation')
    .option('-y, --yes', 'Accept all defaults')
    .parse();

  const args = program.args;
  const opts = program.opts();

  let config: ProjectConfig;

  if (opts.yes) {
    config = {
      name: args[0] || 'my-saastrocms-site',
      template: (opts.template as Template) || 'blog',
      packageManager: getDefaultPackageManager(opts),
      typescript: true,
      git: opts.git !== false,
      install: opts.install !== false,
    };
  } else {
    config = await promptConfig(args[0], opts);
  }

  await createProject(config);
}

function getDefaultPackageManager(opts: Record<string, unknown>): 'npm' | 'pnpm' | 'yarn' | 'bun' {
  if (opts.npm) return 'npm';
  if (opts.pnpm) return 'pnpm';
  if (opts.yarn) return 'yarn';
  if (opts.bun) return 'bun';

  // Detect from environment
  const userAgent = process.env.npm_config_user_agent || '';
  if (userAgent.startsWith('pnpm')) return 'pnpm';
  if (userAgent.startsWith('yarn')) return 'yarn';
  if (userAgent.startsWith('bun')) return 'bun';
  return 'npm';
}

async function promptConfig(
  projectName?: string,
  opts?: Record<string, unknown>,
): Promise<ProjectConfig> {
  const { prompt } = enquirer;

  // Project name
  const nameAnswer = projectName
    ? { name: projectName }
    : await prompt<{ name: string }>({
        type: 'input',
        name: 'name',
        message: 'Project name:',
        initial: 'my-saastrocms-site',
        validate: (value: string) => {
          if (!value.trim()) return 'Project name is required';
          if (!/^[a-z0-9-_]+$/i.test(value)) {
            return 'Project name can only contain letters, numbers, dashes, and underscores';
          }
          return true;
        },
      });

  // Template selection
  const templateAnswer = opts?.template
    ? { template: opts.template as Template }
    : await prompt<{ template: Template }>({
        type: 'select',
        name: 'template',
        message: 'Which template would you like to use?',
        choices: Object.entries(TEMPLATES).map(([value, { name, description }]) => ({
          name: value,
          message: `${name} - ${pc.dim(description)}`,
          value,
        })),
      });

  // Package manager
  const pmAnswer = await prompt<{ packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun' }>({
    type: 'select',
    name: 'packageManager',
    message: 'Which package manager would you like to use?',
    choices: [
      { name: 'pnpm', message: 'pnpm (recommended)' },
      { name: 'npm', message: 'npm' },
      { name: 'yarn', message: 'yarn' },
      { name: 'bun', message: 'bun' },
    ],
    initial: 0,
  });

  // Git initialization
  const gitAnswer = await prompt<{ git: boolean }>({
    type: 'confirm',
    name: 'git',
    message: 'Initialize a git repository?',
    initial: true,
  });

  // Install dependencies
  const installAnswer = await prompt<{ install: boolean }>({
    type: 'confirm',
    name: 'install',
    message: 'Install dependencies?',
    initial: true,
  });

  return {
    name: nameAnswer.name,
    template: templateAnswer.template,
    packageManager: pmAnswer.packageManager,
    typescript: true,
    git: gitAnswer.git,
    install: installAnswer.install,
  };
}

async function createProject(config: ProjectConfig) {
  const projectDir = path.resolve(process.cwd(), config.name);

  // Check if directory exists
  if (await fs.pathExists(projectDir)) {
    const files = await fs.readdir(projectDir);
    if (files.length > 0) {
      console.log(pc.red(`\nError: Directory "${config.name}" is not empty.`));
      process.exit(1);
    }
  }

  console.log();
  console.log(`Creating project in ${pc.cyan(projectDir)}`);
  console.log();

  const spinner = ora('Copying template files...').start();

  try {
    // Create project directory
    await fs.ensureDir(projectDir);

    // Copy template files
    const templateDir = path.join(TEMPLATES_DIR, config.template);
    if (await fs.pathExists(templateDir)) {
      await fs.copy(templateDir, projectDir);
    }

    // Copy common files
    const commonDir = path.join(TEMPLATES_DIR, 'common');
    if (await fs.pathExists(commonDir)) {
      await fs.copy(commonDir, projectDir, { overwrite: false });
    }

    // Generate package.json
    await generatePackageJson(projectDir, config);

    // Generate astro.config.mjs
    await generateAstroConfig(projectDir, config);

    // Generate .env.example
    await generateEnvExample(projectDir);

    // Generate tsconfig.json if TypeScript
    if (config.typescript) {
      await generateTsConfig(projectDir);
    }

    spinner.succeed('Template files copied');

    // Initialize git
    if (config.git) {
      spinner.start('Initializing git repository...');
      try {
        execSync('git init', { cwd: projectDir, stdio: 'ignore' });
        await fs.writeFile(path.join(projectDir, '.gitignore'), GITIGNORE_CONTENT);
        spinner.succeed('Git repository initialized');
      } catch {
        spinner.warn('Could not initialize git repository');
      }
    }

    // Install dependencies
    if (config.install) {
      spinner.start(`Installing dependencies with ${config.packageManager}...`);
      try {
        const installCmd = {
          npm: 'npm install',
          pnpm: 'pnpm install',
          yarn: 'yarn',
          bun: 'bun install',
        }[config.packageManager];

        execSync(installCmd, { cwd: projectDir, stdio: 'ignore' });
        spinner.succeed('Dependencies installed');
      } catch {
        spinner.warn('Could not install dependencies');
      }
    }

    // Success message
    console.log();
    console.log(pc.green('  Project created successfully!'));
    console.log();
    console.log('  Next steps:');
    console.log();
    console.log(`    ${pc.cyan('cd')} ${config.name}`);
    if (!config.install) {
      console.log(`    ${pc.cyan(config.packageManager)} install`);
    }
    console.log(`    ${pc.cyan('cp')} .env.example .env`);
    console.log(`    ${pc.dim('# Edit .env with your GitHub OAuth credentials')}`);
    console.log(
      `    ${pc.cyan(config.packageManager)} ${config.packageManager === 'npm' ? 'run ' : ''}dev`,
    );
    console.log();
    console.log(`  ${pc.dim('Documentation:')} https://saastrocms.com/docs`);
    console.log();
  } catch (error) {
    spinner.fail('Failed to create project');
    console.error(error);
    process.exit(1);
  }
}

async function generatePackageJson(projectDir: string, config: ProjectConfig) {
  const packageJson = {
    name: config.name,
    type: 'module',
    version: '0.0.1',
    scripts: {
      dev: 'astro dev',
      build: 'astro check && astro build',
      preview: 'astro preview',
      astro: 'astro',
    },
    dependencies: {
      '@astrojs/check': '^0.9.0',
      '@astrojs/cloudflare': '^12.0.0',
      '@astrojs/react': '^4.0.0',
      '@saastro/cms': '^0.0.1',
      '@saastro/editor': '^0.0.1',
      '@saastro/ui-kit': '^0.0.1',
      '@saastro/visual-editor': '^0.0.1',
      astro: '^5.0.0',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      typescript: '^5.9.0',
    },
    devDependencies: {
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      wrangler: '^3.0.0',
    },
  };

  await fs.writeJson(path.join(projectDir, 'package.json'), packageJson, { spaces: 2 });
}

async function generateAstroConfig(projectDir: string, _config: ProjectConfig) {
  const content = `import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import saastrocms from '@saastro/cms';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    react(),
    saastrocms({
      github: {
        owner: process.env.GITHUB_OWNER || '',
        repo: process.env.GITHUB_REPO || '',
        branch: process.env.GITHUB_BRANCH || 'main',
        contentPath: 'src/content',
      },
      admin: {
        route: '/admin',
      },
      visualEditor: {
        enabled: true,
      },
    }),
  ],
});
`;

  await fs.writeFile(path.join(projectDir, 'astro.config.mjs'), content);
}

async function generateEnvExample(projectDir: string) {
  const content = `# GitHub OAuth App credentials
# Create at: https://github.com/settings/developers
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Repository settings
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo
GITHUB_BRANCH=main

# Session secret (generate a random 32+ character string)
SESSION_SECRET=

# Encryption key (32 bytes hex)
ENCRYPTION_KEY=

# Optional: Cloudflare R2 for media storage
# R2_BUCKET_NAME=
`;

  await fs.writeFile(path.join(projectDir, '.env.example'), content);
}

async function generateTsConfig(projectDir: string) {
  const tsconfig = {
    extends: 'astro/tsconfigs/strict',
    compilerOptions: {
      jsx: 'react-jsx',
      jsxImportSource: 'react',
    },
  };

  await fs.writeJson(path.join(projectDir, 'tsconfig.json'), tsconfig, { spaces: 2 });
}

const GITIGNORE_CONTENT = `# Dependencies
node_modules/

# Build
dist/
.astro/

# Environment
.env
.env.local
.dev.vars

# Cloudflare
.wrangler/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
`;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
