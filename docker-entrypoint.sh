#!/bin/sh
set -e

echo "🚀 [Sirad ERP] Initializing container..."

# Extract DB host and port from DATABASE_URL if present, otherwise default to db:5432
DB_HOST="db"
DB_PORT="5432"

if [ -n "$DATABASE_URL" ]; then
  # Parse host and port reliably using node
  PARSED=$(node -e 'try { const u = new URL(process.env.DATABASE_URL); console.log((u.hostname || "db") + " " + (u.port || "5432")); } catch(e) { console.log("db 5432"); }')
  DB_HOST=$(echo "$PARSED" | cut -d' ' -f1)
  DB_PORT=$(echo "$PARSED" | cut -d' ' -f2)
fi

echo "⏳ [Sirad ERP] Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."
MAX_RETRIES=40
COUNT=0
until nc -z "$DB_HOST" "$DB_PORT" || [ "$COUNT" -ge "$MAX_RETRIES" ]; do
  COUNT=$((COUNT + 1))
  echo "   Attempt $COUNT/$MAX_RETRIES: Postgres not ready yet, sleeping 2s..."
  sleep 2
done

if [ "$COUNT" -ge "$MAX_RETRIES" ]; then
  echo "❌ [Sirad ERP] Could not connect to Postgres at ${DB_HOST}:${DB_PORT} after $MAX_RETRIES attempts."
  exit 1
fi

echo "✅ [Sirad ERP] PostgreSQL is reachable!"

echo "📦 [Sirad ERP] Synchronizing Prisma database schema..."
npx prisma db push --skip-generate --accept-data-loss

echo "🌱 [Sirad ERP] Seeding master accounts (Zeyad & Yehia)..."
npx tsx prisma/seed.ts || true

echo "✨ [Sirad ERP] Setup complete! Starting Next.js production server on port ${PORT:-3000}..."
exec "$@"
