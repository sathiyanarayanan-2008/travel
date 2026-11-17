import { Bell, Search, User, Globe, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const destinations = [
  { id: 'Goa', label: 'Goa', icon: '🌴' },
  { id: 'Manali', label: 'Manali', icon: '🏔️' },
  { id: 'Kerala', label: 'Kerala', icon: '🛶' },
  { id: 'Jaipur', label: 'Jaipur', icon: '🏰' },
  { id: 'Hyderabad', label: 'Hyderabad', icon: '💎' },
  { id: 'Bangalore', label: 'Bangalore', icon: '🌳' },
  { id: 'Delhi', label: 'Delhi', icon: '🏛️' },
  { id: 'Tamil Nadu', label: 'Tamil Nadu', icon: '🛕' },
  { id: 'Dubai', label: 'Dubai', icon: '🏙️' },
];

export default function TopBar() {
  const { state, setDestination, addNotification } = useApp();
  const currentDest = state.selectedDestination || 'Goa';

  const handleSelect = (destId) => {
    setDestination(destId);
    addNotification({
      type: 'info',
      message: `Active travel focus switched to ${destId}.`,
    });
  };

  return (
    <header className="h-auto py-3.5 glass-light flex flex-col xl:flex-row items-center justify-between px-6 mb-6 rounded-2xl gap-3">
      {/* Left: Search input */}
      <div className="flex items-center gap-3 w-full xl:w-72 shrink-0">
        <Search className="w-4 h-4 text-white/30 shrink-0" />
        <input
          type="text"
          placeholder="Search any Indian state or city..."
          className="bg-transparent text-sm text-white/80 placeholder-white/30 outline-none w-full"
        />
      </div>

      {/* Center: Scrollable State / City Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full py-1 scrollbar-none">
        <span className="text-[11px] text-white/40 uppercase font-bold tracking-wider flex items-center gap-1 pr-1 shrink-0">
          <Globe className="w-3.5 h-3.5 text-blue-400" /> State/City:
        </span>
        {destinations.map((d) => (
          <button
            key={d.id}
            onClick={() => handleSelect(d.id)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              currentDest === d.id
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/5 hover:bg-white/10'
            }`}
          >
            <span>{d.icon}</span>
            <span>{d.label}</span>
          </button>
        ))}
      </div>

      {/* Right: Notifications & Agent Info */}
      <div className="flex items-center gap-4 shrink-0 w-full xl:w-auto justify-end">
        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-white/50" />
          {state.notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          )}
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center font-bold text-xs text-white">
            VP
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">Travel Agent</p>
            <p className="text-xs text-cyan-400">TBO Verified</p>
          </div>
        </div>
      </div>
    </header>
  );
}
