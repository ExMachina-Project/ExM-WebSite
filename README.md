# ExMachina Website

Next.js App Router website for ExMachina, a local-first collective intelligence orchestration system.

## Development

```sh
npm install
npm run dev
```

The site runs at `http://localhost:3000`. To access it from the LAN, use `npm run dev -- --hostname 0.0.0.0`.

## Production

```sh
npm run lint
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_ORIGIN` when install commands should use a fixed public site URL (including a deployment subpath, if applicable). The `/install` and `/install.bat` routes serve the root installer scripts and can also be exported as static files.

## GitHub Pages

The `Deploy to GitHub Pages` workflow installs dependencies, runs lint, exports the site and publishes only the `out/` directory. In the repository's **Settings → Pages**, select **GitHub Actions** as the deployment source. Push to `main` or run the workflow manually to deploy.

The workflow reads the public site URL and base path from GitHub Pages, so links, favicons, documentation and installer commands work at both a project URL and a custom domain.

To build a project deployment locally:

```sh
GITHUB_PAGES=true \
NEXT_PUBLIC_BASE_PATH=/ExM-WebSite \
NEXT_PUBLIC_SITE_ORIGIN=https://exmachina-project.github.io/ExM-WebSite \
npm run build
```

Serve `out/` with a static web server at the configured base path. GitHub Pages does not require a running Next.js server. Run `npm run build` without `GITHUB_PAGES` to return to the Node.js deployment used by `npm start`.

## Pages and documentation

- `/` — project homepage and interactive collaboration demos.
- `/docs` — documentation hub with local full-text search.
- `/docs/[slug]` — guides rendered from `content/docs/*.md`, with chapter links, code copying and article navigation.
- `/plugins` — future plugin marketplace preview, with links to the existing plugin development guide. It does not offer marketplace installation or publishing.

Document navigation is defined in `src/data/documentation.js`. Add a Markdown file and a matching entry to publish another guide; article routes and the search index are generated at build time. Keep screenshots, credentials and runtime data out of public content.
