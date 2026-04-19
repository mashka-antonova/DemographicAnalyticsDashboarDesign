import { useEffect, useRef } from "react";
import { BentoCard } from "./ui/bento-card";
import { Maximize2, Layers, Loader2 } from "lucide-react";

interface HeatmapFeatureProperties {
  name: string;
  density: number;
  population: number;
  region_id?: number;
  mo_id?: number;
}

interface HeatmapFeature {
  type: "Feature";
  properties: HeatmapFeatureProperties;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

interface GeoData {
  type: "FeatureCollection";
  features: HeatmapFeature[];
}

interface HeatmapProps {
  geoData?: GeoData | null;
  isLoading?: boolean;
}

function getDensityColor(density: number): string {
  if (density >= 2000) return "#22D3EE";
  if (density >= 500) return "#8B5CF6";
  if (density >= 100) return "#3B82F6";
  if (density >= 20) return "#10B981";
  return "#F59E0B";
}

function getDensityLabel(density: number): string {
  if (density >= 2000) return "Очень высокая";
  if (density >= 500) return "Высокая";
  if (density >= 100) return "Средняя";
  if (density >= 20) return "Низкая";
  return "Очень низкая";
}

function formatPopulation(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}К`;
  return String(n);
}

export function Heatmap({ geoData, isLoading }: HeatmapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const geoLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof window === "undefined") return;

    // Dynamically import leaflet to avoid SSR issues
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !mapContainerRef.current) return;

      // Fix leaflet default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current!, {
          center: [61.0, 60.0],
          zoom: 3,
          zoomControl: true,
          attributionControl: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
          opacity: 0.15,
        }).addTo(map);

        mapInstanceRef.current = map;
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Update GeoJSON layer when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !geoData) return;

    import("leaflet").then((L) => {
      if (geoLayerRef.current) {
        geoLayerRef.current.remove();
      }

      const layer = L.geoJSON(geoData as any, {
        style: (feature) => {
          const density = feature?.properties?.density ?? 0;
          return {
            fillColor: getDensityColor(density),
            fillOpacity: 0.45,
            color: "rgba(255,255,255,0.3)",
            weight: 1,
          };
        },
        onEachFeature: (feature, leafletLayer) => {
          const { name, density, population } = feature.properties as HeatmapFeatureProperties;
          leafletLayer.bindTooltip(
            `<div style="background:#0F172A;border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:10px 12px;color:#e2e8f0;font-family:Inter,sans-serif;min-width:160px">
              <div style="font-weight:700;font-size:13px;margin-bottom:6px;color:${getDensityColor(density)}">${name}</div>
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px">
                <span style="color:#94a3b8">Численность</span>
                <span style="font-weight:600">${formatPopulation(population)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12px">
                <span style="color:#94a3b8">Плотность</span>
                <span style="font-weight:600">${density.toLocaleString("ru-RU")} чел/км²</span>
              </div>
            </div>`,
            { sticky: true, opacity: 1, className: "leaflet-tooltip-custom" }
          );
          leafletLayer.on("mouseover", (e: any) => e.target.setStyle({ fillOpacity: 0.7 }));
          leafletLayer.on("mouseout", (e: any) => e.target.setStyle({ fillOpacity: 0.45 }));
        },
      });

      layer.addTo(mapInstanceRef.current);
      geoLayerRef.current = layer;

      if (geoData.features.length > 0) {
        try {
          mapInstanceRef.current.fitBounds(layer.getBounds(), { padding: [20, 20] });
        } catch {}
      }
    });
  }, [geoData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <BentoCard className="flex flex-col flex-1 w-full h-full min-h-[400px] relative group overflow-hidden border border-white/10">
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-tooltip-custom { background: transparent !important; border: none !important; box-shadow: none !important; }
        .leaflet-container { background: #0F172A !important; }
        .leaflet-control-zoom a { background: rgba(255,255,255,0.05) !important; color: #e2e8f0 !important; border-color: rgba(255,255,255,0.1) !important; }
        .leaflet-control-zoom a:hover { background: rgba(255,255,255,0.15) !important; }
      `}} />

      <div className="absolute top-6 left-6 z-[1000] pointer-events-none">
        <h2 className="text-xl font-bold tracking-tight text-white mb-1">
          Демографическая тепловая карта
        </h2>
        <p className="text-sm font-medium text-slate-400">Плотность населения по федеральным округам</p>
      </div>

      <div className="absolute top-6 right-6 z-[1000] flex gap-2">
        <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300" aria-label="Слои">
          <Layers className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300" aria-label="На весь экран">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-sm text-slate-400">Загрузка карты...</span>
          </div>
        </div>
      )}

      <div ref={mapContainerRef} className="absolute inset-0 z-0" style={{ width: "100%", height: "100%" }} />

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] flex gap-4 pointer-events-none">
        {[
          { color: "#22D3EE", label: "Очень высокая" },
          { color: "#8B5CF6", label: "Высокая" },
          { color: "#3B82F6", label: "Средняя" },
          { color: "#10B981", label: "Низкая" },
          { color: "#F59E0B", label: "Очень низкая" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span className="text-xs text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}
