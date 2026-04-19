import { ChevronDown } from "lucide-react";
import { useState } from "react";

const YEARS = Array.from({ length: 15 }, (_, i) => 2010 + i); // 2010–2024

export function Header() {
  const [yearFrom, setYearFrom] = useState(2023);
  const [yearTo, setYearTo] = useState(2024);

  return (
    <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 shrink-0 backdrop-blur-md bg-white/5 relative z-10">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-xl font-bold tracking-tight text-white mr-2 whitespace-nowrap">Мониторинг населения</h1>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Subject RF */}
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-sm font-medium text-slate-300">Субъект РФ</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Municipality */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="text-sm font-medium text-slate-300">Муниципалитет</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          <div className="w-px h-5 bg-white/10" />

          {/* Year From */}
          <div className="relative">
            <select
              value={yearFrom}
              onChange={(e) => setYearFrom(Number(e.target.value))}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium text-slate-300 focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {YEARS.filter((y) => y <= yearTo).map((y) => (
                <option key={y} value={y} className="bg-[#0F172A]">{y}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <span className="text-slate-500 text-sm">—</span>

          {/* Year To */}
          <div className="relative">
            <select
              value={yearTo}
              onChange={(e) => setYearTo(Number(e.target.value))}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium text-slate-300 focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {YEARS.filter((y) => y >= yearFrom).map((y) => (
                <option key={y} value={y} className="bg-[#0F172A]">{y}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <button className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-white/10 whitespace-nowrap">
        Показать
      </button>
    </header>
  );
}