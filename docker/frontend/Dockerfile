# Use official Node.js image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install 'serve' to serve the build folder
RUN npm install -g serve

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

# Expose the port (default for serve is 3000)
EXPOSE 3000

# Serve the build folder
CMD ["serve", "-s", "build"]

