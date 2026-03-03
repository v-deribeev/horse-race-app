# 🐎 Horse Racing Simulator

A real-time, purely client-side Horse Racing Simulator built with **Vue 3, TypeScript, Pinia, and Tailwind CSS**.

🎯 **[Live Demo on Netlify](https://horse-simulator.netlify.app/)** 💻 **[GitHub Repository](https://github.com/v-deribeev/horse-race-app)**

---

## 🚀 Features

- **Dynamic Generation:** Instantly rolls a roster of 20 unique horses with randomized stats and colors.
- **Tournament Engine:** Mathematically pairs horses across a 6-round schedule (1200m to 2200m).
- **Real-time Animations:** Visualizes the race using `requestAnimationFrame` for smooth CSS transformations.
- **Granular Controls:** Run the race normally, click **Skip All** to instantly fast-forward the math to the end, or click **Replay** to replay the same tournament scenario with the same result.

---

## 🏗️ Architecture & Engineering Decisions

This project was built with **Domain-Driven Design (DDD)** principles in mind, strictly decoupling the business logic from the UI framework.

1. **The Domain Layer (`src/domain`):** Contains the core mathematical engine (`race.engine.ts`), factories, and types. This layer is written in pure TypeScript and has no dependencies on Vue or Pinia. It takes inputs, crunches numbers, and returns results.
2. **The State Layer (`src/stores`):** The Pinia store acts as the orchestrator. It handles the pacing, triggers the domain logic, and holds the reactivity for the UI to consume.
3. **The Presentation Layer (`src/components`):** Vue components are kept as "dumb" as possible. The `RaceTrack.vue` does not calculate who wins; it simply reacts to the data the store gives it and handles the visual interpolation.

---

## 🧪 Testing Strategy

The application is heavily tested using a two-pronged approach to ensure both mathematical integrity and UX reliability.

### Unit Testing (Vitest)

Unit tests focus on the pure functions and the Pinia store.

- **Native API Stubbing:** Utilities like `Math.random` are stubbed using `vi.spyOn` to test absolute maximum/minimum bounds and to remove randomness when verifying the sorting algorithms of the race engine.
- **Module Mocking:** The Pinia store is tested in isolation by mocking the domain layer to test state transitions without running the actual game engine.

### End-to-End Testing (Cypress)

The E2E suite tests the "Happy Path" user journey.

- **Custom DSL:** Repetitive UI interactions were abstracted into semantic custom commands in `commands.ts` (e.g., `cy.setupTournament()`, `cy.fastForwardToEnd()`), making the test files incredibly readable and self-documenting.

---

## 🛠️ Local Development Setup

This project uses `pnpm` as its package manager.

### 1. Install Dependencies

```sh
pnpm install
```

### 2. Run the Development Server

```sh
pnpm dev
```

### 3. Run the Tests

To verify the engine mathematics and state management:

```sh
pnpm test:unit
```

To run the Cypress UI test runner (against the Vite dev server):

```sh
pnpm test:e2e:dev
```

---

## 🧠 Assumptions & Technical Decisions

During development, a few requirements were ambiguous or referenced older technologies. I made the following educated architectural decisions:

- **Requirement Resolution (1 to 20 Horses):** The requirements stated the generator should create "1 to 20 horses," but the rules stated the game must have 20 available horses, 6 rounds and select 10 random horses per round. Because a 10-horse race is impossible to run w a pool of 1 horse, I prioritized the Rules (generating exactly 20 horses) to ensure the core game engine could function correctly.
- **State Management (Pinia vs. Vuex):** Because Vuex is officially deprecated in the Vue ecosystem, I opted for **Pinia**. It is the modern, optimized standard, offering superior TypeScript inference and a significantly smaller bundle size.
- **Styling (Tailwind CSS):** Chosen as the industry standard for utility-first CSS. It drastically reduces maintenance overhead and CSS bloat while allowing for rapid, responsive prototyping.
- **Scope & Complexity Management (Pause/Resume):** I intentionally omitted a mid-race "Pause/Resume" feature. Pausing a `requestAnimationFrame` loop requires precise delta-time snapshotting and comes with heavy cross-browser caveats (such as handling background-tab throttling). Since it wasn't strictly required, I focused on a bulletproof "Fast-Forward / Skip All" flow instead.
- **UX Enhancements:** I took the liberty of adding visual tweaks not requested in the brief, such as track highlighting (Gold, Silver, Bronze) to give the app a more arcade-like feel.

---

## 🗺️ Future Roadmap & Estimations

If this were a production application in an Agile environment, here is how I would scope the next iterations:

- **Internationalization (i18n) — (2) Story Points**
  - _Implementation:_ Integrate `vue-i18n`, extract all hardcoded strings into translation dictionaries (e.g., `en.json`, `es.json`), and add a global language toggle. Low complexity given the app's current size.
- **Component Library (Storybook) — (3) Story Points**
  - _Implementation:_ Setup Storybook alongside Vite, configure Tailwind CSS within the Storybook iframe, and document isolated UI components (`GenericButton`, `HorseListCard`, etc.) for UI testing and design handoffs.
- **True Pause/Resume Functionality — (5) Story Points**
  - Implementation: Refactor the animation loop to track exact elapsed millisecond timestamps and calculate offset deltas.
  - Caveats: High complexity due to cross-device sync issues and browser behaviors that throttle or suspend `requestAnimationFrame` when the user switches tabs.
