# ---- Stage 1: build frontend ----
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY hms-frontend/package.json hms-frontend/package-lock.json ./
RUN npm ci
COPY hms-frontend/ ./
RUN npm run build

# ---- Stage 2: build backend ----
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY hms-backend/package.json hms-backend/package-lock.json ./
# Dev deps needed for tsc build
RUN npm ci
COPY hms-backend/ ./
RUN npm run build && npm prune --omit=dev

# ---- Stage 3: runtime ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/package.json ./package.json
# Express serves this as static frontend (server.ts resolves ./dist/public)
COPY --from=frontend-build /app/frontend/dist ./dist/public

EXPOSE 8080
# Render sets PORT; default here for local testing
ENV PORT=8080
CMD ["node", "dist/server.js"]
