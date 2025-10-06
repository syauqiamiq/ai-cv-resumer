# Stage 1: Build Stage
FROM --platform=linux/x86_64 node:lts-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the application source code
COPY . .

# Build the NestJS application
RUN yarn build ai-cv-resumer

# Stage 2: Production Stage
FROM --platform=linux/x86_64 node:lts-slim AS runner

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json yarn.lock ./

# Expose the application port
EXPOSE 9898

# Command to run the application
CMD ["node", "dist/apps/ai-cv-resumer/main"]
