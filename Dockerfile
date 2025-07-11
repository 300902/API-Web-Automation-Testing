# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for testing)
RUN npm ci

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy application code
COPY . .

# Create directories for test results
RUN mkdir -p test-results reports

# Set environment variables
ENV NODE_ENV=test

# Expose port (if running a web server)
EXPOSE 3000

# Default command
CMD ["npm", "run", "test:api"]
