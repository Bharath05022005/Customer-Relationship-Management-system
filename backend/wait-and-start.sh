#!/bin/sh
# SQL Server is already healthy (guaranteed by Docker healthcheck + depends_on)
echo "SQL Server is ready. Running Prisma db push..."
npx prisma db push

echo "Seeding database..."
node prisma/seed.js

echo "Starting server..."
npm start
