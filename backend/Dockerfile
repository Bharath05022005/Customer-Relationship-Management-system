FROM node:20-alpine

WORKDIR /app

# Prisma needs openssl for its query engine
RUN apk add --no-cache openssl

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port the backend runs on
EXPOSE 5000

# Start: sync DB schema then start the Node.js server
CMD ["sh", "-c", "npx prisma db push && npm start"]
