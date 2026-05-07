# PROYECTO-INTEGRADO

## 📁 docs (Documentación del proyecto)

### 📁 00-FD (Functional Design)
* **00-PRD** — Product Requirements Document
* **01-USE-CASES** — Casos de uso (Admin y Student)
  * `use-cases.md` — Descripción detallada de todos los casos de uso con capturas de pantalla
  * `use-cases-admin.puml` — Diagrama PlantUML de casos de uso del rol Admin
  * `use-cases-student.puml` — Diagrama PlantUML de casos de uso del rol Student
  * `capturas/` — Screenshots de la aplicación (a rellenar)
* **02-SITEMAP** — Mapa visual de la aplicación web
* **03-HCMS-MODEL** — Modelo del CMS (Content Island), en TypeScript y diagrama
* **04-DB-MODEL** — Modelo de base de datos (Mongo Modeler)
* **05-UI-HIGH-FIDELITY** — Diseño de alta fidelidad (Pen)
* **06-ARCHITECTURE** — Diagrama de arquitectura y descripción resumida de frontend, backend, base de datos y HCMS
* **07-UI-MOCK-LOW-FIDELITY** — QuickMock y fotos del diseño de baja fidelidad

### 📁 01-TD (Technical Design)
* **00-BLUEPRINT.md** — Decisiones técnicas, arquitectura, testing, devops y proveedores cloud

### 📁 02-ORGANIZATION
* **00-FILES/FILE-ORGANITATION.md** — Cómo se organizan los archivos en el repositorio (este archivo)

### 📁 uml (Diagramas UML)
* `backend-uml.puml` — Diagrama de clases del backend: modelos MongoDB, servicios core, middleware y rutas
* `frontend-uml.puml` — Diagrama de clases del frontend: rutas, pods, stores y componentes comunes
* `use-cases-admin.puml` — Copia del diagrama de casos de uso del Admin
* `use-cases-student.puml` — Copia del diagrama de casos de uso del Student
* `README.md` — Instrucciones para renderizar los diagramas y enlace al repositorio de despliegue

---

## 📁 03-WD (Work Directory)
Código fuente de la aplicación.

* **apps/api** — Backend (Hono + MongoDB + TypeScript)
* **apps/web** — Frontend (TanStack Start + React + Tailwind CSS)
