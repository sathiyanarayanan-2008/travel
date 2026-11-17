import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, Map, Plane, Hotel, PiggyBank,
  Briefcase, AlertTriangle, Settings, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/copilot', icon: MessageSquare, label: 'AI Copilot' },
  { path: '/itinerary', icon: Map, label: 'Itinerary Builder' },
  { path: '/flights', icon: Plane, label: 'Flight Comparison' },
  { path: '/hotels', icon: Hotel, label: 'Hotel Comparison' },
  { path: '/budget', icon: PiggyBank, label: 'Budget Optimizer' },
  { path: '/trips', icon: Briefcase, label: 'My Trips' },
  { path: '/disruptions', icon: AlertTriangle, label: 'Disruption Center' },
  { path: '/admin', icon: Settings, label: 'Demo Admin' },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const { sidebarOpen } = state;

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen glass z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric to-violet flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <h1 className="text-lg font-bold gradient-text whitespace-nowrap">VoyagePilot AI</h1>
              <p className="text-[10px] text-white/40 whitespace-nowrap">Travel Copilot</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? 'bg-gradient-to-r from-electric/20 to-violet/10 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-electric rounded-r-full"
                />
              )}
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-electric' : ''}`} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Toggle */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        className="p-3 mx-2 mb-4 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors"
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </motion.aside>
  );
}
