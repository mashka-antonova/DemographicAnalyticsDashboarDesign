import { Header } from "../components/Header";
import { KPICard } from "../components/KPICard";
import { Heatmap } from "../components/Heatmap";
import { LeaderList } from "../components/LeaderList";

export function Monitoring() {
  const sparklineDataBlue = Array.from({ length: 20 }, (_, i) => ({ value: 100 + Math.random() * 20 + i * 2 }));
  const sparklineDataGreen = Array.from({ length: 20 }, (_, i) => ({ value: 50 + Math.random() * 10 + i * 1.5 }));
  const sparklineDataRed = Array.from({ length: 20 }, (_, i) => ({ value: 80 - Math.random() * 10 - i }));
  const sparklineDataNeutral = Array.from({ length: 20 }, () => ({ value: 60 + Math.random() * 5 }));

  const growthLeaders = [
    { id: "1", name: "Тюменская область", value: 3.2, max: 4.0 },
    { id: "2", name: "Москва", value: 2.8, max: 4.0 },
    { id: "3", name: "Санкт-Петербург", value: 2.5, max: 4.0 },
    { id: "4", name: "Татарстан", value: 2.1, max: 4.0 },
    { id: "5", name: "Краснодарский край", value: 1.9, max: 4.0 },
    { id: "6", name: "Свердловская область", value: 1.7, max: 4.0 },
    { id: "7", name: "Новосибирская область", value: 1.5, max: 4.0 },
    { id: "8", name: "Челябинская область", value: 1.2, max: 4.0 },
    { id: "9", name: "Самарская область", value: 0.9, max: 4.0 },
    { id: "10", name: "Башкортостан", value: 0.7, max: 4.0 },
  ];

  const declineLeaders = [
    { id: "11", name: "Псковская область", value: -2.8, max: 3.5 },
    { id: "12", name: "Смоленская область", value: -2.5, max: 3.5 },
    { id: "13", name: "Тверская область", value: -2.3, max: 3.5 },
    { id: "14", name: "Тульская область", value: -2.0, max: 3.5 },
    { id: "15", name: "Ивановская область", value: -1.8, max: 3.5 },
    { id: "16", name: "Владимирская область", value: -1.6, max: 3.5 },
    { id: "17", name: "Рязанская область", value: -1.5, max: 3.5 },
    { id: "18", name: "Тамбовская область", value: -1.2, max: 3.5 },
    { id: "19", name: "Курганская область", value: -1.1, max: 3.5 },
    { id: "20", name: "Орловская область", value: -0.9, max: 3.5 },
  ];

  return (
    <>
      <Header />
      
      <main className="flex-1 overflow-auto p-6 md:p-8 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-6 h-full min-h-[900px]">
          
          {/* Top Row: KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 shrink-0">
            <KPICard 
              title="Численность населения" 
              value="146.4M" 
              change={0.15} 
              data={sparklineDataBlue} 
              color="neon-blue" 
            />
            <KPICard 
              title="% изменение (г/г)" 
              value="-0.02%" 
              change={-0.02} 
              data={sparklineDataNeutral} 
              color="neutral" 
            />
            <KPICard 
              title="Рождаемость (на 1000)" 
              value="9.8" 
              change={-1.2} 
              data={sparklineDataRed} 
              color="neon-coral" 
            />
            <KPICard 
              title="Смертность (на 1000)" 
              value="13.1" 
              change={-5.4} 
              data={sparklineDataGreen} 
              color="neon-mint" 
            />
            <KPICard 
              title="Естественный прирост" 
              value="-3.3" 
              change={4.2} 
              data={sparklineDataBlue} 
              color="neon-blue" 
            />
          </div>

          {/* Bottom Area: Map & Lists */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            
            {/* Map block spans 8 columns */}
            <div className="lg:col-span-8 flex">
              <Heatmap />
            </div>

            {/* Lists block spans 4 columns */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <LeaderList
                growthData={growthLeaders}
                declineData={declineLeaders}
              />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}