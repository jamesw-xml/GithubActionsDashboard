# Step 1: Install dependencies and build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy app source
COPY . .

# Build the Next.js app
RUN npm run build

# Remove devDependencies to slim final image
RUN npm prune --production

# Step 2: Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only what's needed from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
