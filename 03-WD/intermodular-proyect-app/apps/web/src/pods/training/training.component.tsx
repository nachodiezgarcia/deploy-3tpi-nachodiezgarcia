import { type FormEvent, useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ChevronLeft,
  Copy,
  GraduationCap,
  Pencil,
  Plus,
  UserPlus,
} from 'lucide-react';
import type {
  Training,
  TrainingDetail,
  CreateTrainingInput,
  UpdateTrainingInput,
} from './training.types';

export function TrainingList({ trainings }: { trainings: Training[] }) {
  if (trainings.length === 0)
    return <p className="text-tsecondary-500">No hay cursos creados.</p>;

  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
      {trainings.map((t) => (
        <Link
          key={t.id}
          to="/admin/training/$id"
          params={{ id: t.id }}
          className="block overflow-hidden rounded-xl border border-border bg-surface shadow-[0_4px_16px_0_#1f231612] transition hover:brightness-95"
        >
          <div
            className="relative flex h-53.5 items-center justify-center overflow-hidden rounded-t-xl"
            style={
              t.ciImage
                ? {
                    backgroundImage: `url(${t.ciImage})`,
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
            {!t.ciImage && (
              <GraduationCap
                size={64}
                className="relative z-10"
                style={{ color: '#c9d60033' }}
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5 px-5 py-4">
            <span className="line-clamp-1 text-[15px] font-semibold text-tbase-500">
              {t.ciName ?? t.name_course}
            </span>
            {t.ciShortDescription && (
              <span className="line-clamp-2 text-[13px] text-tsecondary-500">
                {t.ciShortDescription}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export function CreateTrainingForm({
  onSubmit,
}: {
  onSubmit: (data: CreateTrainingInput) => Promise<void>;
}) {
  const [nameCourse, setNameCourse] = useState('');
  const [contentIslandId, setContentIslandId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ name_course: nameCourse, contentIslandId });
      setNameCourse('');
      setContentIslandId('');
    } catch {
      setError('Error al crear el curso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_4px_16px_0_#1f231612] md:max-w-175">
      <div className="flex items-center gap-3 px-4 py-4 md:px-6 md:py-5">
        <Link
          to="/admin/trainings"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated text-tsecondary-500 transition hover:text-tbase-500"
        >
          <ChevronLeft size={16} />
        </Link>
        <span className="text-[18px] font-bold text-tbase-500">
          Nuevo curso
        </span>
      </div>

      <div className="h-px w-full bg-border" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 md:p-7">
        {error && <p className="text-sm text-terror-500">{error}</p>}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="tc-name"
            className="text-[13px] font-semibold text-tbase-500"
          >
            Nombre
          </label>
          <input
            id="tc-name"
            className="rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5 text-[14px] text-tbase-500 outline-none transition placeholder:text-(--placeholder-text) focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
            value={nameCourse}
            onChange={(e) => setNameCourse(e.target.value)}
            placeholder="Nombre del curso"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="tc-ci"
            className="text-[13px] font-semibold text-tbase-500"
          >
            Content Island Id
          </label>
          <input
            id="tc-ci"
            className="rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5 text-[14px] text-tbase-500 outline-none transition placeholder:text-(--placeholder-text) focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
            value={contentIslandId}
            onChange={(e) => setContentIslandId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx"
            required
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-(--btn-primary-bg) px-8 py-2.5 text-[14px] font-semibold text-(--btn-primary-text) transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={15} />
            {loading ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function TrainingDetailView({
  training,
  onUpdate,
  onAssign,
}: {
  training: TrainingDetail;
  onUpdate: (data: UpdateTrainingInput) => Promise<void>;
  onAssign: (userId: string) => Promise<void>;
}) {
  const [nameCourse, setNameCourse] = useState(training.name_course);
  const [contentIslandId, setContentIslandId] = useState(
    training.contentIslandId,
  );
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');
  const [updateError, setUpdateError] = useState(false);

  const [userId, setUserId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignMsg, setAssignMsg] = useState('');
  const [assignError, setAssignError] = useState(false);

  const handleCopyCi = () => {
    navigator.clipboard.writeText(contentIslandId);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setUpdateMsg('');
    setUpdateError(false);
    setUpdateLoading(true);
    try {
      await onUpdate({ name_course: nameCourse, contentIslandId });
      setUpdateMsg('Curso actualizado.');
    } catch {
      setUpdateError(true);
      setUpdateMsg('Error al actualizar.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAssign = async (e: FormEvent) => {
    e.preventDefault();
    setAssignMsg('');
    setAssignError(false);
    setAssignLoading(true);
    try {
      await onAssign(userId);
      setUserId('');
      setAssignMsg('Curso asignado correctamente.');
    } catch {
      setAssignError(true);
      setAssignMsg('Error al asignar.');
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-5 md:max-w-175">
      <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_4px_16px_0_#1f231612]">
        <div className="flex items-center gap-3 px-4 py-4 md:px-6 md:py-5">
          <Link
            to="/admin/trainings"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated text-tsecondary-500 transition hover:text-tbase-500"
          >
            <ChevronLeft size={16} />
          </Link>
          <span className="text-[18px] font-bold text-tbase-500">
            {training.ci?.name ?? training.name_course}
          </span>
        </div>

        <div className="h-px w-full bg-border" />

        <form
          onSubmit={handleUpdate}
          className="flex flex-col gap-4 p-4 md:p-7"
        >
          {updateMsg && (
            <p
              className={`text-sm ${updateError ? 'text-terror-500' : 'text-tbase-500'}`}
            >
              {updateMsg}
            </p>
          )}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-5">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="tu-name"
                  className="text-[13px] font-semibold text-tbase-500"
                >
                  Nombre
                </label>
                <input
                  id="tu-name"
                  className="rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5 text-[14px] text-tbase-500 outline-none transition focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
                  value={nameCourse}
                  onChange={(e) => setNameCourse(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="tu-ci"
                  className="text-[13px] font-semibold text-tbase-500"
                >
                  Content Island Id
                </label>
                <div className="flex items-center rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5">
                  <input
                    id="tu-ci"
                    className="flex-1 bg-transparent text-[14px] text-tbase-500 outline-none"
                    value={contentIslandId}
                    onChange={(e) => setContentIslandId(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    aria-label="Copiar ID"
                    onClick={handleCopyCi}
                    className="ml-3 shrink-0 cursor-pointer text-tsecondary-500 transition hover:text-tbase-500"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateLoading}
                className="flex items-center gap-2 rounded-lg bg-(--btn-primary-bg) px-6 py-2.5 text-[14px] font-semibold text-(--btn-primary-text) transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Pencil size={15} />
                {updateLoading ? 'Guardando...' : 'Editar'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_4px_16px_0_#1f231612]">
        <div className="px-4 py-4 md:px-6 md:py-5">
          <span className="text-[16px] font-bold text-tbase-500">
            Asignar a usuario
          </span>
        </div>
        <div className="h-px w-full bg-border" />
        <form
          onSubmit={handleAssign}
          className="flex flex-col gap-4 p-4 md:p-7"
        >
          {assignMsg && (
            <p
              className={`text-sm ${assignError ? 'text-terror-500' : 'text-tbase-500'}`}
            >
              {assignMsg}
            </p>
          )}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-5">
            <div className="flex flex-1 flex-col gap-1.5">
              <label
                htmlFor="ta-user"
                className="text-[13px] font-semibold text-tbase-500"
              >
                ID de usuario
              </label>
              <input
                id="ta-user"
                className="rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5 text-[14px] text-tbase-500 outline-none transition placeholder:text-(--placeholder-text) focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Identificador del usuario"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={assignLoading}
                className="flex items-center gap-2 rounded-lg bg-(--btn-primary-bg) px-6 py-2.5 text-[14px] font-semibold text-(--btn-primary-text) transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserPlus size={15} />
                {assignLoading ? 'Asignando...' : 'Asignar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
