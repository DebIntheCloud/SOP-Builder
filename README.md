**SOP Builder (Internal Tool)**

A lightweight internal tool to create clean, reusable SOPs from a structured form.

Built with React + Vite to practice state management patterns while solving a real documentation need.

**What this tool does (V1)**

- Fill out SOP metadata (title, purpose, scope, owner, frequency)

- Add, edit, and remove procedural steps

- Add, edit, and remove reference links

- Generate live Markdown output from the form

- Designed to be copy-ready for documentation systems
  
**Why this exists**

I work in a process-heavy environment where clear SOPs matter.
This tool is meant to reduce friction when documenting workflows and serve as a foundation for future internal tools.

It also serves as hands-on practice for core React patterns:

    - controlled inputs

    - object and array state updates

    - derived values

    - clean component structure

**Tech stack**

- React

- Vite

- JavaScript (ES6+)

- CSS
- 
**Current structure**

- State

    - SOP fields (object)

    - Steps (array)

    - Links (array)

- Handlers

  - Generic field updater

  - Step add / update / remove

  - Link add / update / remove

- Derived values

  - Markdown output generated from state

**Planned improvements**

- LocalStorage persistence

- Copy-to-clipboard button

- PDF export

- Step reordering

- Improved layout and styling

**Getting started**

npm install
npm run dev

**Notes**
This project is built incrementally.
Commits reflect learning milestones rather than a finished product.
