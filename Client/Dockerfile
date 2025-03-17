# Stage 1: Build the Vite app
FROM node:20 as build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Vite app
RUN npm run build

# Stage 2: Serve the app using Node.js
FROM node:20

# Set working directory
WORKDIR /app

# Install a simple HTTP server
RUN npm install -g serve

# Copy built files from the build stage
COPY --from=build /app/dist .

# Expose port
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", ".", "-l", "3000"]
