import { ForecastingHeader } from "../components/ForecastingHeader";
import { ModelAccuracyCard } from "../components/ModelAccuracyCard";
import { ForecastingChart } from "../components/ForecastingChart";
import { Percent, ActivitySquare, Target } from "lucide-react";

export function Forecasting() {
  return (
    <>
      <ForecastingHeader />
      
      <main className="flex-1 overflow-auto p-6 md:p-8 custom-scrollbar relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-[#06B6D4]/5 blur-[120px] pointer-events-none rounded-full transform -translate-y-1/2"></div>
        <div className="max-w-[1600px] mx-auto flex flex-col gap-6 h-full min-h-[900px] relative z-10">
          
          {/* Top Row: Model Accuracy Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
            <ModelAccuracyCard 
              title="MAPE" 
              value="1.8%" 
              subtitle="Средняя абсолютная процентная ошибка"
              colorClass="text-[#10B981] shadow-[#10B981]/20 border-[#10B981]/30"
              icon={<Percent className="w-6 h-6" />}
            />
            <ModelAccuracyCard 
              title="RMSE" 
              value="1,240" 
              subtitle="Среднеквадратическая ошибка"
              colorClass="text-[#38BDF8] shadow-[#38BDF8]/20 border-[#38BDF8]/30"
              icon={<ActivitySquare className="w-6 h-6" />}
            />
            <ModelAccuracyCard 
              title="MAE" 
              value="890" 
              subtitle="Средняя абсолютная ошибка"
              colorClass="text-[#8B5CF6] shadow-[#8B5CF6]/20 border-[#8B5CF6]/30"
              icon={<Target className="w-6 h-6" />}
            />
          </div>

          {/* Central Large Block */}
          <div className="flex-1 flex flex-col">
            <ForecastingChart />
          </div>

        </div>
      </main>
    </>
  );
}