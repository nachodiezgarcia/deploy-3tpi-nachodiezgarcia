import { createFileRoute, redirect, Link } from '@tanstack/react-router';
import { Users, GraduationCap } from 'lucide-react';

export const Route = createFileRoute('/_auth/admin/')({
  beforeLoad: ({ context }) => {
    const session = (context as { session?: { user: { role: string } } })
      .session;
    if (session?.user.role !== 'admin') throw redirect({ to: '/dashboard' });
  },
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-8 py-24 md:py-34">
      <div className="w-full text-center">
        <h1 className="text-[28px] font-bold text-tbase-500 md:text-[28px]">
          Panel de Administración
        </h1>
        <p className="mt-1.5 text-[13px] text-tsecondary-500 md:text-[15px]">
          <span className="md:hidden">Gestiona usuarios y cursos</span>
          <span className="hidden md:inline">
            Gestiona usuarios y cursos de la plataforma
          </span>
        </p>
      </div>

      <div className="flex w-full justify-center flex-col gap-5 md:flex-row md:gap-8">
        <Link
          to="/admin/users"
          className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface shadow-[0_4px_16px_0_#1f231610] transition hover:brightness-[0.97] md:h-70 md:w-75 md:gap-4"
        >
          <div className="flex h-15 w-15 items-center justify-center rounded-[14px] bg-surface-elevated md:h-20 md:w-20 md:rounded-[20px]">
            <Users
              size={28}
              style={{ color: '#c9d600' }}
              className="md:hidden"
            />
            <Users
              size={36}
              style={{ color: '#c9d600' }}
              className="hidden md:block"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[17px] font-bold text-tbase-500 md:text-xl">
              Usuarios
            </span>
            <span className="hidden text-[13px] text-tsecondary-500 md:block">
              Gestionar cuentas y accesos
            </span>
          </div>
        </Link>

        <Link
          to="/admin/trainings"
          className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface shadow-[0_4px_16px_0_#1f231610] transition hover:brightness-[0.97] md:h-70 md:w-75 md:gap-4"
        >
          <div className="flex h-15 w-15 items-center justify-center rounded-[14px] bg-surface-elevated md:h-20 md:w-20 md:rounded-[20px]">
            <GraduationCap
              size={28}
              style={{ color: '#c9d600' }}
              className="md:hidden"
            />
            <GraduationCap
              size={36}
              style={{ color: '#c9d600' }}
              className="hidden md:block"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[17px] font-bold text-tbase-500 md:text-xl">
              Cursos
            </span>
            <span className="hidden text-[13px] text-tsecondary-500 md:block">
              Gestionar contenidos y lecciones
            </span>
          </div>
        </Link>
      </div>
    </main>
  );
}
