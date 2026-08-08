# hiradfazeli.github.io

Personal site of **Hirad Fazeli** — founder & engineer, building [ZEEberton](https://zeeberton.com).

Live at **<https://hiradfazeli.github.io>**.

---

## Stack

| | |
|---|---|
| Framework | [Astro 5](https://astro.build) — static output, zero JS by default |
| Styling | Hand-written CSS with custom properties. No framework. |
| Fonts | Self-hosted via Fontsource (Libre Caslon Display, Inter, JetBrains Mono) |
| Hosting | GitHub Pages, deployed by GitHub Actions |
| Backend | None. Everything is prerendered at build time. |

No third-party runtime requests: no CDN fonts, no analytics, no trackers.

## Running it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/
npm run preview    # serve the built output
npm run check      # astro check (TypeScript)
npm run og         # regenerate og-default.png + favicons
```

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds with `withastro/action` and publishes via `actions/deploy-pages`.

The repository's **Settings → Pages → Source** must be set to **GitHub Actions**.

## Structure

```
src/
  data/profile.ts     ← single source of truth for every fact about Hirad
  lib/schema.ts       JSON-LD node builders (one canonical Person, referenced by @id)
  layouts/            BaseLayout
  components/         Seo, Header, Footer, ThemeToggle, Monogram, Guilloche, WorkCard
  scripts/art.ts      the "JS Art" layer — guilloché canvas, reveals, theme toggle
  pages/              index, work/, work/zeeberton, about, cv, contact, 404
  styles/global.css   design tokens, typography, print stylesheet
public/               favicons, og-default.png, robots.txt, manifest
scripts/generate-og.mjs
```

### One rule worth knowing

**Every fact about Hirad lives in [`src/data/profile.ts`](src/data/profile.ts)** — experience,
skills, certifications, education, languages, links. The CV page, the homepage and the
JSON-LD structured data all read from it.

This is deliberate. The previous version of this site kept the same facts in two places
(`index.html` and `readme.md`) and they drifted: different city, different phone number,
different certification expiry date. Structured data that contradicts visible copy also
costs search trust. Keeping one copy makes that class of bug impossible rather than
merely unlikely.

Change a fact there, and the whole site follows.

## Design

"Old money with a subtle essence of modernity" — deep ink, parchment, antique brass;
Caslon headings over Inter body; hairline rules and letterspaced small caps. Dark by
default, with a warm parchment light mode that follows the OS and can be overridden.

The hero engraving is a **guilloché** — the engine-turned pattern found on banknotes,
share certificates and watch dials — generated from a hypotrochoid on `<canvas>`. Two
rosettes counter-rotate at different speeds, and the moiré between them is what moves.
Each is rendered offscreen exactly once, so the per-frame cost is two `drawImage` calls.

All motion is progressive enhancement: every page renders complete with JavaScript
disabled, the canvas is `aria-hidden`, and the whole layer stands still under
`prefers-reduced-motion`.

## Licence

Code is free to learn from. The written content, CV and imagery are © Hirad Fazeli.
