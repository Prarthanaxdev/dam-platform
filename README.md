# DAM Platform Setup Guide

## Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Docker & Docker Compose (for running DB and MinIO)

## 1. Clone the Repository
```sh
git clone <your-repo-url>
cd DAM-platform
```

## 2. Start Required Services (DB, MinIO, etc.)

You can use Docker Compose to start MongoDB and MinIO:
```sh
docker-compose up -d
```

- MongoDB will be available at `mongodb://localhost:27017`
- MinIO will be available at `http://localhost:9000` (default credentials: minioadmin/minioadmin)

## 3. Backend Setup
```sh
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```
MONGODB_URI=mongodb://localhost:27017/dam
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=dam-assets
REDIS_URL=redis://localhost:6379
PORT=5000
```

Start the backend server:
```sh
npm run dev
```

## 4. Frontend Setup
```sh
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend dev server:
```sh
npm run dev
```

## 5. Access the App
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000/api
- MinIO UI: http://localhost:9000

---

# System Architecture

```mermaid
flowchart LR
    A[Frontend (React/Vite)] -- API Calls --> B[Backend (Node.js/Express)]
    B -- REST API --> A
    B -- DB Queries --> C[(Database)]
    C -- Data --> B
```


