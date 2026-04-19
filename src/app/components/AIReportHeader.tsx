import { ChevronDown, FileDown, FileText, Sparkles, Loader2 } from "lucide-react";

interface Region {
  id: number;
  name: string;
}

interface Municipality {
  id: number;
  region_id: number;
  name: string;
}

const HORIZONS = Array.from({ length: 6 }, (_, i) => i + 5); // 5..10

interface AIReportHeaderProps {
  regions: Region[];
  municipalities: Municipality[];
  selectedRegionId: number | null;
  selectedMoId: number | null;
  horizon: string;
  isLoadingFilters: boolean;
  isLoadingMunicipalities: boolean;
  onRegionChange: (v: string) => void;
  onMoChange: (v: string) => void;
  onHorizonChange: (v: string) => void;
  onGenerate: () => void;
  onExportPDF: () => void;
  onExportWord: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
  isReportReady: boolean;
}

const selectClass =
  "appearance-none pl-4 pr-9 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium text-slate-300 focus:outline-none focus:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed";

export function AIReportHeader({
  regions,
  municipalities,
  selectedRegionId,
  selectedMoId,
  horizon,
  isLoadingFilters,
  isLoadingMunicipalities,
  onRegionChange,
  onMoChange,
  onHorizonChange,
  onGenerate,
  onExportPDF,
  onExportWord,
  isGenerating,
  canGenerate,
  isReportReady,
}: AIReportHeaderProps) {
  return (
    <header className="border-b border-white/10 shrink-0 backdrop-blur-md bg-white/5 relative z-10">
      {/* Row 1: Title + Export + Generate */}
      <div className="flex items-center justify-between px-8 py-3 border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">ИИ-аналитическая справка</h1>
          <p className="text-xs text-slate-500 mt-0.5">Автоматическая генерация демографических отчётов</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportPDF}
            disabled={!isReportReady}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Скачать PDF"
          >
            <FileDown className="w-4 h-4 text-rose-400" />
            PDF
          </button>
          <button
            onClick={onExportWord}
            disabled={!isReportReady}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Скачать DOCX"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            DOCX
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <button
            onClick={onGenerate}
            disabled={!canGenerate || isLoadingFilters}
            className="relative group flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
            aria-label="Сформировать справку"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer_1.8s_infinite]" />
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 fill-white/60" />
            )}
            {isGenerating ? "Формирование..." : "Сформировать справку"}
          </button>
        </div>
      </div>

      {/* Row 2: Filters */}
      <div className="flex items-center gap-3 px-8 py-3 flex-wrap">
        <span className="text-xs text-slate-500 uppercase tracking-wider shrink-0">Параметры:</span>

        {/* Region */}
        <div className="relative">
          <select
            value={selectedRegionId ?? ""}
            onChange={(e) => { onRegionChange(e.target.value); onMoChange(""); }}
            disabled={isLoadingFilters}
            className={selectClass}
            style={{ background: "rgba(255,255,255,0.05)", minWidth: 200 }}
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
            style={{ background: "rgba(255,255,255,0.05)", minWidth: 180 }}
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

        {/* Horizon */}
        <div className="relative">
          <select
            value={horizon}
            onChange={(e) => onHorizonChange(e.target.value)}
            className={selectClass}
            style={{ background: "rgba(255,255,255,0.05)" }}
            aria-label="Горизонт прогноза"
          >
            {HORIZONS.map((y) => (
              <option key={y} value={String(y)} className="bg-[#0F172A]">
                Горизонт: {y} лет
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `@keyframes shimmer { 100% { transform: translateX(200%); } }`}} />
    </header>
  );
}
