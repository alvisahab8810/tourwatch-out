# Stage 1: Building the code
FROM --platform=linux/amd64 node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

RUN npm install -D @swc/cli @swc/core

# Install dependencies
RUN npm install --verbose

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["npm", "start"]

