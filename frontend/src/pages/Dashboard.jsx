import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plane,
  Hotel,
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Compass,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { getTrips } from '../api/endpoints';

const stats = [
  {
    label: 'Managed Trips',
    value: '18',
    change: '+4 this week',
    icon: Plane,
    color: 'from-blue-600 to-cyan-500',
  },
  {
    label: 'Supplier Offers',
    value: '142',
    change: 'Live mock feeds',
    icon: Hotel,
    color: 'from-violet-600 to-purple-400',
  },
  {
    label: 'Agent Cost Savings',
    value: '₹3.85L',
    change: '14.2% optimized',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-400',
  },
  {
    label: 'Disruption Handlers',
    value: '100%',
    change: 'Zero unhandled delays',
    icon: Users,
    color: 'from-cyan-500 to-blue-400',
  },
];

const defaultRecentTrips = [
  {
    id: 'TRIP-GOA-01',
    destination: 'Goa',
    origin: 'Chennai',
    travelers: 2,
    dates: 'Nov 20 – 22',
    status: 'Confirmed',
    budget: '₹27,500',
  },
  {
    id: 'TRIP-MAN-02',
    destination: 'Manali',
    origin: 'Delhi',
    travelers: 4,
    dates: 'Dec 01 – 05',
    status: 'Planning',
    budget: '₹65,000',
  },
  {
    id: 'TRIP-JAI-03',
    destination: 'Jaipur',
    origin: 'Mumbai',
    travelers: 3,
    dates: 'Dec 10 – 12',
    status: 'Completed',
    budget: '₹42,000',
  },
];

const spendData = [
  { month: 'Jun', flights: 42000, hotels: 31000, activities: 12000 },
  { month: 'Jul', flights: 54000, hotels: 39000, activities: 18000 },
  { month: 'Aug', flights: 37000, hotels: 27000, activities: 14000 },
  { month: 'Sep', flights: 63000, hotels: 48000, activities: 23000 },
  { month: 'Oct', flights: 58000, hotels: 41000, activities: 19000 },
  { month: 'Nov', flights: 49000, hotels: 36000, activities: 16500 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const [recentTrips, setRecentTrips] = useState(defaultRecentTrips);

  useEffect(() => {
    getTrips()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((t) => ({
            id: t.id || t.bookingId || 'TRIP',
            destination: t.destination || 'Goa',
            origin: t.origin || 'Chennai',
            travelers: t.travelers || 2,
            dates: `${t.startDate || 'Nov 20'} – ${t.endDate || 'Nov 22'}`,
            status: t.status || 'Planning',
            budget: `₹${(t.totalCost || t.budget || 30000).toLocaleString()}`,
          }));
          setRecentTrips(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Hero Welcome banner */}
      <motion.div
        variants={itemVariants}
        className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-violet-950/30 to-slate-900/40"
      >
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -top-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5" /> TBO VOYAGEHACK 4.0 PROTOTYPE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              VoyagePilot AI <span className="gradient-text">— Virtual Travel Agent Copilot</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-2xl mt-1.5">
              Autonomous multi-agent orchestration for itinerary planning, real-time mock supplier
              comparisons, verified budgeting, and zero-touch disruption mitigation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/copilot">
              <Button size="lg" className="shadow-lg shadow-blue-600/30">
                <Sparkles className="w-4 h-4" /> Start AI Copilot
              </Button>
            </Link>
            <Link to="/itinerary">
              <Button variant="secondary" size="lg">
                <Compass className="w-4 h-4" /> Smart Itinerary
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <GlassCard key={i} className="relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider font-medium">
                  {stat.label}
                </p>
                <p className="text-3xl font-extrabold mt-1 text-white tracking-tight">
                  {stat.value}
                </p>
                <div className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium mt-2 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> {stat.change}
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Main Insights Chart & Recent Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spend Overview Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard hover={false} className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Travel Expenditure & Margin Trends</h3>
                <p className="text-xs text-white/50">Simulated monthly booking analytics for B2B portal</p>
              </div>
              <span className="text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full font-medium">
                Live Mock Metrics
              </span>
            </div>

            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="flightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="hotelGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="month"
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0B132B',
                      border: '1px solid rgba(37,99,235,0.3)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    }}
                    labelStyle={{ color: '#E2E8F0', fontWeight: 'bold' }}
                    formatter={(val) => [`₹${val.toLocaleString()}`, undefined]}
                  />
                  <Area
                    type="monotone"
                    dataKey="flights"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#flightGrad)"
                    name="Flight Bookings"
                  />
                  <Area
                    type="monotone"
                    dataKey="hotels"
                    stroke="#7C3AED"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#hotelGrad)"
                    name="Hotel Stays"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Trips Panel */}
        <motion.div variants={itemVariants}>
          <GlassCard hover={false} className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Recent Trips</h3>
                  <p className="text-xs text-white/50">Active customer portfolios</p>
                </div>
                <Link
                  to="/trips"
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {recentTrips.slice(0, 3).map((trip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold text-sm text-white">
                          {trip.origin} → {trip.destination}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          trip.status === 'Confirmed' || trip.status === 'CONFIRMED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : trip.status === 'Completed' || trip.status === 'COMPLETED'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {trip.dates}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {trip.travelers} Pax
                      </span>
                      <span className="font-semibold text-emerald-400">{trip.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/copilot" className="mt-4 block">
              <Button variant="secondary" className="w-full text-xs">
                Plan Another Trip via Copilot
              </Button>
            </Link>
          </GlassCard>
        </motion.div>
      </div>

      {/* Interactive Quick Action cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="border border-blue-500/20 bg-blue-950/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Multi-Supplier Flight Grid</h4>
              <p className="text-white/50 text-xs mt-1">
                Compare normalized offers across IndiGo, Air India, SpiceJet with instant seat inventory.
              </p>
              <Link to="/flights" className="inline-block mt-3">
                <span className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                  Compare Flights <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="border border-purple-500/20 bg-purple-950/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400">
              <Hotel className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Hotel Rate Optimizer</h4>
              <p className="text-white/50 text-xs mt-1">
                Inspect 3-star to 5-star properties, transparent cancellation terms, and verified room types.
              </p>
              <Link to="/hotels" className="inline-block mt-3">
                <span className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
                  Compare Hotels <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="border border-cyan-500/20 bg-cyan-950/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-600/20 text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Disruption Center</h4>
              <p className="text-white/50 text-xs mt-1">
                Autonomous delay detection, intelligent re-routing proposals, and agent approval workflows.
              </p>
              <Link to="/disruptions" className="inline-block mt-3">
                <span className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
                  View Disruption Center <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
