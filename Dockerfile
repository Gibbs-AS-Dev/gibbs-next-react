# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /gibbs-react

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

EXPOSE 4000

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /gibbs-react

# Copy built application from the builder stage
COPY --from=builder /gibbs-react ./

# Install only production dependencies
RUN npm install --omit=dev

# Expose the necessary port
EXPOSE 4000

# Start the Next.js application
CMD ["npm", "run", "dev"]
