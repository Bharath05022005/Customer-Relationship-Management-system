#!/bin/sh
# For cloud deployment: Azure SQL is always ready, no waiting needed.
# For local Docker: retries handle SQL Server startup time.

MAX_RETRIES=20
RETRY=0

echo "Waiting for database to be ready..."
until node -e "
const net = require('net');
let host = 'postgres';
let port = 5432;
if (process.env.DATABASE_URL) {
  try {
    const parsed = new URL(process.env.DATABASE_URL);
    host = parsed.hostname || host;
    port = parsed.port ? parseInt(parsed.port, 10) : port;
  } catch (e) {}
}
const client = new net.Socket();
client.setTimeout(3000);
client.connect(port, host, () => { client.destroy(); process.exit(0); });
client.on('error', () => { client.destroy(); process.exit(1); });
client.on('timeout', () => { client.destroy(); process.exit(1); });
" 2>/dev/null || [ $RETRY -eq $MAX_RETRIES ]; do
  RETRY=$((RETRY + 1))
  echo "Attempt $RETRY/$MAX_RETRIES — database not ready, retrying in 3s..."
  sleep 3
done

echo "Database is reachable. Running Prisma db push..."
npx prisma db push

echo "Seeding database (admin user only)..."
node prisma/seed.js

echo "Starting Node.js server..."
npm start
