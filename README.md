# Despliegue — Plataforma web de cursos en vídeo corto

Este repositorio contiene la configuración de despliegue del Proyecto Integrado: Dockerfiles multi-stage, pipeline CI/CD con GitHub Actions y configuración para Render.

El código fuente del proyecto está en el repositorio principal: **[politecnicoDAW-2025/3tpi-nachodiezgarcia](https://github.com/politecnicoDAW-2025/3tpi-nachodiezgarcia)**

---

## Aplicación desplegada

- **Backend (API):** https://deploy-3tpi-nachodiezgarcia.onrender.com
- **Frontend (Web):** https://deploy-3tpi-nachodiezgarcia-latest.onrender.com

> Antes del 09/05 => El servidor de Render en el plan gratuito puede tardar hasta 50 segundos en responder en el primer acceso (cold start).
> Después del 09/05 => El servidor de Render en el plan de pago responde en menos de 1 segundo incluso en el primer acceso.

---

## Capturas de pantalla

| Login | Dashboard del estudiante |
|---|---|
| ![Login](docs/00-FD/01-USE-CASES/capturas/login.png) | ![Dashboard](docs/00-FD/01-USE-CASES/capturas/dashboard.png) |

| Lección con vídeo | Mentor IA |
|---|---|
| ![Lección](docs/00-FD/01-USE-CASES/capturas/lesson.png) | ![Mentor IA](docs/00-FD/01-USE-CASES/capturas/mentor-ia.png) |

| Panel de administración | Gestión de usuarios |
|---|---|
| ![Admin](docs/00-FD/01-USE-CASES/capturas/admin-panel.png) | ![Usuarios](docs/00-FD/01-USE-CASES/capturas/admin-users.png) |

---

## Contenido de este repositorio

```
apps/
  api/
    Dockerfile          — imagen multi-stage para la API (Hono + Node.js)
    Dockerfile.dockerignore
  web/
    Dockerfile          — imagen multi-stage para el frontend (TanStack Start + SSR)
.github/
  workflows/
    ci.yml              — lint, type-check y build en cada PR
    cd.yml              — build de imágenes Docker, push a GHCR y redeploy en Render
docs/                   — documentación completa del proyecto
```

### Pipeline CI/CD

**CI (`ci.yml`)** — se ejecuta en cada pull request:
1. Instala dependencias con pnpm
2. Ejecuta el linter (oxlint)
3. Comprueba el formato (prettier)
4. Verifica los tipos (tsc)
5. Compila la aplicación (turbo build)

**CD (`cd.yml`)** — se ejecuta al hacer push a `main`:
1. Construye las imágenes Docker multi-stage de API y Web
2. Publica las imágenes en GitHub Container Registry (GHCR)
3. Lanza el redeploy automático en Render vía webhook

### Por qué este repositorio es independiente

El despliegue se gestiona desde este repositorio separado porque la organización `politecnicoDAW-2025` no tiene habilitados los permisos de escritura de GitHub Actions para publicar paquetes (imágenes Docker) en GHCR. En el caso de alguien que no use Docker no le afecta. Ese permiso solo puede activarlo un administrador de la organización.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React, TanStack Start (SSR), TanStack Router, Tailwind CSS |
| Backend | Hono, Node.js, TypeScript |
| Base de datos | MongoDB Atlas |
| CMS de contenidos | Content Island (HCMS headless) |
| Autenticación | JWT + cookie httpOnly |
| IA | OpenRouter API |
| Contenedores | Docker multi-stage |
| CI/CD | GitHub Actions + GHCR |
| Hosting | Render |

---

## Enlaces de interés

- [Repositorio de despliegue en GitHub](nachodiezgarcia/deploy-3tpi-nachodiezgarcia)
- [Aplicación API desplegada con Render](https://deploy-3tpi-nachodiezgarcia.onrender.com)
- [Aplicación Web desplegada con Render](https://deploy-3tpi-nachodiezgarcia-latest.onrender.com)
- [Documentación completa en el directorio `/docs`](./docs/)
- [Apps md](./03-WD/intermodular-proyect-app/apps.md)
- [API docs](./03-WD/intermodular-proyect-app/apps/api/README.md)
- [Web docs](./03-WD/intermodular-proyect-app/apps/web/README.md)
- [PRD](./docs/00-FD/00-PRD/README.md)
- [Casos de uso](./docs/00-FD/01-USE-CASES/use-cases.md)
- [Sitemap](./docs/00-FD/02-SITEMAP/SITEMAP.png)
- [HCMS Model](./docs/00-FD/03-HCMS-MODEL/02-HCMS-MODEL.png)
- [DB Model](./docs/00-FD/04-DB-MODEL/04-DB-MODEL.png)
- [UI Mock Low Fidelity](./docs/00-FD/05-UI-MOCK-LOW-FIDELITY/UI-MOCK-LOW-FIDELITY.qm)
- [UI High Fidelity](./docs/00-FD/06-UI-HIGH-FIDELITY/UI-HIGH-FIDELITY.pen)
- [Architecture](./docs/00-FD/07-ARCHITECTURE/00-ARCHITECTURE.md)
- [Technical Design Blueprint](./docs/01-TD/00-BLUEPRINT/BLUEPRINT.md)
- [Diagrama UML Backend](./docs/uml/backend-uml.puml)
- [Diagrama UML Frontend](./docs/uml/frontend-uml.puml)
