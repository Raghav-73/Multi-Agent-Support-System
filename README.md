# Multi-Agent Support System

A robust multi-agent customer support system built with React, Hono, and Google Gemini AI.

## 🚀 Deployment Guide (Split Stack)

This application is designed to be deployed with the **Backend on Vercel** and the **Frontend on Netlify**.

### 1. Database Setup (Neon.tech)
1.  Sign up at [Neon.tech](https://neon.tech).
2.  Create a new project and copy your **Connection String**.
3.  Ensure your connection string includes `?sslmode=require`.

### 2. Backend Deployment (Vercel)
1.  Push your code to GitHub.
2.  Import the project into Vercel, but select **ONLY the `backend` folder** as the root.
3.  Set the following **Environment Variables**:
    *   `DATABASE_URL`: Your Neon connection string.
    *   `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google AI API key.
4.  Vercel will automatically detect the Hono app and deploy it as serverless functions.
5.  **Note your Backend URL** (e.g., `https://your-backend.vercel.app`).

### 3. Database Migration
Once the backend is configured on Vercel (or locally with the Neon URL), run:
```bash
cd backend
npx prisma db push
npx prisma db seed
```

### 4. Frontend Deployment (Netlify)
1.  Import the project into Netlify, selecting the **root folder**.
2.  Set the **Base Directory** to `frontend`.
3.  Set the **Build Command** to `npm run build`.
4.  Set the **Publish Directory** to `dist`.
5.  Set the following **Environment Variable**:
    *   `VITE_API_BASE_URL`: Your Vercel backend URL.
6.  Deploy!

---

## 🏗 Architecture
- **Specialized Agents**: 
  - `SupportAgent`: Handles general queries.
  - `OrderAgent`: Manages order details and delivery.
  - `BillingAgent`: Handles invoices and refunds.
- **Workflow**:
  - `ProcessMessage` extracts Intent.
  - `Intent` selects the appropriate Agent.
  - `Agent` uses Tools to fetch data from DB.
  - `Response` is streamed to the user.

## 🛠 Features
- **Multi-Agent Orchestration**: Intent classification routes queries to specialized agents.
- **Prisma + PostgreSQL**: Robust data management.
- **Vite + React**: Fast, responsive frontend.
- **Hono**: High-performance backend API.
- **Google Gemini**: State-of-the-art AI for intent and response generation.
