# Use official Node.js image for building
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the project
RUN npm run build

# Install 'serve' to serve the static site
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Command to serve the build directory
CMD ["serve", "-s", "build", "-p", "3000"]
