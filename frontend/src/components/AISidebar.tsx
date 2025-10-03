import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, LayoutDashboard, History as HistoryIcon, PlusSquare, Sparkles, Trophy, Settings, ChevronsLeft, ChevronsRight, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
// NOTE: Home is not used in the primary items anymore; kept import if needed elsewhere

type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

const PRIMARY_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Assessment', path: '/ai-assessment', icon: Sparkles },
  { label: 'History', path: '/history', icon: HistoryIcon },
  { label: 'Create Quiz', path: '/admin/create', icon: PlusSquare },
];

const SECONDARY_ITEMS: NavItem[] = [
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function AISidebar({ collapsed }: { collapsed: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    const p = location.pathname;
    if (path === '/ai-assessment') return p.startsWith('/ai-assessment') || p.startsWith('/assessment');
    if (path === '/admin/create') return p.startsWith('/admin/create') || p.startsWith('/create');
    if (path === '/leaderboard') return p.startsWith('/leaderboard');
    return p === path || p.startsWith(path + '/');
  };

  const baseItemCls = 'h-12 px-3 flex items-center gap-3 rounded-md transition-all duration-200 cursor-pointer';

  return (
    <aside
      className={
        `fixed left-0 top-0 h-screen ${collapsed ? 'w-[72px]' : 'w-[240px]'} z-40 border-r 
         bg-gradient-to-b from-violet-100 via-indigo-100 to-indigo-200 
         dark:from-violet-950 dark:via-violet-900 dark:to-indigo-950 
         text-slate-700 dark:text-slate-200 border-border`}
      style={{ paddingTop: 12 }}
    >
      {/* Brand at top */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-3 py-1`}>
        <div className="w-8 h-8 ai-button-gradient ai-rounded-lg flex items-center justify-center shadow-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <div className="ml-2 ai-text-gradient p-1 font-bold text-xl">Nebula AI Quiz</div>}
      </div>
      <div className="mx-3 my-2 border-t border-white/40 dark:border-white/10" />

       <nav className="px-2 space-y-1 py-4">
        {PRIMARY_ITEMS.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
               className={`${baseItemCls} ${active ? 'active' : 'inactive'} ${
                 active
                   ? 'bg-gradient-to-r from-violet-500 to-indigo-400 text-white font-semibold border-l-4 border-fuchsia-500'
                   : 'text-slate-600 dark:text-slate-300 hover:bg-violet-100/60 dark:hover:bg-violet-500/10 hover:text-slate-800 dark:hover:text-slate-100'
               }`}
              style={{ marginBottom: 4 }}
            >
               <Icon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>
          );
        })}

        <div style={{ height: 32 }} />

         {SECONDARY_ITEMS.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <div
              key={item.path}
               onClick={() => navigate(item.path)}
               className={`nav-item ${baseItemCls} ${active ? 'active' : 'inactive'} ${
                 active
                   ? 'bg-gradient-to-r from-violet-500 to-indigo-400 text-white font-semibold border-l-4 border-fuchsia-500'
                   : 'text-slate-600 dark:text-slate-300 hover:bg-violet-100/60 dark:hover:bg-violet-500/10 hover:text-slate-800 dark:hover:text-slate-100'
               }`}
              style={{ marginBottom: 4 }}
            >
               <Icon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>
          );
        })}
      </nav>

       <div className={`absolute bottom-4 ${collapsed ? 'left-1/2 -translate-x-1/2' : 'left-3 right-3'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-2`}>
          {!collapsed && (
            <div className="text-xs text-[#94A3B8]">
              <div className="font-medium text-foreground truncate max-w-[160px]">{(sessionStorage.getItem('quiz_user') && JSON.parse(sessionStorage.getItem('quiz_user') as string).username) || 'Guest'}</div>
              <div className="text-[10px] text-muted-foreground truncate max-w-[160px]">{(sessionStorage.getItem('quiz_user') && JSON.parse(sessionStorage.getItem('quiz_user') as string).email) || 'Not signed in'}</div>
            </div>
          )}
          <Button
            variant="destructive"
            size={collapsed ? 'icon' : 'sm'}
            className="gap-2"
            onClick={() => {
              sessionStorage.removeItem('quiz_user');
              navigate('/home');
            }}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}

export function AIPageShell({ children, title }: { children: React.ReactNode; title: string }) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const v = localStorage.getItem('ai_sidebar_collapsed');
    return v === '1';
  });

  useEffect(() => {
    localStorage.setItem('ai_sidebar_collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  const ml = collapsed ? 72 : 240;

  return (
    <div className="min-h-screen ai-gradient-bg text-foreground">
      <AISidebar collapsed={collapsed} />
       <header className="sticky top-0 z-30" style={{ marginLeft: ml }}>
        <div className="px-4 md:px-6 py-3 flex items-center justify-between bg-card/40 backdrop-blur border-b ai-card-glow">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={()=>setCollapsed(!collapsed)} className="bg-transparent border-primary/20 hover:bg-primary/10">
              {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
            </Button>
             {/* Brand removed from header */}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="p-4 md:p-6 transition-all duration-200" style={{ marginLeft: ml, marginRight: 0 }}>
        <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
          <span>Nebula AI Quiz</span>
          <span>/</span>
          <span className="text-foreground font-medium">{title}</span>
        </div>
        {children}
      </main>
    </div>
  );
}


