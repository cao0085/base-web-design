# Base Web Design

A personal practice project for building a modular React 18 SPA boilerplate. The goal is to create a reusable foundation with a clean layered architecture, so I can skip repetitive setup and jump straight into development on future projects.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Fast build tool with HMR
- **React Router DOM v6** - Client-side routing
- **Redux Toolkit** - State management
- **i18next** - Internationalization (EN/ZH)
- **Axios** - HTTP client
- **CSS Modules** - Scoped styling

## Project Structure

```
src/
├── api/              # API layer (Axios config)
├── assets/           # Static assets & SVG icons
├── components/       # Shared components (MainLayout, NavPanel)
├── constants/        # Environment variables
├── css/              # Global styles & theme
├── i18n/             # i18next configuration
├── store/            # Redux store & slices
│   └── slices/       # Redux slices (language, player, user, views)
├── views/            # Page components
│   ├── BrandPage/
│   ├── ExampleDesign-page/
│   ├── category_1/
│   └── category_2/
├── routes.tsx        # Route configuration
├── App.tsx           # App entry
└── main.tsx          # React entry point
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Features

- Nested routing with MainLayout wrapper
- Dark/Light theme support
- Multi-language support (English/Chinese)
- CSS Modules for component-scoped styles
- Design token system for consistent styling
- SVG icon components
