# Netlify Skills

This file documents the 16 Netlify skills installed in this workspace for use by Claude Code and other agents. All skills were installed from `https://github.com/netlify/context-and-tools.git` and are available in `~/.agents/skills/`.

## Installed Skills

### 1. netlify-access-control
**Path:** `~/.agents/skills/netlify-access-control`

Picks the right Netlify protection layer for a deployed site and disambiguates the three unrelated things people call "auth". Use when a developer wants to password-protect a site or previews, restrict a project to their team, make a project public/private, set team visibility defaults, require SSO to view a site, or debug SSO-session symptoms like being logged out mid-session / getting 401s on a SSO-protected site / token expiry or refresh. Routes app-user login ("who is this user in my app") to the netlify-identity skill and dashboard/team SSO SSO elsewhere; this skill only chooses the perimeter layer for site/preview access.

### 2. netlify-agent-runner
**Path:** `~/.agents/skills/netlify-agent-runner`

Run AI agent tasks remotely on Netlify using Claude, Codex, or Gemini. Use when the user wants to run an AI agent on their site, get a second opinion from another model, or delegate development tasks to run remotely against their repo.

### 3. netlify-ai-gateway
**Path:** `~/.agents/skills/netlify-ai-gateway`

Use OpenAI, Anthropic, Google Gemini, or OpenRouter models from Netlify Functions or Edge Functions without managing provider API keys or accounts — the gateway injects credentials automatically. Reach for this when you add an AI chatbot or completion endpoint, generate images or text with Gemini/GPT/Claude, summarize form submissions with AI, build an LLM-backed API route, stream a long AI generation, or wire up any server-side AI provider call on Netlify. Covers provider SDK setup, injected env vars, model availability, rate limits, credit costs, streaming for long generations, and local dev with netlify dev or the Vite plugin.

### 4. netlify-blobs
**Path:** `~/.agents/skills/netlify-blobs`

Store and retrieve unstructured objects, file uploads, and cache-like state on Netlify using the @netlify/blobs key/value API from Functions, Edge Functions, and Build Plugins. Use when a task involves saving user file or image uploads, persisting form or contact-form submissions, storing generated output from Background Functions (sitemaps/processed media/bulk-email results), building read-only asset stores, adding client-side blob expiration, or wiring file-based blob uploads at deploy time. Not for per-user, transactional, or relational data (counters/balances/sessions) — reach for Netlify DB there instead.

### 5. netlify-caching
**Path:** `~/.agents/skills/netlify-caching`

Cache dynamic and static responses on Netlify's CDN from Functions, Edge Functions, and proxies. Use when you add caching or cache-control headers to a function response, tune cache TTL or stale-while-revalidate, set up the durable cache, vary a cache key by query/header/cookie/country/language, purge or invalidate the cache by site or cache tag, use the programmatic Cache API (caches.open/match/put) or @netlify/cache helpers (fetchWithCache/cacheHeaders/getCacheStatus), speed up an expensive API call, add ISR or on-demand revalidation, or debug why a response is or isn't cached via the Cache-Status header.

### 6. netlify-config
**Path:** `~/.agents/skills/netlify-config`

Configure Netlify projects via netlify.toml and the _headers/_redirects files — covering build settings and deploy contexts alongside environment variables/scopes and the Secrets Controller plus redirect/rewrite/proxy and custom-header rules. Use when setting a build command or publish directory, adding redirect or rewrite or proxy rules, configuring custom headers or basic auth, setting or scoping environment variables and secrets, wiring up a monorepo or SPA fallback, or skipping unnecessary builds. Reach for this whenever you touch netlify.toml or ask "why is my env var undefined in a function" or "how do I redirect this path".

### 7. netlify-database
**Path:** `~/.agents/skills/netlify-database`

Zero-config Postgres for Netlify apps via @netlify/database — querying data from Functions/Edge Functions, writing schema migrations, setting up Drizzle ORM, local dev with netlify dev, database branches for deploy previews, and migrating an existing Postgres project onto Netlify. Use when adding a database, building a contact form or CRUD API, writing SQL migrations, wiring up Drizzle, running netlify database commands, testing with a local Postgres, or switching from Neon/Supabase/RDS to Netlify Database.

### 8. netlify-deploy
**Path:** `~/.agents/skills/netlify-deploy`

Create and manage Netlify deploys — Git continuous deployment, CLI manual/anonymous deploys, Deploy to Netlify buttons, drag-and-drop, and per-context netlify.toml build settings. Use when linking a repo, deploying from the CLI, setting up Deploy Previews or branch deploys, configuring deploy contexts, adding skew protection, fixing a failed or secrets-flagged deploy, or wiring build hooks and Deploy to Netlify buttons.

### 9. netlify-edge-functions
**Path:** `~/.agents/skills/netlify-edge-functions`

Write, configure, and deploy Netlify Edge Functions (Deno runtime at the network edge) in TypeScript/JavaScript. Use when adding request/response manipulation at the edge — auth middleware, geolocation redirects, A/B testing and personalization, content localization, redirects/rewrites, SSR at the edge, or transforming responses — or when configuring path routing, response caching, or edge error handling. Triggers on tasks like "add auth middleware", "geo-based redirect", "A/B testing at the edge", "rewrite requests", or editing files in netlify/edge-functions.

### 10. netlify-forms
**Path:** `~/.agents/skills/netlify-forms`

Serverless form handling on Netlify-hosted sites — detects HTML forms at deploy time, stores submissions, filters spam, and sends notifications. Use when adding a contact form, lead-capture form, file-upload form, or newsletter signup to a Netlify site; wiring AJAX form submission; setting up a custom thank-you page; adding a honeypot or reCAPTCHA to a form; getting forms working in Next.js, Astro, SvelteKit, or Gatsby; reading form submissions via the Netlify API; or debugging missing submissions and forms that silently fail to register.

### 11. netlify-frameworks
**Path:** `~/.agents/skills/netlify-frameworks`

Deploy and configure web frameworks on Netlify — build settings and SSR/edge adapters plus local platform emulation and env vars. Use when setting up or fixing a framework deploy (Next.js / Astro / Nuxt / SvelteKit / Remix / React Router / TanStack Start / SolidStart / Gatsby / Angular / Vite / Express / Hydrogen / Hugo / Eleventy / Vue / React), adding SSR or edge functions or middleware wired to Netlify context, fixing SPA redirect and catch-all rules, setting a build command or publish directory, or debugging "why isn't my env var updating" and framework build failures.

### 12. netlify-functions
**Path:** `~/.agents/skills/netlify-functions`

Write, configure, and deploy Netlify serverless functions in TypeScript, JavaScript, or Go. Use this when adding an API endpoint or backend route, adding a contact form handler, wiring auth or Identity signup/login hooks, building streaming or AI-proxy responses, scheduling cron jobs, running long background jobs (batch processing/scraping), reacting to deploy or form events, setting up rate limiting or region/memory config, or reading environment variables and secrets inside a function. Covers file locations, the Request/Context/Response handler shape, path routing, config options, and local testing with netlify dev.

### 13. netlify-identity
**Path:** `~/.agents/skills/netlify-identity`

Add authentication and user management to a Netlify site with @netlify/identity — signup/login/logout, OAuth social login (Google/GitHub/GitLab/Bitbucket), server-side user verification in Functions, role-based access control (RBAC), admin user management, and Identity event hooks. Use when adding a login/signup flow, "add social login", gating content by user role, protecting a function or page behind auth, assigning roles at signup, customizing auth emails, or handling OAuth/confirmation/recovery callbacks. Not for locking an entire site to a company/team — that is netlify-access-control.

### 14. netlify-image-cdn
**Path:** `~/.agents/skills/netlify-image-cdn`

Transform, resize, crop, reformat, and optimize images on demand via Netlify Image CDN's /.netlify/images endpoint. Use when adding responsive images, generating thumbnails, converting formats (avif/webp/png), cropping to aspect ratios, tuning image quality, creating blurred placeholders, allowlisting remote image domains, serving user-uploaded images, or wiring framework image components (Next.js, Astro, Nuxt, Angular, Gatsby). Triggers on tasks like "optimize images", "add image thumbnails", "resize images on the fly", "serve images from an external domain", or "add blur placeholders".

### 15. netlify-mcp-servers
**Path:** `~/.agents/skills/netlify-mcp-servers`

Build, deploy, and secure Model Context Protocol (MCP) servers on Netlify. Use whenever the task involves creating an MCP server, exposing an app or API to AI agents as MCP tools, letting Claude / Cursor / Claude Code call a custom remote server, or adding MCP tools to an existing Netlify site. Covers the MCP SDK + Streamable HTTP transport on a Netlify Function, authentication (single shared secret vs per-user API keys with Netlify Identity), read/write safety, file uploads, and connecting clients. Use even when the user just says "MCP", "tool server for an agent", or "let an AI use my API".

### 16. skill-creator
**Path:** `~/.agents/skills/skill-creator`

Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.

## How to Use These Skills

To use a specific skill, invoke it by name in your request. For example:

- "Use netlify-config to set up netlify.toml"
- "Use netlify-functions to create an API endpoint"
- "Use netlify-deploy to deploy this site"
- "Use netlify-database to add a database"

## Source

All 16 skills were installed from the Netlify `context-and-tools` repository:
`https://github.com/netlify/context-and-tools.git`
