# Contributing to DAM Platform

## Getting Started

1. **Fork the repository** and clone it locally.
2. **Install dependencies**:
   - For backend: `cd backend && npm install`
   - For frontend: `cd frontend && npm install`
3. **Set up environment variables**:
   - Copy `.env.example` to `.env` in both backend and frontend, and fill in the required values.
4. **Run the app locally**:
   - With Docker: `docker-compose up --build`
   - Or, run backend: `cd backend && npm run dev`
   - Or, run frontend: `cd frontend && npm run dev`

## How to Contribute
- **Pull Requests**:
  1. Create a new branch from `dev`.
  2. Make your changes, following the code style and including tests if possible.
  3. Run `npm run lint` and `npm test` to ensure code quality.
  4. Submit a pull request to the `dev` branch with a clear description.

## Coding Guidelines

- Use Prettier and ESLint for code formatting and linting.
- Write clear, descriptive commit messages (e.g., `doc: add asset pagination`).
