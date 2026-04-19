import { ChevronDown, Play } from "lucide-react";
import { useState } from "react";

const HORIZONS = Array.from({ length: 11 }, (_, i) => i + 5); // 5..15

export function ForecastingHeader() {
  const [horizon, setHorizon] = useState(10);

  return (
    <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 shrink-0 backdrop-blur-md bg-white/5 relative z-10 gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-xl font-bold tracking-tight text-white whitespace-nowrap mr-2">
          Демографическое прогнозирование
        </h1>

        <div className="flex items-center gap-3">
          {/* Subject RF */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="text-sm font-medium text-slate-300">Субъект РФ</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          {/* Municipality */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="text-sm font-medium text-slate-300">Муниципалитет</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          <div className="w-px h-5 bg-white/10" />

          {/* Horizon dropdown */}
          <div className="relative">
            <select
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="appearance-none pl-4 pr-9 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium text-slate-300 focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {HORIZONS.map((y) => (
                <option key={y} value={y} className="bg-[#0F172A]">
                  Горизонт: {y} лет
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <button className="relative group px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-white/10 flex items-center gap-2 overflow-hidden whitespace-nowrap shrink-0">
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        <Play className="w-4 h-4 fill-white animate-pulse" />
        Рассчитать прогноз
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </header>
  );
}
