# E-Commerce Website

This repository now contains both the React frontend and the MongoDB-backed Express server.

## Structure

- `src/`: React + Redux frontend
- `server/`: Express + MongoDB backend copied from the other folder

## Integrated API

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /products`

The frontend now uses the backend for authentication and product loading. Cart and orders remain client-side Redux state.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`.

3. Start MongoDB locally, or update `MONGODB_URI` to your MongoDB connection string.

4. Run everything together:

```bash
npm run dev:full
```

Or run each part separately:

```bash
npm run server:dev
npm run dev
```

## Environment

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
TOKEN_SECRET=change-me
PORT=3000
VITE_API_BASE_URL=http://localhost:3000
```
