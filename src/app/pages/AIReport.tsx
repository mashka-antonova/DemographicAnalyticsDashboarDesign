import { useState, useEffect } from "react";
import { AIReportHeader } from "../components/AIReportHeader";
import {
  FileSearch,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Cpu,
  BarChart3,
  MapPin,
  Lightbulb,
} from "lucide-react";

type ReportState = "empty" | "generating" | "ready";

interface GenerationStep {
  id: number;
  label: string;
  icon: React.ReactNode;
  done: boolean;
}

export function AIReport() {
  const [subject, setSubject] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [horizon, setHorizon] = useState("10");
  const [reportState, setReportState] = useState<ReportState>("empty");
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<GenerationStep[]>([]);
  const [reportSubject, setReportSubject] = useState("");
  const [reportMunicipality, setReportMunicipality] = useState("");
  const [reportHorizon, setReportHorizon] = useState("10");

  const allSteps: GenerationStep[] = [
    { id: 1, label: "Загрузка демографических данных...", icon: <BarChart3 className="w-4 h-4" />, done: false },
    { id: 2, label: "Запуск модели Prophet (Meta)...", icon: <Cpu className="w-4 h-4" />, done: false },
    { id: 3, label: "Анализ миграционных потоков...", icon: <MapPin className="w-4 h-4" />, done: false },
    { id: 4, label: "Генерация ИИ-интерпретации...", icon: <Sparkles className="w-4 h-4" />, done: false },
    { id: 5, label: "Формирование рекомендаций...", icon: <Lightbulb className="w-4 h-4" />, done: false },
  ];

  const handleGenerate = () => {
    if (!subject) return;
    setReportSubject(subject);
    setReportMunicipality(municipality);
    setReportHorizon(horizon);
    setReportState("generating");
    setProgress(0);
    setSteps(allSteps.map((s) => ({ ...s, done: false })));
  };

  useEffect(() => {
    if (reportState !== "generating") return;

    const totalDuration = 3800;
    const stepDuration = totalDuration / allSteps.length;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 80;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(pct);

      const completedCount = Math.floor(elapsed / stepDuration);
      setSteps((prev) =>
        prev.map((s, i) => ({ ...s, done: i < completedCount }))
      );

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setProgress(100);
        setSteps((prev) => prev.map((s) => ({ ...s, done: true })));
        setTimeout(() => setReportState("ready"), 400);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [reportState]);

  const displayName =
    reportMunicipality || reportSubject || "Тюменская область";
  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <AIReportHeader
        subject={subject}
        municipality={municipality}
        horizon={horizon}
        onSubjectChange={setSubject}
        onMunicipalityChange={setMunicipality}
        onHorizonChange={setHorizon}
        onGenerate={handleGenerate}
        onExportPDF={() => {}}
        onExportWord={() => {}}
        isGenerating={reportState === "generating"}
      />

      <main className="flex-1 overflow-auto custom-scrollbar relative bg-[#0F172A]">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-gradient-radial from-violet-900/20 via-indigo-900/10 to-transparent blur-[120px]" />
        </div>

        <div className="relative z-10 flex items-start justify-center min-h-full py-10 px-6">

          {/* ─── EMPTY STATE ─── */}
          {reportState === "empty" && (
            <div className="flex flex-col items-center justify-center gap-6 mt-20 text-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_60px_rgba(99,102,241,0.1)]">
                  <FileSearch className="w-12 h-12 text-slate-600" />
                </div>
                {/* Corner sparkles */}
                <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-indigo-400/60 animate-pulse" />
                <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-violet-400/50 animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-200">
                  Отчёт не сформирован
                </h2>
                <p className="text-slate-500 max-w-sm leading-relaxed">
                  Выберите субъект РФ и муниципалитет, задайте горизонт
                  прогнозирования и нажмите{" "}
                  <span className="text-indigo-400 font-medium">
                    «Сформировать справку»
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2 items-start mt-2 bg-white/5 border border-white/10 rounded-2xl p-5 text-left max-w-xs w-full">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Что будет в справке</p>
                {[
                  "Динамика численности населения",
                  "Тренды и факторы изменений",
                  "Оценка ИИ-прогноза",
                  "Стратегические рекомендации",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── GENERATING STATE ─── */}
          {reportState === "generating" && (
            <div className="flex flex-col items-center justify-center gap-8 mt-16 w-full max-w-md">
              {/* Pulsing aura ring */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-violet-600/30 to-indigo-600/30 blur-2xl animate-pulse" />
                <div className="absolute w-28 h-28 rounded-full border-2 border-violet-500/30 animate-[spin_4s_linear_infinite]" />
                <div className="absolute w-36 h-36 rounded-full border border-indigo-500/20 animate-[spin_6s_linear_infinite_reverse]" />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center backdrop-blur-sm shadow-[0_0_40px_rgba(139,92,246,0.4)]">
                  <Sparkles className="w-9 h-9 text-violet-300 animate-pulse" />
                </div>
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-xl font-semibold text-white">Генерация справки...</h2>
                <p className="text-sm text-slate-400">{displayName}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Прогресс</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 transition-all duration-100 shadow-[0_0_10px_rgba(139,92,246,0.6)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="w-full space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                      step.done
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : progress > ((step.id - 1) / steps.length) * 100
                        ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300 animate-pulse"
                        : "bg-white/5 border-white/10 text-slate-600"
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <span className="shrink-0">{step.icon}</span>
                    )}
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── READY STATE: A4 Document ─── */}
          {reportState === "ready" && (
            <div
              className="w-full max-w-[794px] mx-auto rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden"
              style={{ background: "#F8F7F4" }}
            >
              {/* Document top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />

              <div className="px-16 py-12 text-[#1a1a2e]">

                {/* Official Header */}
                <div className="text-center mb-10 pb-8 border-b border-slate-200">
                  <p className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-3">
                    Российская Федерация — {reportSubject}
                  </p>
                  <h1
                    className="text-3xl text-slate-900 mb-2 leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}
                  >
                    Демографический анализ
                  </h1>
                  <h2
                    className="text-xl text-indigo-700 mb-5"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 600 }}
                  >
                    {displayName}
                  </h2>

                  <div className="flex items-center justify-center gap-6 text-xs text-slate-500 flex-wrap">
                    <span>Дата формирования: <strong className="text-slate-700">{today}</strong></span>
                    <span className="w-px h-3 bg-slate-300 hidden sm:block" />
                    <span>Модель: <strong className="text-slate-700">Prophet (Meta)</strong></span>
                    <span className="w-px h-3 bg-slate-300 hidden sm:block" />
                    <span>Горизонт прогноза: <strong className="text-slate-700">{reportHorizon} лет</strong></span>
                    <span className="w-px h-3 bg-slate-300 hidden sm:block" />
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      <strong className="text-emerald-700">Верифицировано ИИ</strong>
                    </span>
                  </div>
                </div>

                {/* Section 1: Dynamics */}
                <Section number="1" title="Динамика численности населения (2018–2024)">
                  <p className="mb-3 leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                    За период с 2018 по 2024 год численность постоянного населения{" "}
                    <strong>{displayName}</strong> претерпела существенные изменения.
                    Общая численность населения сократилась на{" "}
                    <Highlight>2,3%</Highlight>, составив по итогам 2024 года{" "}
                    <Highlight>589 400 чел.</Highlight> против{" "}
                    <Highlight>603 200 чел.</Highlight> в 2018 году.
                  </p>
                  <p className="mb-3 leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                    Наиболее значительный спад зафиксирован в 2020–2021 годах (
                    <Highlight negative>−1,1%</Highlight> в год), что
                    обусловлено избыточной смертностью в период пандемии COVID-19.
                    Начиная с 2022 года наблюдается частичная стабилизация: годовое
                    снижение составляет не более <Highlight negative>0,4%</Highlight>.
                    Коэффициент естественного прироста на 2024 год равен{" "}
                    <Highlight negative>−3,1 ‰</Highlight>.
                  </p>

                  {/* Mini stats row */}
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    {[
                      { label: "Население 2024", value: "589 400", unit: "чел.", color: "indigo" },
                      { label: "Изменение 2018–24", value: "−2,3", unit: "%", color: "rose" },
                      { label: "Рождаемость (2024)", value: "9,4", unit: "‰", color: "amber" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className={`rounded-xl p-3 text-center border ${
                          s.color === "indigo"
                            ? "bg-indigo-50 border-indigo-100"
                            : s.color === "rose"
                            ? "bg-rose-50 border-rose-100"
                            : "bg-amber-50 border-amber-100"
                        }`}
                      >
                        <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                        <p
                          className={`text-2xl font-bold ${
                            s.color === "indigo"
                              ? "text-indigo-700"
                              : s.color === "rose"
                              ? "text-rose-600"
                              : "text-amber-600"
                          }`}
                        >
                          {s.value}
                          <span className="text-sm ml-1 font-medium">{s.unit}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Section 2: Trends & Factors */}
                <Section number="2" title="Тренды и факторы изменений">
                  <p className="mb-4 leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                    Демографическая динамика определяется комплексом взаимосвязанных
                    факторов, среди которых выделяются следующие ключевые:
                  </p>
                  <ul className="space-y-3">
                    {[
                      {
                        cat: "Миграционные процессы",
                        color: "bg-blue-500",
                        text: "Устойчивый миграционный отток молодёжи в возрасте 18–29 лет в крупные региональные центры (−4 200 чел./год). Частично компенсируется притоком трудовых мигрантов из стран СНГ (+1 800 чел./год), что обеспечивает нетто-миграцию на уровне −2 400 чел. в год.",
                      },
                      {
                        cat: "Климатические и экологические факторы",
                        color: "bg-teal-500",
                        text: "Суровые климатические условия формируют дополнительный стимул к эмиграции среди экономически активного населения. Экологическая обстановка оценивается как удовлетворительная; индекс экологической нагрузки составляет 0,42 (ниже среднероссийского).",
                      },
                      {
                        cat: "Экономические драйверы",
                        color: "bg-violet-500",
                        text: "Уровень безработицы в 2024 году — 5,8%, что превышает среднероссийский показатель на 1,2 п.п. Среднедушевой доход составляет 82% от среднефедерального значения, что снижает привлекательность территории для постоянного проживания.",
                      },
                      {
                        cat: "Социальная инфраструктура",
                        color: "bg-amber-500",
                        text: "Обеспеченность местами в дошкольных учреждениях — 94%, медицинскими койками — 78 на 10 000 жителей (−12% к нормативу). Дефицит мест в средних школах составляет порядка 3 400 мест.",
                      },
                    ].map((item) => (
                      <li key={item.cat} className="flex gap-3">
                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                        <div>
                          <p className="font-semibold text-slate-800 text-sm mb-0.5">{item.cat}</p>
                          <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                            {item.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Section>

                {/* Section 3: AI Forecast Assessment */}
                <Section number="3" title="Оценка ИИ-прогноза">
                  <div className="flex items-start gap-3 mb-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                    <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-indigo-700 leading-relaxed">
                      Прогноз рассчитан моделью{" "}
                      <strong>Prophet (Meta)</strong> с 95% доверительным
                      интервалом. MAPE модели: <strong>1,8%</strong>. Прогнозный
                      горизонт: <strong>{reportHorizon} лет</strong>. Синхронизация
                      исторических данных: <strong>2023</strong>.
                    </p>
                  </div>
                  <p className="mb-3 leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                    Модель Prophet демонстрирует устойчивый тренд на умеренное
                    сокращение численности населения. При сохранении текущих
                    условий ожидается снижение до{" "}
                    <Highlight negative>~561 000 чел.</Highlight> к{" "}
                    {2024 + parseInt(reportHorizon)} году (базовый сценарий).
                  </p>
                  <p className="mb-3 leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                    <strong>Оптимистичный сценарий</strong> (верхняя граница
                    доверительного интервала) предполагает стабилизацию на уровне{" "}
                    <Highlight>~578 000 чел.</Highlight> при условии реализации
                    программ стимулирования рождаемости и удержания молодёжи.{" "}
                    <strong>Пессимистичный сценарий</strong> допускает падение до{" "}
                    <Highlight negative>~544 000 чел.</Highlight> в случае усиления
                    миграционного оттока.
                  </p>
                  <p className="leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                    Высокий MAPE-показатель модели (1,8%) свидетельствует о
                    высокой точности исторической калибровки. Тем не менее
                    нелинейные шоки (экономические кризисы, миграционные волны)
                    выходят за рамки стандартных предположений Prophet и требуют
                    сценарного дополнения.
                  </p>
                </Section>

                {/* Section 4: Recommendations */}
                <Section number="4" title="Стратегические рекомендации" isLast>
                  <p className="mb-4 leading-relaxed text-slate-600" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                    На основании проведённого анализа и прогнозных оценок
                    рекомендуется реализация следующих мер региональной политики:
                  </p>
                  <ol className="space-y-4">
                    {[
                      {
                        n: "01",
                        title: "Программа удержания молодёжи",
                        text: "Разработать и финансировать региональную программу поддержки молодых специалистов: льготная ипотека, целевые выплаты при трудоустройстве в приоритетных отраслях, развитие городской среды. Целевой показатель: сокращение молодёжного оттока на 30% к 2027 году.",
                        color: "indigo",
                      },
                      {
                        n: "02",
                        title: "Стимулирование рождаемости",
                        text: "Ввести дополнительный региональный материнский капитал (от 300 000 ₽) при рождении второго и последующих детей. Реализовать программу расширения мест в ДОУ на 2 500 единиц к 2026 году. Таргетировать коэффициент рождаемости на уровне 1,65 к 2030 году.",
                        color: "emerald",
                      },
                      {
                        n: "03",
                        title: "Привлечение экономически активных мигрантов",
                        text: "Запустить программу «Новый житель»: упрощённое оформление документов, жильё по льготным ценам, языковые курсы и программы интеграции для квалифицированных специалистов из СНГ. Целевой нетто-миграционный прирост: +1 500 чел./год к 2026 году.",
                        color: "blue",
                      },
                      {
                        n: "04",
                        title: "Развитие экономической базы",
                        text: "Создать особую экономическую зону муниципального уровня с налоговыми льготами для работодателей, открывающих рабочие места с заработной платой выше 120% среднерегионального уровня. Ориентир: создание 5 000 новых рабочих мест к 2028 году.",
                        color: "violet",
                      },
                      {
                        n: "05",
                        title: "Мониторинг и корректировка политики",
                        text: "Внедрить квартальный цикл демографического мониторинга с использованием настоящей ИИ-системы прогнозирования. Пересматривать параметры модели и корректировать программные меры не реже одного раза в год на основе фактических данных.",
                        color: "amber",
                      },
                    ].map((rec) => (
                      <li
                        key={rec.n}
                        className={`flex gap-4 p-4 rounded-xl border ${
                          rec.color === "indigo"
                            ? "bg-indigo-50/70 border-indigo-100"
                            : rec.color === "emerald"
                            ? "bg-emerald-50/70 border-emerald-100"
                            : rec.color === "blue"
                            ? "bg-blue-50/70 border-blue-100"
                            : rec.color === "violet"
                            ? "bg-violet-50/70 border-violet-100"
                            : "bg-amber-50/70 border-amber-100"
                        }`}
                      >
                        <span
                          className={`text-2xl font-black shrink-0 ${
                            rec.color === "indigo"
                              ? "text-indigo-200"
                              : rec.color === "emerald"
                              ? "text-emerald-200"
                              : rec.color === "blue"
                              ? "text-blue-200"
                              : rec.color === "violet"
                              ? "text-violet-200"
                              : "text-amber-200"
                          }`}
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {rec.n}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800 mb-1 text-sm">{rec.title}</p>
                          <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                            {rec.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Section>

                {/* Document Footer */}
                <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
                  <span>Сформировано ИИ-системой демографического прогнозирования · Prophet (Meta) v1.4</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    Автоматически верифицировано
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

/* ── Small helpers ── */
function Section({
  number,
  title,
  children,
  isLast,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <section className={`mb-8 ${!isLast ? "pb-8 border-b border-slate-200" : ""}`}>
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full w-6 h-6 flex items-center justify-center shrink-0"
        >
          {number}
        </span>
        <h3
          className="text-lg text-slate-900"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
        >
          {title}
        </h3>
      </div>
      <div className="text-sm text-slate-700">{children}</div>
    </section>
  );
}

function Highlight({
  children,
  negative,
}: {
  children: React.ReactNode;
  negative?: boolean;
}) {
  return (
    <strong
      className={`font-semibold ${
        negative ? "text-rose-600" : "text-indigo-700"
      }`}
    >
      {children}
    </strong>
  );
}