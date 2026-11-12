# MoodBrew – Sip Your Mood.

An Indian Gen-Z mood-based personalised beverage discovery platform built with React and Vite, pairing expressive botanical pours with everyday emotions.

> **Conceptual Campaign Disclaimer:** The **MoodBrew × 7-Eleven** collaboration featured in this project is an **independent, student-created conceptual portfolio study**. It is not affiliated with, sponsored by, approved by, or endorsed by 7-Eleven.

---

## Project Overview

**MoodBrew** reimagines how young consumers discover cold beverages by shifting selection from generic drink categories to how you actually feel in the moment—whether unwinding after a commute, gearing up for a studio sprint, or catching up with friends at golden hour.

The web application combines editorial typography (`Playfair Display`, `DM Sans`, and `Caveat`), a vibrant Gen-Z pastel-editorial palette, tactile micro-interactions via Framer Motion, interactive mood-based drink pairing (**MoodMatch**), category-filtered catalogue browsing, a persistent **MoodBag** cart drawer, brand storytelling, a speculative **MoodBrew × 7-Eleven** campaign study, and locally simulated Contact & Newsletter flows.

---

## Problem Statement & Solution

### Problem Statement
Most beverage menus and convenience aisles organize drinks around technical attributes (caffeine level, sugar content, or broad soda/tea categories) rather than emotional context. For Gen-Z consumers looking for an intentional daily ritual or a quick pick-me-up that matches their headspace, choosing a drink often feels repetitive and impersonal.

### Solution
MoodBrew introduces an **emotion-first beverage discovery experience**:
1. **Mood Discovery & MoodMatch (`/discover`):** Lets visitors choose between five relatable daily moods—*Happy*, *Calm*, *Energetic*, *Romantic*, and *Focus*—and immediately pairs each mood with a signature drink, ingredient breakdown, tasting microcopy, and INR (`₹`) pricing.
2. **Curated Menu & MoodBag (`/menu` & `CartDrawer`):** Provides instant category filtering (`All`, `Fruity`, `Refreshing`, `Creamy`, `Energy`) paired with a slide-out shopping bag that persists quantities across page reloads.
3. **Retail Concept Showcase (`/collaboration`):** Demonstrates how MoodBrew's identity could extend into a 24/7 neighbourhood retail cooler experience through a conceptual MoodBrew × 7-Eleven portfolio study.

---

## Key Features

- **Responsive Multi-Page Experience:** Seamless client-side routing across Home (`/`), Discover (`/discover`), Menu (`/menu`), About (`/about`), Collaboration (`/collaboration` and `/campaign` alias), and Contact (`/contact`), plus automatic fallback redirection for unknown paths.
- **Editorial Design System:** Custom CSS variables in `src/styles/tokens.css` featuring Dreamy Lilac (`#B89AF5`), Cherry Blush (`#FF8FA3`), Butter Cream (`#FFF0B8`), Matcha Mint (`#B8E5D2`), Peach Sorbet (`#F8D4C4`), Plum Cocoa (`#493052`), Milky Background (`#FFFAF5`), and Soft Lavender Surface (`#F0E9FF`).
- **Accessible Motion & Keyboard Support:** Uses `<MotionConfig reducedMotion="user">` alongside CSS `@media (prefers-reduced-motion: reduce)` rules, keyboard focus management on dialogs/forms, `Escape`-key dismissal for the MoodBag drawer, and ARIA attributes for tabs and live status feedback.
- **Simulated Contact & Newsletter Experience:** Includes required-field and regex email validation, loading state animation, and case-insensitive duplicate email prevention stored locally in `localStorage`.

---

## MoodMatch Recommendation Functionality

Located at `/discover` (`src/pages/DiscoverPage.jsx`), **MoodMatch** lets users select one of five mood cards and reveals its paired drink:

| Mood | Vibe Highlight | Recommended Drink | Price (INR) |
| :--- | :--- | :--- | :--- |
| **Happy ☀️** | Golden-hour playlists & rooftop laughter | **Tropical Sunshine** | ₹149 |
| **Calm 🪻** | Post-metro exhale & quiet balcony breeze | **Lavender Fizz** | ₹169 |
| **Energetic 🍋** | Studio sprints, skate runs & late plans | **Citrus Mint Cooler** | ₹129 |
| **Romantic 🍓** | Monsoon walks, film cameras & sweet notes | **Strawberry Rose** | ₹179 |
| **Focus ☕** | Deep work tabs, lo-fi beats & deadline clarity | **Mocha Boost** | ₹159 |

Users can share or bookmark a mood directly via query string (`/discover?mood=calm`), add the recommended beverage straight to **MoodBag**, or click **Try Another Mood** to reset the selection.

> **Important Note:** MoodMatch uses deterministic, rule-based JavaScript mapping (`matchDrinkForMood(moodId)` in `src/data/drinks.js`). It does **not** use an integrated AI/LLM model.

---

## Beverage Catalogue & MoodBag

- **Five Signature Pours (`src/data/drinks.js`):**
  - *Tropical Sunshine* (`₹149`) — Mango, Orange, Pineapple, Sparkling Water
  - *Lavender Fizz* (`₹169`) — Blueberry-Inspired Lavender, Sparkling Water, Citrus Zest
  - *Citrus Mint Cooler* (`₹129`) — Lemon, Fresh Mint, Lime, Sparkling Water
  - *Strawberry Rose* (`₹179`) — Strawberry, Rose-Inspired Flavour, Chilled Milk
  - *Mocha Boost* (`₹159`) — Coffee, Cocoa, Chilled Milk
- **Category Filters (`/menu`):** Filter interactively across `All` (5), `Fruity` (3), `Refreshing` (3), `Creamy` (2), and `Energy` (2) with live item counts.
- **MoodBag Slide-Out Drawer (`src/components/CartDrawer.jsx`):**
  - Displays thumbnails, mood tags, unit prices, line totals, subtotal, and total item count.
  - Supports incrementing, decrementing (minimum quantity `1`), and removing items.
  - Includes an illustrated empty-bag state and a **Checkout (Demo)** flow.

---

## Technology Stack

- **UI Library:** React `^18.3.1` (`react`, `react-dom`)
- **Build Tool & Dev Server:** Vite `^5.4.11` (`@vitejs/plugin-react`)
- **Routing:** React Router DOM `^6.28.0`
- **Animations:** Framer Motion `^11.11.17`
- **Icons:** Lucide React `^0.460.0`
- **Styling:** Modular CSS3 with centralized design tokens (`tokens.css` & `global.css`)

---

## Project Folder Structure

```text
moodbrew/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── assets/
    │   ├── brand-story.jpg
    │   ├── drink-citrus-mint.jpg
    │   ├── drink-lavender-fizz.jpg
    │   ├── drink-mocha-boost.jpg
    │   ├── drink-strawberry-rose.jpg
    │   ├── drink-tropical-sunshine.jpg
    │   └── hero-moodbrew.jpg
    ├── components/
    │   ├── BrandStorySection.jsx / .css
    │   ├── CartDrawer.jsx / .css
    │   ├── CollabSection.jsx / .css
    │   ├── DrinkCard.jsx / .css
    │   ├── FeaturedDrinksSection.jsx / .css
    │   ├── FooterSection.jsx / .css
    │   ├── HeroSection.jsx / .css
    │   ├── MoodDiscoverySection.jsx / .css
    │   ├── MoodMatchSection.jsx / .css
    │   └── Navbar.jsx / .css
    ├── context/
    │   └── CartContext.jsx
    ├── data/
    │   └── drinks.js
    ├── pages/
    │   ├── AboutPage.jsx / .css
    │   ├── CampaignPage.jsx / .css
    │   ├── ContactPage.jsx / .css
    │   ├── DiscoverPage.jsx / .css
    │   ├── HomePage.jsx
    │   └── MenuPage.jsx / .css
    └── styles/
        ├── global.css
        └── tokens.css
```

---

## Installation & Local Development

### Prerequisites
- Node.js (v18+ recommended) and `npm`

### Installation
```bash
git clone <your-repository-url>
cd moodbrew
npm install
```

### Local Development
Start the Vite development server with Hot Module Replacement:
```bash
npm run dev
```
By default, Vite serves the app at `http://localhost:5173` (or the next available port).

### Production Build & Preview
Build optimized static assets into `dist/` and preview locally:
```bash
npm run build
npm run preview
```

---

## Screenshots

> Replace the placeholder paths below with captured screenshots from your running application (for example, stored in a `docs/screenshots/` folder before committing).

- **Home Hero & Mood Discovery:** `![MoodBrew Home Screenshot](docs/screenshots/home-hero.png)`
- **MoodMatch Recommendation View (`/discover`):** `![MoodMatch Screenshot](docs/screenshots/discover-moodmatch.png)`
- **Menu Catalogue & MoodBag Drawer (`/menu`):** `![Menu and MoodBag Screenshot](docs/screenshots/menu-moodbag.png)`
- **MoodBrew × 7-Eleven Concept Page (`/collaboration`):** `![Conceptual Collaboration Screenshot](docs/screenshots/collaboration-campaign.png)`
- **Contact & Newsletter Footer (`/contact`):** `![Contact Page Screenshot](docs/screenshots/contact-page.png)`

---

## Technical Documentation

### React + Vite Architecture
- `src/main.jsx` mounts the React 18 root inside `<StrictMode>` wrapped by `<BrowserRouter>`, importing `tokens.css` and `global.css` before `<App />`.
- `src/App.jsx` wraps the application in Framer Motion's `<MotionConfig reducedMotion="user">` and `<CartProvider>`, renders global shell elements (`ScrollToTop`, `Navbar`, `CartDrawer`, `FooterSection`), and maps page routes.
- All beverage photography in `src/assets/` is imported as ES modules inside `src/data/drinks.js` so Vite bundles and hashes images reliably for production.

### React Router Navigation
`App.jsx` configures routes using `react-router-dom` v6:
- `/` → `HomePage`
- `/discover` → `DiscoverPage` (reads and syncs `?mood=<moodId>` query parameters via `useSearchParams`)
- `/menu` → `MenuPage`
- `/about` → `AboutPage`
- `/collaboration` (and `/campaign` alias) → `CampaignPage`
- `/contact` → `ContactPage`
- `*` → redirects cleanly to `/` via `<Navigate to="/" replace />`

A `ScrollToTop` helper listens to `useLocation().pathname` and resets window scroll on route changes.

### Component Structure
- **Global Shell:** `Navbar.jsx` (sticky responsive header with active `NavLink` indicators, cart badge, and collapsible mobile drawer) and `FooterSection.jsx` (newsletter signup + 4-column footer).
- **Home Sections:** Modular bands composed inside `HomePage.jsx` (`HeroSection`, `MoodDiscoverySection`, `FeaturedDrinksSection`, `MoodMatchSection`, `CollabSection`, `BrandStorySection`).
- **Shared Cards & Overlays:** `DrinkCard.jsx` (reused across Home Featured, Menu, and About collection) and `CartDrawer.jsx` (accessible `role="dialog"` portal with keyboard Escape support, focus restoration, and body scroll locking).

### Mood Recommendation Logic
Mood selection is handled deterministically in JavaScript (`src/data/drinks.js`):
- `MOODS` defines each mood (`happy`, `calm`, `energetic`, `romantic`, `focus`) alongside palette tokens, tasting notes, and `recommendedDrinkId`.
- `matchDrinkForMood(moodId)` looks up the matching entry in `MOODS` and resolves its canonical drink object from `ALL_DRINKS`.
- No AI model, probabilistic inference, or external recommendation API is involved.

### Cart State Management & `localStorage` Persistence
- **`CartContext.jsx`:** Exposes `items`, `isOpen`, `setIsOpen`, `addItem`, `updateQuantity`, `removeItem`, `clearCart`, memoized `count`, and `subtotal`.
- **Cart Persistence (`moodbrew_moodbag_v1`):** On initialization, `loadPersistedCart()` reads `window.localStorage.getItem('moodbrew_moodbag_v1')`, parses JSON safely inside `try/catch`, validates positive integer quantities, and reconciles product IDs against canonical `ALL_DRINKS` entries (preventing stale/tampered prices). Updates sync back to `localStorage` via `useEffect`.
- **Newsletter Persistence (`moodbrew_newsletter_emails_v1`):** `FooterSection.jsx` stores normalized lowercase emails locally in `localStorage` and rejects duplicate submissions case-insensitively.

### Simulated Checkout & Form Limitations
This repository is a **frontend-only portfolio prototype** with no backend server or database:
- **MoodBag Checkout:** Clicking **Checkout (Demo)** displays a simulated confirmation state and clears the local cart; no real order is placed and no payment is processed or charged.
- **Contact Form (`/contact`):** Validates required fields and email format (`/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`), simulates a `650ms` submission delay, and renders a local browser confirmation without transmitting messages to any server.
- **Newsletter Form (`FooterSection.jsx`):** Validates input and saves emails only in the user's browser `localStorage`; no real emails are collected or dispatched.
- **7-Eleven Campaign:** Explicitly presented as an independent student design concept with no official brand partnership.

---

## Future Enhancements

- Connect a headless backend or serverless API for real order submissions, newsletter opt-in confirmation emails, and contact form delivery.
- Expand **MoodMatch** into a multi-step flavour/time-of-day/caffeine preference filter with seasonal beverage drops.
- Add automated unit and end-to-end tests (Vitest + React Testing Library + Playwright) for cart math, routing, and form validation.
- Support custom bundle builder packs (e.g., 4-pack mood boxes) inside MoodBag.

---

## Author

**Madhura Zambare**
- Concept, UI/UX Direction & Frontend Development — *MoodBrew (Portfolio Showcase)*
- GitHub: `https://github.com/<your-username>`
