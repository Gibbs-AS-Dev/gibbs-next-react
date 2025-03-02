# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /gibbs-react

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

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
COPY --from=builder /gibbs-react/package.json /gibbs-react/package-lock.json ./
COPY --from=builder /gibbs-react/.next ./.next
COPY --from=builder /gibbs-react/public ./public

# Expose the necessary port
EXPOSE 4000

# Start the Next.js application in production mode
CMD ["npm", "run", "start"]
