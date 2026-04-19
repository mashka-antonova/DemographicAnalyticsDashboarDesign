import { useState, useEffect, useCallback } from "react";
import { Header } from "../components/Header";
import { KPICard } from "../components/KPICard";
import { Heatmap } from "../components/Heatmap";
import { LeaderList } from "../components/LeaderList";
import { useFilters } from "../../hooks/useFilters";
import {
  fetchMonitoringSummary,
  fetchHeatmapData,
  fetchTopDynamics,
} from "../../api/monitoring";
import { getErrorMessage } from "../../utils/errorHandler";

interface Summary {
  population: number;
  populationChange: number;
  populationChangePercent: number;
  birthRate: number;
  deathRate: number;
  naturalGrowth: number;
  migration: number;
}

interface TopDynamics {
  growth: { mo_id: number; name: string; population: number; changePercent: number }[];
  decline: { mo_id: number; name: string; population: number; changePercent: number }[];
}

function Toast({ message, type }: { message: string; type: "error" | "info" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border shadow-xl backdrop-blur-md text-sm font-medium max-w-sm ${
        type === "error"
          ? "bg-rose-900/80 border-rose-500/40 text-rose-200"
          : "bg-slate-800/90 border-white/10 text-slate-200"
      }`}
    >
      {message}
    </div>
  );
}

function formatValue(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}К`;
  return String(n);
}

export function Monitoring() {
  const filters = useFilters();

  const [summary, setSummary] = useState<Summary | null>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [topDynamics, setTopDynamics] = useState<TopDynamics>({ growth: [], decline: [] });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "info" } | null>(null);

  const showToast = useCallback((message: string, type: "error" | "info" = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const loadData = useCallback(
    async (params: { startYear: number; endYear: number; regionId: number | null; moId: number | null }) => {
      setIsLoadingData(true);
      try {
        const [summaryData, heatmap, dynamics] = await Promise.all([
          fetchMonitoringSummary({
            startYear: params.startYear,
            endYear: params.endYear,
            regionId: params.regionId,
            moId: params.moId,
          }),
          fetchHeatmapData({
            startYear: params.startYear,
            endYear: params.endYear,
            regionId: params.regionId,
          }),
          fetchTopDynamics({
            startYear: params.startYear,
            endYear: params.endYear,
            regionId: params.regionId,
          }),
        ]);
        setSummary(summaryData);
        setGeoData(heatmap);
        setTopDynamics(dynamics);
      } catch (err: any) {
        showToast(getErrorMessage(err));
      } finally {
        setIsLoadingData(false);
      }
    },
    [showToast]
  );

  // Load default data after filters are ready
  useEffect(() => {
    if (!filters.isLoadingFilters && filters.availableYears.length > 0) {
      loadData({
        startYear: filters.startYear,
        endYear: filters.endYear,
        regionId: filters.selectedRegionId,
        moId: filters.selectedMoId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.isLoadingFilters]);

  const handleShowClick = () => {
    if (!filters.isYearRangeValid) return;
    loadData({
      startYear: filters.startYear,
      endYear: filters.endYear,
      regionId: filters.selectedRegionId,
      moId: filters.selectedMoId,
    });
  };

  const sparklineBlue = Array.from({ length: 20 }, (_, i) => ({ value: 100 + i * 2 + Math.random() * 10 }));
  const sparklineGreen = Array.from({ length: 20 }, (_, i) => ({ value: 50 + i + Math.random() * 8 }));
  const sparklineRed = Array.from({ length: 20 }, (_, i) => ({ value: 80 - i * 0.5 - Math.random() * 5 }));
  const sparklineNeutral = Array.from({ length: 20 }, () => ({ value: 60 + Math.random() * 5 }));

  return (
    <>
      <Header
        regions={filters.regions}
        municipalities={filters.municipalities}
        availableYears={filters.availableYears}
        selectedRegionId={filters.selectedRegionId}
        selectedMoId={filters.selectedMoId}
        startYear={filters.startYear}
        endYear={filters.endYear}
        isLoadingFilters={filters.isLoadingFilters}
        isLoadingMunicipalities={filters.isLoadingMunicipalities}
        isYearRangeValid={filters.isYearRangeValid}
        onRegionChange={filters.handleRegionChange}
        onMoChange={filters.handleMoChange}
        onStartYearChange={filters.setStartYear}
        onEndYearChange={filters.setEndYear}
        onShowClick={handleShowClick}
        isLoadingData={isLoadingData}
      />

      <main className="flex-1 overflow-auto p-6 md:p-8 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-6 h-full min-h-[900px]">

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 shrink-0">
            <KPICard
              title="Численность населения"
              value={summary ? formatValue(summary.population) : null}
              change={summary?.populationChangePercent ?? null}
              data={sparklineBlue}
              color="neon-blue"
              isLoading={isLoadingData && !summary}
            />
            <KPICard
              title="% изменение (г/г)"
              value={summary ? `${summary.populationChangePercent > 0 ? "+" : ""}${summary.populationChangePercent.toFixed(2)}%` : null}
              change={summary?.populationChangePercent ?? null}
              data={sparklineNeutral}
              color="neutral"
              isLoading={isLoadingData && !summary}
            />
            <KPICard
              title="Рождаемость (на 1000)"
              value={summary?.birthRate ?? null}
              change={-1.2}
              data={sparklineRed}
              color="neon-coral"
              isLoading={isLoadingData && !summary}
            />
            <KPICard
              title="Смертность (на 1000)"
              value={summary?.deathRate ?? null}
              change={-5.4}
              data={sparklineGreen}
              color="neon-mint"
              isLoading={isLoadingData && !summary}
            />
            <KPICard
              title="Естественный прирост"
              value={summary?.naturalGrowth ?? null}
              change={summary?.naturalGrowth ?? null}
              data={sparklineBlue}
              color="neon-blue"
              isLoading={isLoadingData && !summary}
            />
          </div>

          {/* Map + Leader List */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            <div className="lg:col-span-8 flex">
              <Heatmap geoData={geoData} isLoading={isLoadingData && !geoData} />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <LeaderList
                growthData={topDynamics.growth}
                declineData={topDynamics.decline}
                isLoading={isLoadingData && topDynamics.growth.length === 0}
              />
            </div>
          </div>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
