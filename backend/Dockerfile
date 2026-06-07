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

# Make the wait script executable
RUN chmod +x wait-and-start.sh

# Expose the port the backend runs on
EXPOSE 5000

# Wait for SQL Server, push schema, seed DB, then start
CMD ["sh", "wait-and-start.sh"]
