import { type FormEvent, useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Check,
  GraduationCap,
  Pencil,
  User,
  ChevronLeft,
  Copy,
  UserPlus,
} from 'lucide-react';
import type {
  User as UserType,
  UserDetail,
  InviteUserInput,
} from './users.types';
import type { Training } from '#pods/training';

export function UserGrid({ users }: { users: UserType[] }) {
  if (users.length === 0)
    return <p className="text-tsecondary-500">No hay usuarios.</p>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
      {users.map((u) => (
        <Link
          key={u.id}
          to="/admin/user/$id"
          params={{ id: u.id }}
          className="block overflow-hidden rounded-xl border border-border bg-surface shadow-[0_2px_8px_0_#1f231612] transition hover:brightness-[0.97]"
        >
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[15px] font-semibold text-tbase-500">
              {u.name}
            </span>
            <Pencil size={15} style={{ color: '#c9d600' }} />
          </div>

          <div
            className="flex items-center justify-between border-t border-border px-4 py-2.5"
            style={{ backgroundColor: 'var(--surface-elevated)' }}
          >
            <span className="text-[14px] text-tsecondary-500">
              {u.rol === 'admin' ? 'Profesor' : 'Alumno'}
            </span>
            <User size={18} className="text-tsecondary-500" />
          </div>
        </Link>
      ))}
    </div>
  );
}

export function InviteUserForm({
  onSubmit,
}: {
  onSubmit: (data: Omit<InviteUserInput, 'coursesToAssign'>) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState<'student' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ name, email, rol });
      setName('');
      setEmail('');
      setRol('student');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al enviar la invitación.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_4px_16px_0_#1f231612] md:max-w-175">
      <div className="flex items-center gap-3 px-4 py-4 md:px-6 md:py-5">
        <Link
          to="/admin/users"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated text-tsecondary-500 transition hover:text-tbase-500"
        >
          <ChevronLeft size={16} />
        </Link>
        <span className="text-[18px] font-bold text-tbase-500">
          Invitar usuario
        </span>
      </div>

      <div className="h-px w-full bg-border" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 md:p-7">
        {error && <p className="text-sm text-terror-500">{error}</p>}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="inv-name"
            className="text-[13px] font-semibold text-tbase-500"
          >
            Nombre
          </label>
          <input
            id="inv-name"
            className="rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5 text-[14px] text-tbase-500 placeholder:text-(--placeholder-text) outline-none transition focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="inv-email"
            className="text-[13px] font-semibold text-tbase-500"
          >
            Email
          </label>
          <input
            id="inv-email"
            type="email"
            className="rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5 text-[14px] text-tbase-500 placeholder:text-(--placeholder-text) outline-none transition focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre@email.com"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="inv-rol"
            className="text-[13px] font-semibold text-tbase-500"
          >
            Rol
          </label>
          <select
            id="inv-rol"
            className="rounded-lg border border-border bg-surface-elevated px-3.5 py-2.5 text-[14px] text-tbase-500 outline-none transition focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
            value={rol}
            onChange={(e) => setRol(e.target.value as 'student' | 'admin')}
          >
            <option value="student">Alumno</option>
            <option value="admin">Profesor</option>
          </select>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-(--btn-primary-bg) px-8 py-2.5 text-[14px] font-semibold text-(--btn-primary-text) transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus size={15} />
            {loading ? 'Enviando...' : 'Invitar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function UserDetailView({
  user,
  onUpdate,
}: {
  user: UserDetail;
  onUpdate?: (name: string) => Promise<void>;
}) {
  const linkedLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/dashboard`
      : '/dashboard';

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(user.name);
  const [saving, setSaving] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(linkedLink);
  };

  const handleAccept = async () => {
    if (!onUpdate) return;
    setSaving(true);
    try {
      await onUpdate(nameValue);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_4px_16px_0_#1f231612] md:max-w-175">
      <div className="flex items-center gap-3 px-4 py-4 md:px-6 md:py-5">
        <Link
          to="/admin/users"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated text-tsecondary-500 transition hover:text-tbase-500"
        >
          <ChevronLeft size={16} />
        </Link>
        <span className="text-[18px] font-bold text-tbase-500">
          {user.name}
        </span>
      </div>

      <div className="h-px w-full bg-border" />

      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-end md:gap-5 md:p-7">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-tbase-500">
                Nombre
              </span>
              {editing ? (
                <input
                  className="h-10 w-full rounded-lg border border-border bg-surface-elevated px-3.5 text-[14px] text-tbase-500 outline-none transition focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)/20"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  autoFocus
                />
              ) : (
                <div
                  className="rounded-lg border border-border px-3.5 py-2.5 text-[14px] text-tsecondary-500"
                  style={{ backgroundColor: 'var(--surface-elevated)' }}
                >
                  {user.name}
                </div>
              )}
            </div>
            {editing && (
              <button
                type="button"
                disabled={nameValue === user.name || saving}
                onClick={handleAccept}
                className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-(--btn-primary-bg) px-4 text-[13px] font-semibold text-(--btn-primary-text) transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={14} />
                {saving ? '...' : 'Aceptar'}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-tbase-500">
              Email
            </span>
            <div
              className="rounded-lg border border-border px-3.5 py-2.5 text-[14px] text-tsecondary-500"
              style={{ backgroundColor: 'var(--surface-elevated)' }}
            >
              {user.email}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-tbase-500">
              Activation Link
            </span>
            <div
              className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5"
              style={{ backgroundColor: 'var(--surface-elevated)' }}
            >
              <span className="truncate text-[14px] text-tsecondary-500">
                {linkedLink}
              </span>
              <button
                type="button"
                aria-label="Copiar enlace"
                onClick={handleCopy}
                className="ml-3 shrink-0 cursor-pointer text-tsecondary-500 transition hover:text-tbase-500"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end md:self-end">
          <button
            type="button"
            onClick={() => {
              setNameValue(user.name);
              setEditing((v) => !v);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-(--btn-primary-bg) px-6 py-2.5 text-[14px] font-semibold text-(--btn-primary-text) transition hover:brightness-95"
          >
            <Pencil size={15} />
            {editing ? 'Cancelar' : 'Editar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CourseAssignGrid({
  trainings,
  assignedContentIslandIds,
  onAssign,
  onUnassign,
}: {
  trainings: Training[];
  assignedContentIslandIds: string[];
  onAssign: (trainingId: string) => Promise<void>;
  onUnassign: (trainingId: string) => Promise<void>;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const assignedSet = new Set(assignedContentIslandIds);

  const handle = async (
    fn: (id: string) => Promise<void>,
    trainingId: string,
  ) => {
    setLoadingId(trainingId);
    try {
      await fn(trainingId);
    } finally {
      setLoadingId(null);
    }
  };

  if (trainings.length === 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_4px_16px_0_#1f231612] md:max-w-175">
      <div className="px-4 py-4 md:px-6 md:py-5">
        <span className="text-[16px] font-bold text-tbase-500">Cursos</span>
      </div>
      <div className="h-px w-full bg-border" />
      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 md:p-6">
        {trainings.map((t) => {
          const assigned = assignedSet.has(t.contentIslandId);
          const isLoading = loadingId === t.id;
          return (
            <div
              key={t.id}
              className="overflow-hidden rounded-xl border transition"
              style={{
                borderColor: assigned ? '#c9d600' : 'var(--border)',
                backgroundColor: assigned
                  ? '#c9d60010'
                  : 'var(--surface-elevated)',
              }}
            >
              <div
                className="relative flex h-24 items-center justify-center overflow-hidden"
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
                {!t.ciImage && (
                  <GraduationCap size={32} style={{ color: '#c9d60033' }} />
                )}
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                <span className="line-clamp-1 text-[13px] font-semibold text-tbase-500">
                  {t.ciName ?? t.name_course}
                </span>
                {assigned ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className="flex items-center gap-1 text-[12px] font-semibold"
                      style={{ color: '#c9d600' }}
                    >
                      <Check size={13} />
                      Asignado
                    </span>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handle(onUnassign, t.id)}
                      className="cursor-pointer rounded-md border border-border bg-surface px-2 py-1 text-[12px] font-semibold text-tsecondary-500 transition hover:border-red-400 hover:text-red-400 disabled:opacity-60"
                    >
                      {isLoading ? '...' : 'Quitar'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handle(onAssign, t.id)}
                    className="cursor-pointer shrink-0 rounded-md bg-(--btn-primary-bg) px-2.5 py-1 text-[12px] font-semibold text-(--btn-primary-text) transition hover:brightness-95 disabled:opacity-60"
                  >
                    {isLoading ? '...' : 'Asignar'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CourseSelectGrid({
  trainings,
  selected,
  onToggle,
  isLoading = false,
}: {
  trainings: Training[];
  selected: Set<string>;
  onToggle: (trainingId: string) => void;
  isLoading?: boolean;
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_4px_16px_0_#1f231612] md:max-w-175">
      <div className="px-4 py-4 md:px-6 md:py-5">
        <span className="text-[16px] font-bold text-tbase-500">
          Cursos a asignar
        </span>
        <p className="mt-0.5 text-[12px] text-tsecondary-500">
          Selecciona los cursos que tendrá disponibles
        </p>
      </div>
      <div className="h-px w-full bg-border" />
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <span className="text-[13px] text-tsecondary-500">
            Cargando cursos...
          </span>
        </div>
      ) : trainings.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <span className="text-[13px] text-tsecondary-500">
            No hay cursos disponibles
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 md:p-6">
          {trainings.map((t) => {
            const isSelected = selected.has(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onToggle(t.id)}
                className="overflow-hidden rounded-xl border text-left transition"
                style={{
                  borderColor: isSelected ? '#c9d600' : 'var(--border)',
                  backgroundColor: isSelected
                    ? '#c9d60010'
                    : 'var(--surface-elevated)',
                }}
              >
                <div
                  className="relative flex h-24 items-center justify-center overflow-hidden"
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
                  {!t.ciImage && (
                    <GraduationCap size={32} style={{ color: '#c9d60033' }} />
                  )}
                  {isSelected && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: '#c9d60030' }}
                    >
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: '#c9d600' }}
                      >
                        <Check size={16} color="#1f2316" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                  <span className="line-clamp-1 text-[13px] font-semibold text-tbase-500">
                    {t.ciName ?? t.name_course}
                  </span>
                  {isSelected && (
                    <span
                      className="text-[12px] font-semibold"
                      style={{ color: '#c9d600' }}
                    >
                      Seleccionado
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
