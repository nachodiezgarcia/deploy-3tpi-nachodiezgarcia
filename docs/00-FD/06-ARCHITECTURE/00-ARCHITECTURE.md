# Arquitectura

                ┌──────────────────────────────┐
                │           FRONTEND           │
                │      (React + MUI Stack)     │
                │                              │
                │   ┌─────────┐  ┌─────────┐   │
                │   │ Público │  │ Intranet│   │
                │   └─────────┘  └─────────┘   │
                └───────────────┬──────────────┘
                                │
                                ▼
                ┌──────────────────────────────┐
                │            BACKEND           │
                │         API REST (BFF)       │
                └───────────────┬──────────────┘
                                │
             ┌──────────────────┴──────────────────┐
             ▼                                     ▼

    ┌───────────────────┐               ┌───────────────────┐
    │        BDD        │               │        HCMS       │
    │                   │               │                   │
    │ Usuarios          │               │ Contenido         │
    │ Asignaciones      │               │ Estructurado      │
    │ Casos             │               │                   │
    └───────────────────┘               └───────────────────┘

      MongoDB                              Content Island


## Descripción

- **Frontend**
  - Aplicación basada en React + MUI.
  - Dos accesos:
    - Público
    - Intranet

- **Backend**
  - API REST tipo **BFF (Backend for Frontend)**.
  - Orquesta la comunicación con los servicios de datos.

- **BDD (MongoDB)**
  - Usuarios
  - Asignaciones
  - Casos

- **HCMS**
  - Gestión de contenido estructurado.
  - Sistema independiente de contenidos.