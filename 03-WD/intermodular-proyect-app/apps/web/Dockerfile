# =============================================================================
# Dockerfile multi-stage para intermodular — apps/web (TanStack Start SSR)
# =============================================================================
#
# Stage 1 (builder): instala dependencias y compila la app dentro de Docker.
# Stage 2 (runtime): imagen mínima que solo contiene el servidor compilado.
#
# El contexto de build es la raíz del monorepo (03-WD/intermodular-proyect-app)
# para que npm workspaces y turbo funcionen correctamente.
# =============================================================================

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /monorepo

# node:22-alpine trae npm 10; activamos npm 11 via corepack (incluido en Node 22).
RUN corepack enable && corepack prepare npm@11 --activate

# Copiamos los manifests primero para aprovechar la cache de capas de Docker.
# Si solo cambia el código fuente, las capas de install no se reconstruyen.
COPY package.json package-lock.json turbo.json ./
COPY packages/ ./packages/
COPY apps/web/package.json ./apps/web/

# Instalamos todas las dependencias del workspace.
RUN npm ci

# Copiamos el código fuente de la web.
COPY apps/web/ ./apps/web/

# Compilamos. Turbo ejecuta primero generate-routes y luego vite build,
# generando apps/web/.output/ con el servidor Node y los assets estáticos.
RUN npx turbo build --filter=@intermodular/web

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

# Reproducimos la estructura del workspace para que Node.js resuelva módulos
# correctamente (hoisting de node_modules + "type":"module" del package.json).
COPY --from=builder /monorepo/package.json ./package.json
COPY --from=builder /monorepo/apps/web/package.json ./apps/web/package.json

# El bundle SSR externaliza react y otras deps — necesitamos node_modules en runtime.
COPY --from=builder /monorepo/node_modules ./node_modules

# Copiamos dist/ completo: dist/server/server.js (SSR) + dist/client/ (assets).
COPY --from=builder /monorepo/apps/web/dist ./apps/web/dist

# El servidor se ejecuta desde el directorio de la app para que las rutas
# relativas (dist/client/) y la resolución de módulos funcionen igual que en build.
WORKDIR /app/apps/web

# TanStack Start respeta la variable de entorno PORT (por defecto 3000).
EXPOSE 3000

CMD ["sh", "-c", "node dist/server/server.js 2>&1; echo EXIT_CODE:$?"]
