# Willy Wonka and the Chocolate Factory Training Platform

This is a solution for a Frontend case.

The project uses React + TypeScript + Vite.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (required by Vite 8)
- [pnpm](https://pnpm.io/) 9 or later (`npm install -g pnpm`, or `corepack enable`)

## Running the project

```sh
pnpm install
pnpm start
```

Then open http://localhost:3000.

Other scripts:

| Command         | What it does                                    |
| --------------- | ----------------------------------------------- |
| `pnpm build`    | Type-checks and builds for production to `dist` |
| `pnpm preview`  | Serves the production build locally             |
| `pnpm lint`     | Lints TypeScript with oxlint                    |
| `pnpm lint:css` | Lints CSS with Stylelint                        |
| `pnpm format`   | Formats the code with Prettier                  |

## AI assistance

I use Claude Code as a pair programmer. I make the design and architecture decisions, and Claude Code implements them while I review and iterate in small steps.

- **Building from references:** I describe what I want to achieve, sometimes providing examples from CodePen. Claude adapts them for me and I review the results and test manually in a browser.
- **Iterating on design:** I review the overall design in the browser on various screen sizes and give feedback to Claude to iterate on until I am happy with the result.
- **Standing rules:** Claude Code's memory holds my conventions: good practices, preference on local vs shared variables and functions, responsive design, typography, WCAG AA contrast checks, tests and no unnecessary code comments.
- **Verification:** every change is checked with lint, Stylelint, Vitest and Testing Library tests, and a production build. Visual changes are also checked with headless Chrome screenshots at desktop and phone widths.
- **Git:** I manage git commits myself.
