# Willy Wonka and the Chocolate Factory Training Platform

This is a solution for a Frontend case: a small course editor for Wonka's trainers.

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

## What it does

A course is an ordered list of steps. Each step is text, an image or a multiple choice question. A trainer can:

- Name the course.
- Add text, image and question steps.
- Edit a step in place: rich text with headings, lists and alignment; an image from a file or a link; a question with options and the correct ones marked.
- Reorder steps by dragging or with the keyboard.
- Collapse steps, delete them to a trash that can restore them, and undo or redo any change.
- Lock the course so nothing can be changed by accident.

The course lives in the browser's session storage. A refresh keeps the work and a new tab starts from the demo course.

## Assumptions and open questions

- One trainer edits one course at a time. There is no sign-in, no list of courses and no collaboration.
- Trainers might want to create or edit courses on both desktops and mobile, so the system should be built for different screen sizes, have keyboard navigation and be accessible with a screen reader.
- A question may have more than one correct option. The brief says one, so a new question starts with one, but a trainer can mark several.
- Images are resized in the browser and stored inside the course, so the course stays self-contained without a backend.
- Things I would want to find out: how long a typical course is, whether steps are reused across courses, how trainees consume a course (which decides what a preview should look like) and whether a course needs review before it reaches the floor.

## What I chose not to build, and why

- A course list, sharing and publishing. They need a backend to mean anything, and the task is about the editor.
- A trainee preview. The collapsed view already shows each step the way a trainee would read it, so a separate mode added little for the time it would take.
- Validation that blocks saving. An empty step is allowed, because the tool should be forgiving. A step that was never touched simply does not go to the trash when deleted.
- Automated tests. With the time cap I put the hours into the interaction details, and checked each change with type-checks, linting, a production build and headless Chrome scripts at desktop and phone widths.
- Due to time limitations and being limited to only FE app, having additional settings around how the changes are saved was considered out of scope.

## Key design decisions

- The model is separate from the UI. `src/model` holds pure functions for every change to a course, `src/data` holds the undo history and a swappable repository, and the page components only render and dispatch.
- Undo and redo cover every change and deleted steps go to a trash with restore. Nobody should be afraid of breaking something.
- Edits are live. Typing updates the course straight away, and Discard puts the step back the way it was when editing started.
- React Aria Components for every control, so keyboard and screen reader support come with the design instead of being added later.
- Design tokens as CSS custom properties for colour, spacing, type, motion and layers, with every size in responsive units so the layout follows the user's font size.
- Animations are CSS transitions wherever the end state is known. The Web Animations API is only used where a height has to be measured first: expanding a step, reordering and removing.
- The look follows the factory: a chocolate and caramel palette, a golden ticket for the course name, candy-stripe cards, chocolate drips under the header and a blueberry that inflates while the course loads.
- Accessibility in mind. Making sure the contrasts match the requirements, the text can be enlarged, and an option for reduced motion.

## AI assistance

I use Claude Code as a pair programmer. I make the design and architecture decisions, and Claude Code implements them while I review and iterate in small steps.

- **Building from references:** I describe what I want to achieve, sometimes providing examples from CodePen. Claude does the coding.
- **Iterating on design:** I review the overall design in the browser on various screen sizes and give feedback to Claude to iterate on until I am happy with the result.
- **Standing rules:** Claude Code's memory holds my conventions: good practices, preference on local vs shared variables and functions, responsive design, typography, accessibility requirements and no unnecessary code comments.
- **Verification:** every change is checked with Oxlint, Stylelint and a production build. Visual changes and interaction flows are also checked with headless Chrome scripts at desktop and phone widths.
- **Git:** I manage git commits myself. Since it's a small demo project with limited hours, I didn't focus on creating small PRs, as I was reviewing the code changes on the code while iterating with Claude.
