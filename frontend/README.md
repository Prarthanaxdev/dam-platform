# React + TypeScript + Vite

This project is a modern React app bootstrapped with Vite, TypeScript, Tailwind CSS, and strict ESLint rules.

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Development server

```sh
npm run dev
```

### 3. Build for production

```sh
npm run build
```

### 4. Linting

```sh
npm run lint
```

Linting is also enforced as a pre-commit hook.

### 5. Preview production build

```sh
npm run preview
```

## Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

- `VITE_API_BASE_URL`: The base URL for backend API requests.

## Scripts

- `dev`: Start the Vite development server
- `build`: Type-check and build for production
- `lint`: Run ESLint
- `preview`: Preview the production build
- `start`: Alias for preview with a custom port

## Project Structure

- `src/` — Main source code
- `src/pages/` — App pages (Dashboard, Assets, Upload, etc.)
- `src/components/` — Reusable UI components
- `src/api/` — API request logic
- `src/hooks/` — Custom React hooks
- `src/utils/` — Utility functions
- `src/config/` — App configuration
