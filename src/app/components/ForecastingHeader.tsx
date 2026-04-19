import { ChevronDown, Play, Loader2 } from "lucide-react";

interface Region {
  id: number;
  name: string;
}

interface Municipality {
  id: number;
  region_id: number;
  name: string;
}

interface ModelOption {
  id: string;
  name: string;
}

interface ForecastingHeaderProps {
  regions: Region[];
  municipalities: Municipality[];
  selectedRegionId: number | null;
  selectedMoId: number | null;
  availableModels: ModelOption[];
  selectedModel: string;
  horizon: number;
  isLoadingFilters: boolean;
  isLoadingMunicipalities: boolean;
  isLoadingForecast: boolean;
  onRegionChange: (regionId: string) => void;
  onMoChange: (moId: string) => void;
  onModelChange: (model: string) => void;
  onHorizonChange: (horizon: number) => void;
  onCalculate: () => void;
}

const HORIZONS = Array.from({ length: 11 }, (_, i) => i + 5);

const selectClass =
  "appearance-none pl-4 pr-9 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium text-slate-300 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed";

export function ForecastingHeader({
  regions,
  municipalities,
  selectedRegionId,
  selectedMoId,
  availableModels,
  selectedModel,
  horizon,
  isLoadingFilters,
  isLoadingMunicipalities,
  isLoadingForecast,
  onRegionChange,
  onMoChange,
  onModelChange,
  onHorizonChange,
  onCalculate,
}: ForecastingHeaderProps) {
  return (
    <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 shrink-0 backdrop-blur-md bg-white/5 relative z-10 gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-xl font-bold tracking-tight text-white whitespace-nowrap mr-2">
          Демографическое прогнозирование
        </h1>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Region */}
          <div className="relative">
            <select
              value={selectedRegionId ?? ""}
              onChange={(e) => onRegionChange(e.target.value)}
              disabled={isLoadingFilters}
              className={selectClass}
              style={{ background: "rgba(255,255,255,0.05)" }}
              aria-label="Субъект РФ"
            >
              <option value="" className="bg-[#0F172A]">Субъект РФ</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#0F172A]">{r.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Municipality */}
          <div className="relative">
            <select
              value={selectedMoId ?? ""}
              onChange={(e) => onMoChange(e.target.value)}
              disabled={!selectedRegionId || isLoadingMunicipalities}
              className={selectClass}
              style={{ background: "rgba(255,255,255,0.05)" }}
              aria-label="Муниципалитет"
            >
              <option value="" className="bg-[#0F172A]">
                {isLoadingMunicipalities ? "Загрузка..." : "Муниципалитет"}
              </option>
              {municipalities.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#0F172A]">{m.name}</option>
              ))}
            </select>
            {isLoadingMunicipalities ? (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
            ) : (
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            )}
          </div>

          <div className="w-px h-5 bg-white/10" />

          {/* Model */}
          {availableModels.length > 0 && (
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                className={selectClass}
                style={{ background: "rgba(255,255,255,0.05)" }}
                aria-label="Модель прогноза"
              >
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#0F172A]">{m.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          )}

          {/* Horizon */}
          <div className="relative">
            <select
              value={horizon}
              onChange={(e) => onHorizonChange(Number(e.target.value))}
              className={selectClass}
              style={{ background: "rgba(255,255,255,0.05)" }}
              aria-label="Горизонт прогноза"
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

      <button
        onClick={onCalculate}
        disabled={isLoadingForecast || isLoadingFilters}
        className="relative group px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-white/10 flex items-center gap-2 overflow-hidden whitespace-nowrap shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label="Рассчитать прогноз"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        {isLoadingForecast ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Play className="w-4 h-4 fill-white" />
        )}
        {isLoadingForecast ? "Расчёт..." : "Рассчитать прогноз"}
      </button>

      <style dangerouslySetInnerHTML={{__html: `@keyframes shimmer { 100% { transform: translateX(100%); } }`}} />
    </header>
  );
}
