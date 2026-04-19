import { Users, LayoutDashboard, TrendingUp, FileSearch } from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "../lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}

function NavItem({ to, icon, label, exact }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        cn(
          "relative group flex items-center justify-center w-full p-3 rounded-xl transition-all",
          isActive
            ? "bg-white/10 text-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.2)]"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
        )
      }
    >
      {icon}
      {/* Tooltip */}
      <span className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-xs font-medium text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 shadow-xl z-50">
        {label}
      </span>
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <aside className="w-[72px] bg-white/5 border-r border-white/10 flex flex-col items-center py-8 gap-6 backdrop-blur-md shrink-0 relative z-20">
      {/* App Icon */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-2">
        <Users className="w-5 h-5 text-white" />
      </div>

      <nav className="flex flex-col gap-2 w-full px-2">
        <NavItem
          to="/"
          exact
          icon={<LayoutDashboard className="w-6 h-6 stroke-1" />}
          label="Мониторинг численности"
        />
        <NavItem
          to="/forecasting"
          icon={<TrendingUp className="w-6 h-6 stroke-1" />}
          label="Прогнозирование численности"
        />
        <NavItem
          to="/ai-report"
          icon={<FileSearch className="w-6 h-6 stroke-1" />}
          label="Аналитическая ИИ-справка"
        />
      </nav>
    </aside>
  );
}
