import type { StudentCourse, CourseDetail } from '#pods/courses';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';

function buildSystemPrompt(courses: CourseDetail[]): string {
  if (courses.length === 0) {
    return `Eres el Mentor IA del campus de formacion Proyecto Integrado DAW.
Ayuda a los alumnos con dudas sobre desarrollo web, explica conceptos tecnicos y orientales sobre que aprender.
Responde siempre de forma clara, pedagogica y en el mismo idioma que el usuario.`;
  }

  const catalog = courses
    .map((course) => {
      const lessons = course.lessons.map((lesson) => `  - ${lesson.name}`).join('\n');
      return `Curso: ${course.name}\nDescripcion: ${course.shortDescription || course.description}\nLecciones:\n${lessons}`;
    })
    .join('\n\n');

  return `Eres el Mentor IA del campus de formacion Proyecto Integrado DAW. Conoces en detalle el catalogo disponible y puedes orientar a los alumnos sobre que estudiar, resolver dudas de contenido y recomendar cursos y lecciones.

Catalogo disponible:
${catalog}

Responde siempre de forma clara, pedagogica y en el mismo idioma que el usuario.`;
}

export async function sendMentorMessage(
  courses: CourseDetail[],
  messages: ChatMessage[],
  onChunk: (text: string) => void,
): Promise<void> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('VITE_OPENROUTER_API_KEY no esta configurada');

  const response = await fetch(OPENROUTER_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Proyecto Integrado DAW',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b:free',
      stream: true,
      messages: [{ role: 'system', content: buildSystemPrompt(courses) }, ...messages],
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error('Error al conectar con el Mentor IA');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data: ')) continue;

      const data = line.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        const text = parsed.choices?.[0]?.delta?.content;
        if (text) onChunk(text);
      } catch {
        // fragmento SSE incompleto
      }
    }
  }
}

export type { StudentCourse };
