import { ChevronDown, Loader2 } from "lucide-react";

interface Region {
  id: number;
  name: string;
}

interface Municipality {
  id: number;
  region_id: number;
  name: string;
}

interface HeaderProps {
  regions: Region[];
  municipalities: Municipality[];
  availableYears: number[];
  selectedRegionId: number | null;
  selectedMoId: number | null;
  startYear: number;
  endYear: number;
  isLoadingFilters: boolean;
  isLoadingMunicipalities: boolean;
  isYearRangeValid: boolean;
  onRegionChange: (regionId: string) => void;
  onMoChange: (moId: string) => void;
  onStartYearChange: (year: number) => void;
  onEndYearChange: (year: number) => void;
  onShowClick: () => void;
  isLoadingData?: boolean;
}

const selectClass =
  "appearance-none pl-3 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium text-slate-300 focus:outline-none focus:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed";

export function Header({
  regions,
  municipalities,
  availableYears,
  selectedRegionId,
  selectedMoId,
  startYear,
  endYear,
  isLoadingFilters,
  isLoadingMunicipalities,
  isYearRangeValid,
  onRegionChange,
  onMoChange,
  onStartYearChange,
  onEndYearChange,
  onShowClick,
  isLoadingData,
}: HeaderProps) {
  return (
    <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 shrink-0 backdrop-blur-md bg-white/5 relative z-10 gap-4 flex-wrap">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-xl font-bold tracking-tight text-white mr-2 whitespace-nowrap">
          Мониторинг населения
        </h1>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Region select */}
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
                <option key={r.id} value={r.id} className="bg-[#0F172A]">
                  {r.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Municipality select */}
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
                <option key={m.id} value={m.id} className="bg-[#0F172A]">
                  {m.name}
                </option>
              ))}
            </select>
            {isLoadingMunicipalities ? (
              <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
            ) : (
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            )}
          </div>

          <div className="w-px h-5 bg-white/10" />

          {/* Start year */}
          <div className="relative">
            <select
              value={startYear}
              onChange={(e) => onStartYearChange(Number(e.target.value))}
              className={selectClass}
              style={{ background: "rgba(255,255,255,0.05)" }}
              aria-label="Год начала"
            >
              {availableYears
                .filter((y) => y <= endYear)
                .map((y) => (
                  <option key={y} value={y} className="bg-[#0F172A]">
                    {y}
                  </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <span className="text-slate-500 text-sm">—</span>

          {/* End year */}
          <div className="relative">
            <select
              value={endYear}
              onChange={(e) => onEndYearChange(Number(e.target.value))}
              className={selectClass}
              style={{ background: "rgba(255,255,255,0.05)" }}
              aria-label="Год конца"
            >
              {availableYears
                .filter((y) => y >= startYear)
                .map((y) => (
                  <option key={y} value={y} className="bg-[#0F172A]">
                    {y}
                  </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {!isYearRangeValid && (
            <span className="text-xs text-rose-400">{"Год начала > года конца"}</span>
          )}
        </div>
      </div>

      <button
        onClick={onShowClick}
        disabled={!isYearRangeValid || isLoadingData || isLoadingFilters}
        className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-white/10 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        aria-label="Показать данные"
      >
        {isLoadingData && <Loader2 className="w-4 h-4 animate-spin" />}
        Показать
      </button>
    </header>
  );
}
