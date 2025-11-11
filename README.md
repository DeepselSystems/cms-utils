# @deepsel/cms-utils

A collection of light-weight helper functions for building DeepCMS features in JavaScript/TypeScript apps.

`@deepsel/cms-utils` is designed to be:

- **Framework-agnostic** – works with Node, React, Astro, Next.js, etc.
- **TypeScript-friendly** – fully typed helpers.
- **CMS-oriented** – utilities for menus, slugs, URLs, localization, content trees, etc.

---

## Installation

```bash
npm install @deepsel/cms-utils
```

## Basic Usage

Example (TypeScript / ESM):

```typescript
import { getMenusForCurrentLang } from '@deepsel/cms-utils';

const menus = getMenusForCurrentLang();

console.log(menus);
```

## Local Development

This section explains how to develop `@deepsel/cms-utils` and use new, unpublished features in your app locally, using a local file dependency.

### 1. Folder Layout

Clone this repo in your workspace:

```
git clone git@github.com:DeepselSystems/cms-utils.git
```

Put your package and your app side by side:

```
workspace/
├─ cms-utils/    # this repo (@deepsel/cms-utils)
└─ my-app/       # your actual app that consumes it
```

- `cms-utils/` → the npm package repo (this one).
- `my-app/` → any app (React, Vue, Next.js, Astro, etc.) that will import `@deepsel/cms-utils`.

### 2. Configure your App to Use the local package

In `my-app/package.json`, point the dependency to the local folder:

```json
{
  "dependencies": {
    "@deepsel/cms-utils": "file:../cms-utils"
  }
}
```

Then, in `my-app`, run

```bash
npm install
```

What this does:

- Creates a symlink in `my-app/node_modules/@deepsel/cms-utils` that points to `../cms-utils`.
- The app will now use the local source rather than a published version from npm.

### 3. Build the Package in Watch Mode

In `cms-utils`, run

```bash
npm install    # first time only
npm run dev    # tsc --watch, keeps dist/ in sync with src/
```

### 4. Use the Package in the App During Development

In your app (`my-app`), import from `@deepsel/cms-utils` as if it were a regular npm package:

```typescript
// inside my-app
import { getMenusForCurrentLang } from '@deepsel/cms-utils';

const menus = getMenusForCurrentLang();
```

### 5. Build the Package for Production

Once you’re happy with a set of changes, open a PR to merge them into the main branch.
Then you can update your app to use the published version:

```json
{
  "dependencies": {
    "@deepsel/cms-utils": "^1.0.0"
  }
}
```

## License

MIT – feel free to use in your own projects.
