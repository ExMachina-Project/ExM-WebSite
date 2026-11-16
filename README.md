# ExMachina Website

Next.js App Router website for ExMachina, a local-first collective intelligence orchestration system. All application code, route handlers, configuration and build scripts use TypeScript with strict type checking.

## Development

Requires Node.js **22.18 or newer** (Node 22 LTS is used for deployment). Node's native TypeScript support runs the Cloudflare build script without an extra transpiler.

```sh
npm install
npm run dev
```

The site runs at `http://localhost:3000`. To access it from the LAN, use `npm run dev -- --hostname 0.0.0.0`.

Run `npm run lint` and `npm run typecheck` before submitting changes. Type checking generates Next.js route types before running TypeScript, so it also works on a fresh checkout. The `Check website` workflow runs lint, type checking and a static production build for pushes and pull requests, even when no deployment provider is configured. Production builds and both deployment workflows check types as well.

The project enables `strict`, `noUncheckedIndexedAccess` and typed internal routes. Shared document, search and installer types live with their data modules and in `src/types/`; interactive components use typed props, DOM references and events. `next-env.d.ts`, `.next/` route types and TypeScript build caches are generated and ignored by Git.

## Production

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_ORIGIN` when install commands should use a fixed public site URL (including a deployment subpath, if applicable). The `/install` and `/install.bat` routes serve the root installer scripts and can also be exported as static files.

## Cloudflare Pages

The website supports Cloudflare Pages as a static site. The build exports the homepage, documentation, search data, plugin preview and installer scripts to `out/`. No Node.js server is needed after deployment.

### Connect the repository in Cloudflare

In **Workers & Pages → Create application → Pages → Import an existing Git repository**, select `ExMachina-Project/ExM-WebSite` and use these settings:

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (Static HTML Export) |
| Production branch | `main` |
| Build command | `npm run build:cloudflare` |
| Build output directory | `out` |
| Root directory | Repository root |
| Environment variable | `NODE_VERSION=22` |

`build:cloudflare` enables static export and clears the GitHub Pages base path. Cloudflare's native `CF_PAGES=1` environment is also recognized by `npm run build`.

Leave `NEXT_PUBLIC_SITE_ORIGIN` unset to generate installer commands from the domain currently being visited, including preview URLs and custom domains. Set it to your public HTTPS URL only if commands should always use one fixed domain. `public/_headers` preserves the exported installers' content types and the Windows download filename.

Cloudflare's Git integration automatically rebuilds on pushes and creates preview deployments. Use this integration or the GitHub Actions workflow below for a project, so both do not deploy the same commit twice.

### Deploy through GitHub Actions

For an existing Cloudflare Pages project, configure these **repository-level** settings in GitHub:

| Type | Name | Value |
| --- | --- | --- |
| Secret | `CLOUDFLARE_API_TOKEN` | An API token scoped to the target account with **Account → Cloudflare Pages → Edit** permission |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| Variable | `CLOUDFLARE_PAGES_PROJECT` | Your existing Pages project name, with `main` as its production branch |
| Optional variable | `CLOUDFLARE_SITE_ORIGIN` | A fixed public HTTPS URL for installer commands; leave empty to follow the visited domain |

The `Deploy to Cloudflare Pages` workflow deploys on pushes to `main` once the project variable is set. Before configuration, push runs are skipped. You can also select **Actions → Deploy to Cloudflare Pages → Run workflow** and enter a project name. Credentials stay in GitHub Secrets.

To build and inspect the same output locally:

```sh
npm run lint
npm run typecheck
npm run build:cloudflare
npx wrangler@4 pages dev out
```

For a direct upload after logging into Wrangler:

```sh
npx wrangler@4 pages deploy out --project-name=YOUR_PROJECT_NAME
```

See Cloudflare's [Next.js static site guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/) and [direct upload guide](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).

## GitHub Pages

The `Deploy to GitHub Pages` workflow installs dependencies, runs lint, exports the site and publishes only the `out/` directory. In the repository's **Settings → Pages**, select **GitHub Actions** as the deployment source, then run the workflow manually. Set the repository variable `GITHUB_PAGES_ENABLED=true` to also deploy on pushes to `main`; otherwise push runs are skipped so using Cloudflare does not require enabling GitHub Pages.

The workflow reads the public site URL and base path from GitHub Pages, so links, favicons, documentation and installer commands work at both a project URL and a custom domain.

To build a project deployment locally:

```sh
GITHUB_PAGES=true \
NEXT_PUBLIC_BASE_PATH=/ExM-WebSite \
NEXT_PUBLIC_SITE_ORIGIN=https://exmachina-project.github.io/ExM-WebSite \
npm run build
```

Serve `out/` with a static web server at the configured base path. GitHub Pages does not require a running Next.js server. Run `npm run build` without `GITHUB_PAGES`, `CLOUDFLARE_PAGES` or `CF_PAGES` to return to the Node.js deployment used by `npm start`.

## Pages and documentation

- `/` — project homepage and interactive collaboration demos.
- `/docs` — documentation hub with local full-text search.
- `/docs/[slug]` — guides rendered from `content/docs/*.md`, with chapter links, code copying and article navigation.
- `/plugins` — future plugin marketplace preview, with links to the existing plugin development guide. It does not offer marketplace installation or publishing.

Document navigation is defined in `src/data/documentation.ts`. Add a Markdown file and a matching entry to publish another guide; article routes and the search index are generated at build time. Keep screenshots, credentials and runtime data out of public content.
