import { BentoCard } from "./ui/bento-card";
import { Maximize2, Layers } from "lucide-react";

export function Heatmap() {
  return (
    <BentoCard className="flex flex-col flex-1 w-full h-full min-h-[400px] relative group overflow-hidden border border-white/10 shadow-[inset_0_0_50px_rgba(139,92,246,0.05)]">
      <div className="absolute top-6 left-6 z-10">
        <h2 className="text-xl font-bold tracking-tight text-white mb-1">Демографическая тепловая карта</h2>
        <p className="text-sm font-medium text-slate-400">Плотность населения и изменения</p>
      </div>

      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300">
          <Layers className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Abstract Glowing Map Visuals */}
      <div className="absolute inset-0 z-0">
        {/* Base Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-violet-600/30 via-indigo-900/10 to-transparent blur-[100px] pointer-events-none" />
        
        {/* Mock Data Points */}
        <div className="relative w-full h-full">
          {/* Point 1: High Density (Cyan) */}
          <div className="absolute top-1/3 left-1/4 group/point">
            <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_4px_rgba(34,211,238,0.6)] animate-pulse" />
            <div className="w-12 h-12 rounded-full border border-cyan-400/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover/point:block z-20 w-48 bg-[#0F172A]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl transition-all opacity-0 group-hover/point:opacity-100">
              <p className="text-xs font-semibold text-cyan-400 mb-1">Московская область</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Плотность</span>
                <span className="text-white font-medium">8.5M</span>
              </div>
            </div>
          </div>

          {/* Point 2: Medium Density (Violet) */}
          <div className="absolute top-1/2 left-1/2 group/point">
            <div className="w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_15px_3px_rgba(167,139,250,0.5)]" />
            
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover/point:block z-20 w-48 bg-[#0F172A]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl transition-all opacity-0 group-hover/point:opacity-100">
              <p className="text-xs font-semibold text-violet-400 mb-1">Свердловская область</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Плотность</span>
                <span className="text-white font-medium">4.2M</span>
              </div>
            </div>
          </div>

          {/* Point 3: Low Density (Blue) */}
          <div className="absolute bottom-1/4 right-1/3 group/point">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.4)]" />
            
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover/point:block z-20 w-48 bg-[#0F172A]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl transition-all opacity-0 group-hover/point:opacity-100">
              <p className="text-xs font-semibold text-blue-400 mb-1">Новосибирская область</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Плотность</span>
                <span className="text-white font-medium">2.7M</span>
              </div>
            </div>
          </div>
          
           {/* Point 4: Decline (Coral) */}
          <div className="absolute top-2/3 left-[20%] group/point">
            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_15px_3px_rgba(244,63,94,0.6)]" />
            
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover/point:block z-20 w-48 bg-[#0F172A]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl transition-all opacity-0 group-hover/point:opacity-100">
              <p className="text-xs font-semibold text-rose-400 mb-1">Смоленская область</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Динамика изменения</span>
                <span className="text-white font-medium">-1.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Abstract Grid overlay */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none"
        />
      </div>

      <div className="absolute bottom-6 left-6 z-10 flex gap-4">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400" />
            <span className="text-xs text-slate-400">Высокая плотность</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-400" />
            <span className="text-xs text-slate-400">Средняя</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-xs text-slate-400">Снижение</span>
         </div>
      </div>
    </BentoCard>
  );
}