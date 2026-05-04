# SEGURIDAD

La gestión de sesión la vamos a controlar usando un token JWT, con uno de refresco.

No tendremos sesión en Backend.

# FRONTAL

Hemos elegido **TanStack Start**, porque es un framework sobre React, versátil, da soluciones a problemas comunes, como por ejemplo la gestión de formularios, y también permite cambiar fácilmente de modo SPA a SSR, o SSG. Esto hace que a futuro no nos limite, por ejemplo podríamos tener cursos públicos a futuro y cambiar esa página a SSR.

Por otro lado para organizar el proyecto, vamos a usar **PODS** (especialización de Vertical Slicing).

# BACKEND

Hemos elegido **NodeJS + Hono**, ya que así es más fácil mantener Back y Front con un mismo lenguaje (TypeScript), así como compartir código, y configurar un monorepo.

Hono es una alternativa más moderna, rápida y ligera a Express.

---

# DATOS

Hemos dividido los datos según su naturaleza:
- **Contenido / Assets estáticos** (Cursos, lecciones, vídeos, guías...)
- **Contenido de operación / dinámico** (Usuarios, asignaciones, progreso)

## Contenido

Hemos decidido no guardar el contenido en nuestro servidor, razones:
- Tener que gestionar backups, o si tenemos a futuro varios server, tener que replicarlos.
- **Acceso rápido:** Tenerlo en mi servidor puede ser un cuello de botella, mejor servirlo desde una CDN, como Netflix.
- Coste de implementación de una intranet para subir este material y organizarlo.

La solución va a ser utilizar un **Headless CMS** que me permita:
- Modelar la información.
- Proveerme de una interfaz amistosa para subir curso y lecciones.
- Publicación automática de assets en CDN.

---

# DATOS - OPERACIONES

Para lo que son datos de operaciones:
- Usuarios
- Asignaciones de cursos
- Progreso
- Permisos

Necesitamos usar una BBDD para poder almacenar esta información:
- Los datos van a cambiar a menudo.
- Ciertos datos necesitan de Hash o encriptación.

Como motor de base de datos, hemos elegido **MongoDB** (Aproximación documental), razones:
- **Simplicidad:** Permite objetos, colecciones anidadas, lo que simplifica mucho el modelo.
- **Rendimiento:** El modelado se adapta a las necesidades de la solución.
- **Hosting:** Mongo Atlas, parte de una versión gratuita que para un arranque viene muy bien.

---

# TESTING

Para testing hemos elegido **Vitest** para pruebas unitarias.

---

# ESTRUCTURA SOLUCIÓN

Para estructurar la solución hemos elegido tenerlo todo en un sólo repositorio, y usar la aproximación de **Monorepo**.

Hemos elegido en concreto **Turbo Repo**:
- Extensión de packages del estándar JS.
- Permite definir dependencias entre paquetes.
- Tiene un sistema de caché.
- Es muy conocido y usado.

# DEVOPS

Para implementar los flujos de CI/CD hemos elegido **GitHub Actions**.

# PROVEEDORES CLOUD

- **Pendiente decidir** si desplegar en Vercel, Azure, o Render.
- Para **BBDD** -> Mongo Atlas.
- Para **HCMS** -> Contentful (scann).