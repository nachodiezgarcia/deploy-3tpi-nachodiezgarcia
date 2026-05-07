//import type { Media } from '@content-island/api-client'; // Normalmente, esta línea se usaría para importar el tipo Media desde el módulo '@content-island/api-client'. Sin embargo, dado que no se puede acceder a ese módulo en este contexto, definiremos el tipo Media directamente aquí.

export interface Media {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Courses {
  id: string;
  language: 'en';
  lastUpdate: string; // Stores the date in ISO 8601 format. For example: 2021-09-10T19:30:00.000Z
  name: string;
  image: Media;
  description: string;
  shortDescription: string;
  lessons: string[]; // Stores the ID of the related entity
}

export interface Lessons {
  id: string;
  language: 'en';
  lastUpdate: string; // Stores the date in ISO 8601 format. For example: 2021-09-10T19:30:00.000Z
  name: string;
  video: Media;
  description: string;
  time: string;
}