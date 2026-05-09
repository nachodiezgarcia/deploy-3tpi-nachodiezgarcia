// En dev: PUBLIC_API_BASE_URL está vacío → las llamadas van a /api/* → Vite proxy → localhost:4000
// En prod: PUBLIC_API_BASE_URL = https://tu-api.onrender.com → llamadas absolutas al backend
export const BASE_URL = (import.meta.env.PUBLIC_API_BASE_URL as string) ?? '';
