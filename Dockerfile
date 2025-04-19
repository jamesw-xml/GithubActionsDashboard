# Step 1: Build the app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (faster if package-lock is cached)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy app source
COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
RUN npm ci --omit=dev

# Copy built app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
