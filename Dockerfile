# Use official Node.js LTS image as the base
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run certs
RUN npm run build

# Expose the port (adjust if your app uses a different port)
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
