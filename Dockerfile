# Use official Node.js LTS image with Debian Bullseye for more tools
FROM node:22-bullseye

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port (adjust if your app uses a different port)
EXPOSE 3000

# Start the application
CMD ["node", "dist/server/index.js"]
