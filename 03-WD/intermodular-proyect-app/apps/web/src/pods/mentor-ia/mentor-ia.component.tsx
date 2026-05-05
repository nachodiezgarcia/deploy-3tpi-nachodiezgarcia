import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Bot, Send } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { useQuery } from '@tanstack/react-query';
import { Markdown } from '#common/markdown';
import { $auth } from '#pods/auth';
import { getStudentCourses, getCourseDetail } from '#pods/courses';
import { sendMentorMessage, type ChatMessage } from './mentor-ia.api';

export function MentorIaChat() {
  const auth = useStore($auth);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: studentCourses = [] } = useQuery({
    queryKey: ['student-courses'],
    queryFn: () => getStudentCourses(auth!.accessToken),
    enabled: !!auth,
  });

  const { data: courseDetails = [] } = useQuery({
    queryKey: [
      'all-course-details',
      studentCourses.map((course) => course.contentIslandId),
    ],
    queryFn: () =>
      Promise.all(
        studentCourses.map((course) =>
          getCourseDetail(course.contentIslandId, auth!.accessToken),
        ),
      ),
    enabled: !!auth && studentCourses.length > 0,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isThinking =
    loading &&
    messages[messages.length - 1]?.role === 'assistant' &&
    messages[messages.length - 1]?.content === '';

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages([...nextMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    try {
      await sendMentorMessage(courseDetails, nextMessages, (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant') {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + chunk,
            };
          }
          return updated;
        });
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content:
            'Lo siento, ha ocurrido un error al conectar con el mentor. Intentalo de nuevo.',
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 md:gap-5 md:px-15 md:py-8">
      <div
        className="hidden items-center gap-3.5 rounded-2xl border border-border px-6 py-[18px] md:flex"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-text)',
          }}
        >
          <Bot size={20} strokeWidth={2} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold text-tbase-500">
            Asistente IA
          </span>
          <span className="text-[13px] text-tsecondary-500">
            Pregunta sobre cursos, lecciones o recomendaciones y te respondere
            con base en el catalogo disponible.
          </span>
        </div>
      </div>

      <div className="px-4 pt-4 md:hidden">
        <div
          className="flex items-center gap-2.5 rounded-2xl border border-border px-4 py-3"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-accent-text)',
            }}
          >
            <Bot size={16} strokeWidth={2} />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[15px] font-semibold text-tbase-500">
              Asistente IA
            </span>
            <span className="text-[12px] text-tsecondary-500">
              Pregunta sobre cursos, lecciones o recomendaciones.
            </span>
          </div>
        </div>
      </div>

      <div
        className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 md:min-h-[44vh] md:p-6">
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div
                className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border px-4 py-3 md:max-w-[75%]"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  color: 'var(--text-primary)',
                }}
              >
                <strong className="mb-1 block text-[13px] font-semibold">
                  Asistente
                </strong>
                <p className="text-[14px] leading-relaxed text-tsecondary-500">
                  Hola, soy tu tutor. Preguntame lo que quieras sobre los cursos
                  disponibles.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={index}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 md:max-w-[75%] ${
                    isUser
                      ? 'rounded-tr-sm'
                      : 'rounded-tl-sm border border-border'
                  }`}
                  style={
                    isUser
                      ? {
                          backgroundColor: 'var(--color-accent)',
                          color: 'var(--color-accent-text)',
                        }
                      : {
                          backgroundColor: 'var(--surface-elevated)',
                          color: 'var(--text-primary)',
                        }
                  }
                >
                  <strong className="mb-1 block text-[13px] font-semibold">
                    {isUser ? 'Tu' : 'Asistente'}
                  </strong>

                  {isUser ? (
                    <p className="whitespace-pre-wrap text-[14px] leading-relaxed">
                      {msg.content}
                    </p>
                  ) : msg.content ? (
                    <Markdown
                      content={msg.content}
                      className="marked text-[14px] leading-relaxed"
                    />
                  ) : (
                    <span className="text-[14px] opacity-50">...</span>
                  )}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <p className="text-[14px] text-tsecondary-500">Pensando...</p>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="p-3 pt-2 md:p-4 md:pt-3">
          <div className="flex items-end gap-2.5">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta... (Enter para enviar)"
              rows={1}
              disabled={loading}
              className="h-11 min-h-11 flex-1 resize-none rounded-2xl border border-border px-4 py-2.5 text-[14px] text-tbase-500 placeholder:text-tsecondary-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] disabled:opacity-50"
              style={{ backgroundColor: 'var(--input-bg)' }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Enviar mensaje"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 md:h-10 md:w-10"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
              }}
            >
              <Send size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
