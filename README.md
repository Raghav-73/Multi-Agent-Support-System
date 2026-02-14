# Multi-Agent Support System

An AI-powered customer support system with a multi-agent architecture built with React, Hono, Prisma, and the Vercel AI SDK.

## 🏗️ Architecture

### Multi-Agent System
- **Router Agent**: Analyzes incoming queries and delegates to specialized sub-agents
- **Support Agent**: Handles general inquiries, FAQs, and troubleshooting
- **Order Agent**: Manages order status, tracking, and modifications
- **Billing Agent**: Handles payments, invoices, and refunds

### Tech Stack
- **Frontend**: React + Vite + Vercel AI SDK
- **Backend**: Hono.dev (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI**: Vercel AI SDK with Google Gemini 2.5 Flash

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose installed
- Google AI API Key ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Multi-Agent-Support-System
```

### 2. Start PostgreSQL Database
```bash
docker-compose up -d
```

This will start a PostgreSQL instance on `localhost:5432`.

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create a .env file with:
# PORT=3000
# DATABASE_URL="postgresql://postgres:password@localhost:5432/multi_agent_db?schema=public"
# GOOGLE_GENERATIVE_AI_API_KEY="your-api-key-here"

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 4. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install
```

### 5. Run the Application
From the root directory:
```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:3000`
- Frontend on `http://localhost:5173`

## 📡 API Endpoints

### Chat
- `POST /api/chat` - Send a new message
- `GET /api/chat/conversations` - List all conversations
- `GET /api/chat/conversations/:id` - Get conversation history
- `DELETE /api/chat/conversations/:id` - Delete a conversation

### Agents
- `GET /api/agents` - List available agents
- `GET /api/agents/:type/capabilities` - Get agent capabilities

### Health
- `GET /health` - Health check endpoint

## 🛠️ Agent Tools

### Support Agent
- `getConversationHistory`: Query conversation history

### Order Agent
- `getOrderDetails`: Fetch order details by ID
- `getDeliveryStatus`: Check delivery status and tracking

### Billing Agent
- `getInvoiceDetails`: Get invoice details for an order
- `getRefundStatus`: Check refund status for payments

## 📊 Database Schema

The system uses PostgreSQL with the following models:
- **Conversation**: Stores chat conversations
- **Message**: Individual messages with agent type tracking
- **Order**: Sample order data for testing
- **Invoice**: Invoice records linked to orders
- **Payment**: Payment and refund records

## 🎯 Features

- ✅ Multi-agent routing with intent classification
- ✅ Streaming AI responses
- ✅ Conversation persistence
- ✅ Tool calling for data retrieval
- ✅ Context-aware responses
- ✅ Controller-Service pattern
- ✅ Error handling middleware
- ✅ Clean separation of concerns

## 🧪 Testing Sample Queries

Try these queries to test different agents:

**Support Agent:**
- "How do I reset my password?"
- "What are your business hours?"

**Order Agent:**
- "What's the status of order ORD-101?"
- "Track my order ORD-102"

**Billing Agent:**
- "Show me the invoice for order ORD-101"
- "Check refund status for invoice INV-201"

## 📝 Project Structure

```
Multi-Agent-Support-System/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── tools/
│   │   ├── middleware/
│   │   └── lib/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── index.css
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔧 Development

### Database Commands
```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes
npm run db:push

# Seed database
npm run db:seed

# Full setup
npm run db:setup
```

### Stop PostgreSQL
```bash
docker-compose down
```

## 🚀 Deployment

This project is configured for a split deployment: **Backend on Vercel** and **Frontend on Netlify**.

### 1. Backend Deployment (Vercel)
- **Import**: Go to Vercel and import your repository.
- **Root Directory**: Select the `backend` folder as the Root Directory.
- **Environment Variables**:
  - `GOOGLE_GENERATIVE_AI_API_KEY`: Your Gemini API key.
  - `DATABASE_URL`: (Will be added by Vercel Postgres).
- **Storage**: Go to the **Storage** tab, create a **Vercel Postgres** database, and connect it to this project.
- **Build & Development Settings**: Vercel should automatically detect the settings from `package.json` and `vercel.json` inside the `backend` folder.

### 2. Database Initialization
Once the backend is deployed:
1. Copy the production `DATABASE_URL` from the Vercel dashboard.
2. Locally, in your `backend/.env`, temporarily paste that URL.
3. Run:
   ```bash
   cd backend
   npx prisma db push
   npx prisma db seed
   ```

### 3. Frontend Deployment (Netlify)
- **Import**: Go to Netlify and import your repository.
- **Base Directory**: `frontend`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Your Vercel backend URL (e.g., `https://your-backend.vercel.app`). **Important**: Do not add a trailing slash.

### 4. CORS
The backend is already configured to allow CORS, so the frontend on Netlify will be able to communicate with the backend on Vercel.

## 📄 License

MIT

## 👨‍💻 Author

Built as part of a Fullstack Engineering Assessment
