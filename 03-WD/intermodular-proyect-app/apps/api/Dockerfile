# ─── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# Manifests del monorepo y packages compartidos
COPY package.json package-lock.json ./
COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/

# Instala todas las deps (incluidas dev para compilar TS)
RUN npm ci --workspace=@intermodular/api --include-workspace-root

# Código fuente de la API
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig.json ./apps/api/

# Compila TypeScript → dist/ (tsc + tsc-alias resuelve los path aliases #*)
RUN npm run build --workspace=@intermodular/api

# ─── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

# Solo dependencias de producción
RUN npm ci --workspace=@intermodular/api --omit=dev --include-workspace-root

COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
