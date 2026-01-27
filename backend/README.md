# DAM Platform Backend

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```sh
cp .env.example .env
```

### 3. Build the project

```sh
npm run build
```

### 4. Run in development mode

```sh
npm run dev
```

### 5. Run in production mode

```sh
npm start
```

### 6. Run tests

```sh
npm run test
```

### 7. Lint and format

```sh
npm run lint
npm run format
```

## API Endpoints

### Assets

- `GET /api/assets` — List all assets
- `GET /api/assets/analytics` — Asset usage analytics
- `GET /api/assets/analytics/by-type` — Asset type breakdown
- `GET /api/assets/downloads` — Total download count
- `POST /api/assets/download` — Download asset
- `DELETE /api/assets/bulk-delete` — Bulk delete assets

### Uploads

- `POST /api/uploads` — Upload one or more files

## Documentation

- Swagger UI: `GET /api-docs`

---

For more details, see the code and comments in each route/controller.
