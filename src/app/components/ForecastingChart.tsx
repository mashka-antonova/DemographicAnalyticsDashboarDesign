import { BentoCard } from "./ui/bento-card";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceDot, ReferenceLine } from "recharts";
import { useId } from "react";

const chartData = [
  { year: 2015, historical: 300000 },
  { year: 2016, historical: 302500 },
  { year: 2017, historical: 304000 },
  { year: 2018, historical: 306200 },
  { year: 2019, historical: 308500 },
  { year: 2020, historical: 309000 },
  { year: 2021, historical: 310500 },
  { year: 2022, historical: 312000 },
  { 
    year: 2023, 
    historical: 315000, 
    forecast: 315000, 
    interval: [315000, 315000]
  },
  { year: 2024, forecast: 317500, interval: [314000, 321000] },
  { year: 2025, forecast: 320000, interval: [313000, 326000] },
  { year: 2026, forecast: 322500, interval: [312000, 332000] },
  { year: 2027, forecast: 325000, interval: [310500, 338000] },
  { year: 2028, forecast: 327000, interval: [308000, 345000] },
  { year: 2029, forecast: 329000, interval: [305000, 352000] },
  { year: 2030, forecast: 331000, interval: [302000, 360000] },
];

const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

export function ForecastingChart() {
  const uid = useId();
  const gradientId = `colorInterval-${uid.replace(/:/g, "")}`;

  return (
    <BentoCard className="flex flex-col flex-1 min-h-[500px] p-6">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">Прогноз численности населения</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_#10B981]"></span>
          <span className="text-xs font-medium text-[#10B981]">Модель обучена</span>
        </div>
      </div>
      
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="rgba(255,255,255,0.3)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'monospace' }} 
              tickMargin={10}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'monospace' }}
              tickFormatter={(value) => `${value / 1000}k`}
              tickMargin={10}
            />
            
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const hist = payload.find(p => p.dataKey === 'historical');
                  const fore = payload.find(p => p.dataKey === 'forecast');
                  const interval = payload.find(p => p.dataKey === 'interval');
                  
                  return (
                    <div className="bg-[#0F172A]/90 border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-xl">
                      <p className="text-white font-bold mb-2 font-mono text-lg">{label}</p>
                      
                      {hist && hist.value && (
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          <span className="text-slate-300 text-sm">Исторические данные:</span>
                          <span className="text-white font-mono font-medium ml-auto">{formatNumber(hist.value as number)}</span>
                        </div>
                      )}
                      
                      {fore && fore.value && (
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                          <span className="text-slate-300 text-sm">Прогноз:</span>
                          <span className="text-cyan-400 font-mono font-bold ml-auto">{formatNumber(fore.value as number)}</span>
                        </div>
                      )}
                      
                      {interval && interval.value && Array.isArray(interval.value) && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Оптимистичный (верхний):</span>
                            <span className="text-emerald-400 font-mono">{formatNumber(interval.value[1])}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Пессимистичный (нижний):</span>
                            <span className="text-rose-400 font-mono">{formatNumber(interval.value[0])}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <ReferenceLine x={2023} stroke="rgba(6,182,212,0.4)" strokeDasharray="3 3" />

            {/* Confidence Interval Area */}
            <Area 
              type="monotone" 
              dataKey="interval" 
              stroke="none" 
              fill={`url(#${gradientId})`} 
              isAnimationActive={true}
            />

            {/* Historical Data Line */}
            <Line 
              type="monotone" 
              dataKey="historical" 
              stroke="#2563EB" 
              strokeWidth={4}
              dot={{ r: 0, fill: '#2563EB', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
              isAnimationActive={true}
            />
            
            {/* Forecast Data Line */}
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke="#22D3EE" 
              strokeWidth={3}
              strokeDasharray="6 6"
              dot={{ r: 0, fill: '#22D3EE', strokeWidth: 0 }}
              activeDot={{ r: 8, fill: '#22D3EE', strokeWidth: 3, stroke: '#0F172A' }}
              isAnimationActive={true}
            />

            {/* Sync Point - The hand-off at 2023 */}
            <ReferenceDot x={2023} y={315000} r={6} fill="#0F172A" stroke="#22D3EE" strokeWidth={3} />
            <ReferenceDot x={2023} y={315000} r={12} fill="rgba(34, 211, 238, 0.2)" stroke="none" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend below chart */}
      <div className="flex items-center justify-center gap-8 mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-[#2563EB] rounded-full"></div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Исторические данные</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 border-b-2 border-dashed border-[#22D3EE]"></div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Линия прогноза</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-b from-[#06B6D4]/30 to-transparent border border-[#06B6D4]/20 rounded-sm"></div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">95% Доверительный интервал</span>
        </div>
      </div>
    </BentoCard>
  );
}