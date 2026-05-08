# TovolBox Security Notes

This document records current privacy, security, and dependency-audit decisions.

## Local Processing

- TovolBox is currently a static Cloudflare Pages site.
- Text, JSON, image, encoding, hashing, and reflection tools are designed to run in the browser when the task can be completed locally.
- Local tools do not send pasted text, files, images, JSON payloads, hash inputs, or reflection quiz answers to TovolBox servers.
- Search loads a static locale-specific JSON index from the site. The app does not send search text to a search API.
- Users should avoid pasting secrets, credentials, or sensitive personal data unless they understand the output and sharing risk.

## Reflection Tools

- Reflection quizzes are non-clinical and self-authored.
- They are for personal insight, self-reflection, and education only.
- They do not provide a medical diagnosis, clinical psychological assessment, treatment recommendation, or substitute for support from a qualified professional.
- MMPI and SCL-90 pages remain educational guides only. TovolBox does not reproduce official questions, scoring, or interpretation systems.

## Analytics

- Analytics are not required for the tools to work.
- If page-level analytics are enabled later, they must not collect textbox contents, files, images, JSON payloads, hash inputs, or reflection quiz answers.
- Session recording, heatmap tools, and tools that capture page input should not be added.
- The privacy page must be updated before analytics behavior changes.

## Headers

Cloudflare Pages serves `public/_headers` with defensive defaults:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-Frame-Options: DENY`

The current CSP allows inline scripts and styles because Astro pages and islands emit inline bootstrapping and existing pages use inline styles. Tightening this further should be tested against `npm run verify` and live hydration.

## Dependency Audit

Last reviewed: 2026-05-09.

`npm audit` originally reported vulnerabilities from the development-only Astro checking chain:

- `@astrojs/check`
- `@astrojs/language-server`
- `volar-service-yaml`
- `yaml-language-server`
- `yaml@2.7.1`

The underlying advisory was `GHSA-48c2-rrv3-qjmp`, a stack overflow risk in deeply nested YAML collections for `yaml >=2.0.0 <2.8.3`.

After that fix, npm also reported `GHSA-q3j6-qgpj-74h6`, a high severity path traversal advisory for `fast-uri <=3.1.0`, reached through `yaml-language-server -> ajv -> fast-uri`.

Decision:

- Do not run `npm audit fix --force`, because npm suggested a semver-major downgrade of `@astrojs/check` to `0.9.2`.
- Add a targeted npm `overrides` entry so `yaml-language-server` uses `yaml@2.8.3`.
- Add a targeted npm `overrides` entry so `fast-uri` uses `3.1.2`.
- Re-run `npm install` to update `package-lock.json`.
- Confirm `npm audit` reports 0 vulnerabilities.

Verification commands:

```bash
npm audit
npm ls yaml yaml-language-server @astrojs/check
```
