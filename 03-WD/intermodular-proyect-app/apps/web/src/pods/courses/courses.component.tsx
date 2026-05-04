import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Markdown } from '#common/markdown';
import {
  Calendar,
  ChevronRight,
  GraduationCap,
  House,
  Play,
  PlayCircle,
  Users,
  Video,
} from 'lucide-react';
import type { StudentCourse, CourseDetail } from './courses.types';

export function CourseList({ courses }: { courses: StudentCourse[] }) {
  if (courses.length === 0)
    return <p className="text-tsecondary-500">No tienes cursos asignados.</p>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <Link
          key={course.contentIslandId}
          to="/course/$contentIslandId"
          params={{ contentIslandId: course.contentIslandId }}
          className="block overflow-hidden rounded-xl border border-border bg-surface shadow-[0_4px_16px_0_#1f231612] transition hover:brightness-95"
        >
          <div
            className="relative flex h-53.5 items-center justify-center overflow-hidden rounded-t-xl"
            style={
              course.ciImage
                ? {
                    backgroundImage: `url(${course.ciImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : {
                    background:
                      'linear-gradient(135deg, #2d3520 0%, #1f2316 100%)',
                  }
            }
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle, #c9d60015 0%, transparent 100%)',
              }}
            />
            {!course.ciImage && (
              <GraduationCap
                size={64}
                className="relative z-10"
                style={{ color: '#c9d60033' }}
              />
            )}
          </div>
          <div className="flex flex-col gap-1.5 px-5 py-4">
            <span className="line-clamp-1 text-[15px] font-semibold text-tbase-500">
              {course.ciName ?? course.name_course}
            </span>
            {course.ciShortDescription && (
              <span className="line-clamp-2 text-[13px] text-tsecondary-500">
                {course.ciShortDescription}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export function CourseDetailView({ course }: { course: CourseDetail }) {
  const [tab, setTab] = useState<'content' | 'description'>('content');
  const firstLessonId = course.lessons[0]?.id ?? null;

  return (
    <div className="flex flex-1 flex-col">
      <div
        className="relative flex h-45 flex-col justify-end overflow-hidden px-5 pb-5 md:h-55 md:px-10 md:pb-7"
        style={{
          background: 'linear-gradient(160deg, #1a2812 0%, #1f2316 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute -top-16 right-0 h-65 w-65 rounded-full"
          style={{
            background:
              'radial-gradient(circle, #c9d60018 0%, transparent 70%)',
          }}
        />
        <nav className="relative mb-3 flex items-center gap-1.5">
          <House size={13} className="text-tsecondary-500" />
          <ChevronRight size={11} className="text-tsecondary-500" />
          <Link
            to="/dashboard"
            className="text-[12px] text-tsecondary-500 transition hover:text-[#d6d9c8]"
          >
            Cursos
          </Link>
          <ChevronRight size={11} className="text-tsecondary-500" />
          <span className="text-[12px] font-medium text-[#d6d9c8]">
            {course.name}
          </span>
        </nav>
        <div className="relative flex flex-col gap-2">
          <h1 className="text-[22px] font-bold text-[#f4f6f2] md:text-[28px]">
            {course.name}
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-tsecondary-500">
              <Video size={14} />
              <span className="text-[11px] md:text-[13px]">
                {course.lessons.length} vídeo
                {course.lessons.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-5 py-4 md:flex-row md:gap-6 md:px-10 md:py-7">
        <div className="flex flex-1 flex-col">
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => setTab('content')}
              className={`py-3 text-[13px] transition md:text-[14px] ${
                tab === 'content'
                  ? '-mb-px border-b-2 border-(--btn-primary-bg) font-semibold text-tbase-500'
                  : 'font-normal text-tsecondary-500'
              }`}
            >
              Contenido
            </button>
            <button
              type="button"
              onClick={() => setTab('description')}
              className={`px-5 py-3 text-[13px] transition md:text-[14px] ${
                tab === 'description'
                  ? '-mb-px border-b-2 border-(--btn-primary-bg) font-semibold text-tbase-500'
                  : 'font-normal text-tsecondary-500'
              }`}
            >
              Descripción
            </button>
          </div>

          <div className="pt-5">
            {tab === 'content' ? (
              <div className="overflow-hidden rounded-xl border border-border bg-surface">
                {course.lessons.length === 0 ? (
                  <p className="px-4 py-4 text-[13px] text-tsecondary-500">
                    Sin lecciones disponibles.
                  </p>
                ) : (
                  course.lessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      to="/lesson/$lessonId"
                      params={{ lessonId: lesson.id }}
                      search={{ courseId: course.id }}
                      className={`flex items-center justify-between px-4 py-3 transition hover:brightness-95${
                        index > 0 ? ' border-t border-border' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <PlayCircle
                          size={15}
                          className="shrink-0 text-tsecondary-500"
                        />
                        <span className="text-[13px] text-tsecondary-500">
                          {lesson.name}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            ) : (
              <Markdown
                content={course.description}
                className="prose prose-sm max-w-none text-tsecondary-500"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:w-75">
          {firstLessonId && (
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 shadow-[0_2px_8px_0_#1f231610]">
              <Link
                to="/lesson/$lessonId"
                params={{ lessonId: firstLessonId }}
                search={{ courseId: course.id }}
                className="flex items-center justify-center gap-2 rounded-lg bg-(--btn-primary-bg) py-3.5 text-[14px] font-semibold text-(--btn-primary-text) transition hover:brightness-95"
              >
                <Play size={15} />
                Empezar curso
              </Link>
            </div>
          )}

          {(course.shortDescription ||
            course.studentsCount > 0 ||
            course.lastUpdate) && (
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
              <span className="text-[13px] font-semibold text-tbase-500">
                Detalles del curso
              </span>
              {course.shortDescription && (
                <p className="text-[12px] leading-relaxed text-tsecondary-500">
                  {course.shortDescription}
                </p>
              )}
              {course.lastUpdate && (
                <div className="flex items-center gap-2.5 text-tsecondary-500">
                  <Calendar size={14} className="shrink-0" />
                  <span className="text-[12px]">
                    Actualizado{' '}
                    {new Date(course.lastUpdate).toLocaleDateString('es-ES', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {course.studentsCount > 0 && (
                <div className="flex items-center gap-2.5 text-tsecondary-500">
                  <Users size={14} className="shrink-0" />
                  <span className="text-[12px]">
                    {course.studentsCount} estudiante
                    {course.studentsCount !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
