import { ChevronDown, FileDown, FileText, Sparkles } from "lucide-react";

const RF_SUBJECTS = [
  "Белгородская область", "Брянская область", "Владимирская область",
  "Волгоградская область", "Воронежская область", "Ивановская область",
  "Иркутская область", "Кабардино-Балкарская Республика", "Калужская область",
  "Краснодарский край", "Красноярский край", "Курская область",
  "Ленинградская область", "Москва", "Московская область",
  "Нижегородская область", "Новосибирская область", "Омская область",
  "Оренбургская область", "Орловская область", "Пермский край",
  "Приморский край", "Псковская область", "Республика Башкортостан",
  "Республика Татарстан", "Ростовская область", "Рязанская область",
  "Самарская область", "Санкт-Петербург", "Саратовская область",
  "Свердловская область", "Смоленская область", "Ставропольский край",
  "Тамбовская область", "Тверская область", "Томская область",
  "Тульская область", "Тюменская область", "Ульяновская область",
  "Челябинская область", "Чеченская Республика", "Ярославская область",
];

const HORIZONS = Array.from({ length: 6 }, (_, i) => i + 5); // 5..10

interface AIReportHeaderProps {
  subject: string;
  municipality: string;
  horizon: string;
  onSubjectChange: (v: string) => void;
  onMunicipalityChange: (v: string) => void;
  onHorizonChange: (v: string) => void;
  onGenerate: () => void;
  onExportPDF: () => void;
  onExportWord: () => void;
  isGenerating: boolean;
}

export function AIReportHeader({
  subject, municipality, horizon,
  onSubjectChange, onMunicipalityChange, onHorizonChange,
  onGenerate, onExportPDF, onExportWord, isGenerating,
}: AIReportHeaderProps) {
  return (
    <header className="border-b border-white/10 shrink-0 backdrop-blur-md bg-white/5 relative z-10">
      {/* Row 1: Title + Export + Generate */}
      <div className="flex items-center justify-between px-8 py-3 border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            ИИ-аналитическая справка
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Автоматическая генерация демографических отчётов
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export PDF */}
          <button
            onClick={onExportPDF}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors text-sm font-medium"
          >
            <FileDown className="w-4 h-4 text-rose-400" />
            <span>PDF</span>
          </button>

          {/* Export Word */}
          <button
            onClick={onExportWord}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>DOCX</span>
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Generate Button */}
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="relative group flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] border border-white/10 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer_1.8s_infinite]" />
            <Sparkles className="w-4 h-4 fill-white/60 animate-pulse" />
            <span>Сформировать справку</span>
          </button>
        </div>
      </div>

      {/* Row 2: Filters */}
      <div className="flex items-center gap-3 px-8 py-3">
        <span className="text-xs text-slate-500 uppercase tracking-wider shrink-0">Параметры:</span>

        {/* Subject dropdown */}
        <div className="relative">
          <select
            value={subject}
            onChange={(e) => { onSubjectChange(e.target.value); onMunicipalityChange(""); }}
            className="appearance-none pl-4 pr-9 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium text-slate-300 focus:outline-none focus:border-white/20 min-w-[200px]"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <option value="" className="bg-[#0F172A]">Субъект РФ</option>
            {RF_SUBJECTS.map((s) => (
              <option key={s} value={s} className="bg-[#0F172A]">{s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Municipality dropdown */}
        <div className="relative">
          <select
            value={municipality}
            onChange={(e) => onMunicipalityChange(e.target.value)}
            disabled={!subject}
            className="appearance-none pl-4 pr-9 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium text-slate-300 focus:outline-none focus:border-white/20 min-w-[180px] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <option value="" className="bg-[#0F172A]">Муниципалитет</option>
            {subject === "Тюменская область" && (<>
              <option className="bg-[#0F172A]">Тюмень</option>
              <option className="bg-[#0F172A]">Тобольск</option>
              <option className="bg-[#0F172A]">Ишим</option>
              <option className="bg-[#0F172A]">Ялуторовск</option>
            </>)}
            {subject === "Московская область" && (<>
              <option className="bg-[#0F172A]">Балашиха</option>
              <option className="bg-[#0F172A]">Королёв</option>
              <option className="bg-[#0F172A]">Подольск</option>
              <option className="bg-[#0F172A]">Химки</option>
            </>)}
            {subject === "Свердловская область" && (<>
              <option className="bg-[#0F172A]">Екатеринбург</option>
              <option className="bg-[#0F172A]">Нижний Тагил</option>
              <option className="bg-[#0F172A]">Первоуральск</option>
              <option className="bg-[#0F172A]">Каменск-Уральский</option>
            </>)}
            {subject && !["Тюменская область","Московская область","Свердловская область"].includes(subject) && (<>
              <option className="bg-[#0F172A]">Административный центр</option>
              <option className="bg-[#0F172A]">Городской округ №1</option>
              <option className="bg-[#0F172A]">Городской округ №2</option>
            </>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Horizon dropdown */}
        <div className="relative">
          <select
            value={horizon}
            onChange={(e) => onHorizonChange(e.target.value)}
            className="appearance-none pl-4 pr-9 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-sm font-medium text-slate-300 focus:outline-none focus:border-white/20"
            style={{ background: "rgba(255,255,255,0.05)" }}
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

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer { 100% { transform: translateX(200%); } }
      `}} />
    </header>
  );
}
