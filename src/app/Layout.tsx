import { Outlet } from "react-router";
import { Sidebar } from "./components/Sidebar";

export function Layout() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
      <div className="h-screen w-screen bg-[#0F172A] text-slate-200 flex overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
}
