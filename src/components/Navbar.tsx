import { ClipboardList, Compass, LogOut, User } from 'lucide-react';
import { NavTab } from '../types';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeRequestCount: number;
  onLogout: () => void;
}

export function Navbar({
  activeTab,
  onTabChange,
  activeRequestCount,
  onLogout,
}: NavbarProps) {
  const navItems: { id: NavTab; label: string }[] = [
    { id: 'explore', label: 'Explore' },
    {
      id: 'requests',
      label: activeRequestCount > 0 ? `My Requests (${activeRequestCount})` : 'My Requests',
    },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <>
      {/* Top Bar (3-zone contract on desktop, compact bar on mobile) */}
      <header className="sticky top-0 z-30 h-14 md:h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => onTabChange('explore')}
            className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg py-1"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-display font-bold text-sm flex items-center justify-center shrink-0">
              CE
            </span>
            <span className="font-display font-bold text-lg tracking-tight text-slate-900">
              CampusEase
            </span>
          </button>

          {/* Zone 2: Clean single-line text nav links (Desktop) */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute left-0 right-0 -bottom-[13px] h-0.5 bg-blue-600 rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Header Action (Logout) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onLogout}
              className="min-h-[40px] px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200/90 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <LogOut className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe"
      >
        <div className="grid grid-cols-3 h-15">
          <button
            type="button"
            onClick={() => onTabChange('explore')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'explore' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-5 h-5" aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
              Explore
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('requests')}
            className={`min-h-[44px] relative flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'requests' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="relative">
              <ClipboardList className="w-5 h-5" aria-hidden="true" />
              {activeRequestCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-mono font-semibold flex items-center justify-center tabular-nums">
                  {activeRequestCount}
                </span>
              )}
            </span>
            <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
              My Requests
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'profile' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-5 h-5" aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
              Profile
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
