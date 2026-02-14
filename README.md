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

## 🚀 Deployment to Vercel

This project is configured for a unified monorepo deployment on **Vercel**.

### 1. Connect to Vercel
- Push your code to a GitHub repository.
- Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" → "Project"**.
- Import your repository.

### 2. Configure Vercel Project
- **Framework Preset**: Select **Vite** (or leave as Other).
- **Root Directory**: Keep as `.` (root).
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`

### 3. Set Up Vercel Postgres
Instead of running PostgreSQL locally, use Vercel's managed database:
1. In your project dashboard, click the **"Storage"** tab.
2. Select **"Postgres"** and click **"Create"**.
3. Click **"Connect"** to link it to your project.
4. This will automatically add the `DATABASE_URL` (and other variables) to your environment.

### 4. Required Environment Variables
Go to **Settings → Environment Variables** and ensure these are set:
- `DATABASE_URL`: (Auto-added by Vercel Postgres)
- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Gemini API key.
- `NODE_ENV`: `production`

### 5. Initialize Production Database
To set up the schema in your cloud database:
1. Temporarily copy the production `DATABASE_URL` from Vercel to your local `.env`.
2. Run these commands from your computer:
   ```bash
   cd backend
   npx prisma db push
   npx prisma db seed
   ```

## 📄 License

MIT

## 👨‍💻 Author

Built as part of a Fullstack Engineering Assessment
