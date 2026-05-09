import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, GraduationCap, House } from 'lucide-react';
import { VideoPlayer } from '#common/video-player/bindings/react';
import { Markdown } from '#common/markdown';
import type { LessonDetail } from './lesson.types';
import type { CourseDetail } from '#pods/courses/courses.types';

interface LessonDetailViewProps {
  lesson: LessonDetail;
  course?: CourseDetail;
  courseId?: string;
}

export function LessonDetailView({
  lesson,
  course,
  courseId,
}: LessonDetailViewProps) {
  const lessonIndex =
    course?.lessons.findIndex((l) => l.id === lesson.id) ?? -1;
  const prevLesson = lessonIndex > 0 ? course!.lessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex >= 0 && lessonIndex < (course?.lessons.length ?? 0) - 1
      ? course!.lessons[lessonIndex + 1]
      : null;

  const duration = lesson.time ? `${lesson.time} min` : null;

  return (
    <div className="flex flex-1 flex-col">
      {courseId && (
        <nav className="flex items-center gap-1.5 px-5 py-2 md:px-10">
          <House size={14} className="text-tsecondary-500" />
          <ChevronRight size={12} className="text-tsecondary-500" />
          <Link
            to="/course/$contentIslandId"
            params={{ contentIslandId: courseId }}
            className="text-[13px] text-tsecondary-500 transition hover:text-tbase-500"
          >
            {course?.name ?? 'Cursos'}
          </Link>
          <ChevronRight size={12} className="text-tsecondary-500" />
          <span className="text-[13px] text-tsecondary-500">{lesson.name}</span>
        </nav>
      )}

      <div className="flex items-baseline gap-4 px-5 pb-2 pt-4 md:px-10 md:pt-5">
        <h1 className="text-[17px] font-bold text-tbase-500 md:text-[22px]">
          {lesson.name}
        </h1>
        {duration && (
          <span className="shrink-0 text-[14px] text-tsecondary-500 md:text-[16px]">
            {duration}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6 px-5 pb-5 md:flex-row md:px-10 md:pb-0">
        <div className="flex flex-1 flex-col">
          {lesson.video ? (
            <VideoPlayer
              src={lesson.video}
              primaryColor="#c9d600"
              backgroundColor="#0e1209"
              borderRadius="8px"
              className="w-full"
            />
          ) : (
            <div className="flex h-52 items-center justify-center rounded-lg bg-[#0e1209] md:h-82">
              <span className="text-[13px] text-[#ffffff44]">
                Sin vídeo disponible
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-row gap-3 md:w-60 md:flex-col md:gap-4">
          <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface md:h-45 md:w-full">
            {course?.image ? (
              <img
                src={course.image}
                alt={course.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-22 w-22 items-center justify-center rounded-2xl bg-(--btn-primary-bg)">
                <GraduationCap
                  size={40}
                  className="text-(--btn-primary-text)"
                />
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2 md:gap-4">
            {prevLesson ? (
              <Link
                to="/lesson/$lessonId"
                params={{ lessonId: prevLesson.id }}
                search={{ courseId }}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-(--surface-elevated) px-6 py-3 text-[14px] text-tsecondary-500 transition hover:brightness-95"
              >
                <ChevronLeft size={15} />
                <span className="hidden md:inline">Lección anterior</span>
                <span className="md:hidden">Anterior</span>
              </Link>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-(--surface-elevated) px-6 py-3 text-[14px] text-tsecondary-500 opacity-40">
                <ChevronLeft size={15} />
                <span className="hidden md:inline">Lección anterior</span>
                <span className="md:hidden">Anterior</span>
              </div>
            )}

            {nextLesson ? (
              <Link
                to="/lesson/$lessonId"
                params={{ lessonId: nextLesson.id }}
                search={{ courseId }}
                className="flex items-center justify-center gap-2 rounded-lg bg-(--btn-primary-bg) px-6 py-3 text-[14px] font-semibold text-(--btn-primary-text) transition hover:brightness-95"
              >
                <span>Siguiente Lección</span>
                <ChevronRight size={15} />
              </Link>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-(--btn-primary-bg) px-6 py-3 text-[14px] font-semibold text-(--btn-primary-text) opacity-40">
                <span>Siguiente Lección</span>
                <ChevronRight size={15} />
              </div>
            )}
          </div>
        </div>
      </div>

      {(lesson.description || lesson.view) && (
        <div className="mt-4 flex-1 border-t border-border bg-surface px-5 py-5 md:px-10">
          {lesson.description && <Markdown content={lesson.description} />}
          {lesson.view && (
            <div className={lesson.description ? 'mt-6' : ''}>
              <Markdown content={lesson.view} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
