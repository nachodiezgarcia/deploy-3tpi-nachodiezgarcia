import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Sun, Moon, House, LogOut, Menu, UserCircle } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { $theme, toggleTheme } from '#common/theme';
import { $auth, type AuthUser } from '#pods/auth';

interface AppHeaderProps {
  onLogout?: () => void;
  user?: AuthUser;
}

export function AppHeader({ onLogout, user: userProp }: AppHeaderProps) {
  const theme = useStore($theme);
  const authStore = useStore($auth);
  const user = userProp ?? authStore?.user;
  const homeRoute = user?.role === 'admin' ? '/admin' : '/dashboard';
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  const onAdminPanel = location.pathname.startsWith('/admin');

  return (
    <>
      <header
        className="hidden md:flex h-17 w-full shrink-0 items-center justify-between border-b border-border px-8 py-10"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-tbase-500">Proyecto</span>
          <span className="text-xs font-bold text-tbase-500">Integrado</span>
          <span className="text-xs font-bold" style={{ color: '#c9d600' }}>
            DAW
          </span>
        </div>

        <div />

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={
              theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'
            }
            onClick={toggleTheme}
            className="flex cursor-pointer items-center text-tsecondary-500 transition-colors hover:text-tbase-500"
          >
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link
            to={homeRoute}
            aria-label="Inicio"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center text-tsecondary-500 transition-colors hover:text-tbase-500"
          >
            <House size={20} />
          </Link>
          {onLogout && (
            <div
              className="relative outline-none"
              tabIndex={-1}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setUserMenuOpen(false);
                }
              }}
            >
              <button
                type="button"
                aria-label="Menú de usuario"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex cursor-pointer items-center text-tsecondary-500 transition-colors hover:text-tbase-500"
              >
                <UserCircle size={20} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-9 z-20 min-w-52 rounded-xl border border-border bg-surface p-4 shadow-[0_4px_16px_0_#1f231614]">
                  <div className="mb-3 flex flex-col gap-1.5">
                    <div className="flex gap-1.5 text-[13px]">
                      <span className="font-semibold text-tbase-500">
                        Nombre:
                      </span>
                      <span className="text-tsecondary-500">{user?.name}</span>
                    </div>
                    <div className="flex gap-1.5 text-[13px]">
                      <span className="font-semibold text-tbase-500">
                        Email:
                      </span>
                      <span className="truncate text-tsecondary-500">
                        {user?.email}
                      </span>
                    </div>
                    <div className="flex gap-1.5 text-[13px]">
                      <span className="font-semibold text-tbase-500">Rol:</span>
                      <span className="text-tsecondary-500">
                        {user?.role === 'admin' ? 'Profesor' : 'Alumno'}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link
                      to={onAdminPanel ? '/dashboard' : '/admin'}
                      onClick={() => setUserMenuOpen(false)}
                      className="mb-2 flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-[13px] text-tsecondary-500 transition hover:bg-(--surface-elevated)"
                    >
                      {onAdminPanel ? 'Cursos' : 'Panel Administrador'}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-[13px] text-tsecondary-500 transition hover:bg-(--surface-elevated)"
                  >
                    <LogOut size={14} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <header
        className="flex md:hidden h-16 w-full shrink-0 items-center justify-between border-b border-border px-5"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-tbase-500">Proyecto</span>
          <span className="text-[10px] font-bold text-tbase-500">
            Integrado
          </span>
          <span className="text-[10px] font-bold" style={{ color: '#c9d600' }}>
            DAW
          </span>
        </div>

        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="cursor-pointer text-tbase-500"
        >
          <Menu size={24} />
        </button>
      </header>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="relative z-40 flex md:hidden flex-col gap-3 border-b border-border px-5 py-4"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <div className="flex items-center gap-5">
              <button
                type="button"
                aria-label={
                  theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'
                }
                onClick={toggleTheme}
                className="flex cursor-pointer items-center text-tsecondary-500 transition-colors hover:text-tbase-500"
              >
                {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link
                to={homeRoute}
                aria-label="Inicio"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-tsecondary-500 transition-colors hover:text-tbase-500"
              >
                <House size={20} />
              </Link>
            
              {isAdmin && (
                <Link
                  to={onAdminPanel ? '/dashboard' : '/admin'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex mr-auto items-center gap-2 rounded-lg border border-border px-3 py-2 text-[13px] text-tsecondary-500 transition hover:bg-(--surface-elevated)"
                >
                  {onAdminPanel ? 'Cursos' : 'Panel Admin'}
                </Link>
              )}
              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="flex ml-auto cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-[13px] text-tsecondary-500 transition hover:bg-(--surface-elevated)"
                >
                  <LogOut size={14} />
                  Cerrar sesión
                </button>
              )}
            </div>
            <div className="flex flex-col gap-0.5 text-[12px] text-tsecondary-500">
              <span className="font-semibold text-tbase-500">{user?.name}</span>
              <span className="truncate">{user?.email}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
