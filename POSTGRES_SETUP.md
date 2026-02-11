# PostgreSQL Setup Options

## Option 1: Docker (Recommended)

### Start Docker Desktop
1. Open Docker Desktop application
2. Wait for it to fully start (whale icon should be steady)
3. Run the following command:

```bash
docker-compose up -d
```

This will start PostgreSQL on `localhost:5432`.

---

## Option 2: Local PostgreSQL Installation (Alternative)

If you don't want to use Docker, you can install PostgreSQL directly:

### Windows
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Install with default settings (port 5432)
3. Set password as `password` (or update `.env` file)
4. Create database:
   ```bash
   psql -U postgres
   CREATE DATABASE multi_agent_db;
   \q
   ```

### Update .env file
Make sure your `backend/.env` has:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/multi_agent_db?schema=public"
```

---

## Option 3: Cloud PostgreSQL (For Production/Demo)

### Using Neon (Free Tier)
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string
4. Update `backend/.env`:
   ```
   DATABASE_URL="your-neon-connection-string"
   ```

### Using Supabase (Free Tier)
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Direct connection)
5. Update `backend/.env`:
   ```
   DATABASE_URL="your-supabase-connection-string"
   ```

---

## After PostgreSQL is Running

Run these commands to set up the database:

```bash
cd backend

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

Then start the application:
```bash
cd ..
npm run dev
```
