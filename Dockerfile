# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /gibbs-react

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create a lightweight production image
FROM node:20-alpine

WORKDIR /gibbs-react

# Copy only the necessary files from the builder stage
COPY --from=builder /gibbs-react/package.json /gibbs-react/package-lock.json ./
COPY --from=builder /gibbs-react/.next ./.next
COPY --from=builder /gibbs-react/public ./public
COPY --from=builder /gibbs-react/node_modules ./node_modules

# Expose the necessary port
EXPOSE 4000

# Start Next.js in production mode
CMD ["npm", "run", "start"]
