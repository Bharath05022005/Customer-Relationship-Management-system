FROM node:20-alpine

WORKDIR /app

# Prisma needs openssl for its query engine
RUN apk add --no-cache openssl

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Build the project (generates Prisma client and compiles TypeScript)
RUN npm run build

# Expose the port the backend runs on
EXPOSE 5000

# Start the application and sync database schema
CMD npx prisma db push && npm start
