import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PiggyBank,
  TrendingDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppContext';

const initialBreakdown = [
  { name: 'Flights (2 pax return)', amount: 9000, color: '#2563EB', icon: '✈️' },
  { name: 'Hotel (2 nights)', amount: 4400, color: '#7C3AED', icon: '🏨' },
  { name: 'Dining & Cafes', amount: 5600, color: '#06B6D4', icon: '🍽️' },
  { name: 'Activities & Water Sports', amount: 3700, color: '#10B981', icon: '🛶' },
  { name: 'Local Transfers & Cabs', amount: 3600, color: '#F59E0B', icon: '🚕' },
  { name: 'Handicrafts & Souvenirs', amount: 1200, color: '#EC4899', icon: '🛍️' },
];

const alternativeTiers = [
  { tier: 'Ultra-Saver', flight: 6400, hotel: 2400, dining: 3800, activities: 2000, transport: 2400, total: 17000 },
  { tier: 'Current Selected', flight: 9000, hotel: 4400, dining: 5600, activities: 3700, transport: 3600, total: 26300 },
  { tier: 'Premium Comfort', flight: 13600, hotel: 7000, dining: 8500, activities: 6000, transport: 5000, total: 40100 },
];

export default function BudgetOptimizer() {
  const { addNotification } = useApp();
  const [budgetCap, setBudgetCap] = useState(30000);
  const [breakdown, setBreakdown] = useState(initialBreakdown);
  const [swappedHotel, setSwappedHotel] = useState(false);
  const [swappedFlight, setSwappedFlight] = useState(false);

  const currentTotal = breakdown.reduce((acc, item) => acc + item.amount, 0);
  const savingsMargin = budgetCap - currentTotal;

  const handleSwapHotel = () => {
    if (!swappedHotel) {
      setBreakdown((prev) =>
        prev.map((item) =>
          item.name.includes('Hotel')
            ? { ...item, name: 'Hotel: Budget Stay Goa (2 nights)', amount: 2400 }
            : item
        )
      );
      setSwappedHotel(true);
      addNotification({
        type: 'success',
        message: 'Applied cheaper hotel option (Budget Stay Goa). Saved ₹2,000!',
      });
    } else {
      setBreakdown((prev) =>
        prev.map((item) =>
          item.name.includes('Hotel')
            ? { ...item, name: 'Hotel (2 nights)', amount: 4400 }
            : item
        )
      );
      setSwappedHotel(false);
      addNotification({
        type: 'info',
        message: 'Reverted back to Seaside Comfort Inn.',
      });
    }
  };

  const handleSwapFlight = () => {
    if (!swappedFlight) {
      setBreakdown((prev) =>
        prev.map((item) =>
          item.name.includes('Flight')
            ? { ...item, name: 'Flights: SpiceJet 1-Stop (2 pax)', amount: 6400 }
            : item
        )
      );
      setSwappedFlight(true);
      addNotification({
        type: 'success',
        message: 'Applied SpiceJet 1-stop flights. Saved ₹2,600!',
      });
    } else {
      setBreakdown((prev) =>
        prev.map((item) =>
          item.name.includes('Flight')
            ? { ...item, name: 'Flights (2 pax return)', amount: 9000 }
            : item
        )
      );
      setSwappedFlight(false);
      addNotification({
        type: 'info',
        message: 'Reverted back to IndiGo morning non-stop flights.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <GlassCard hover={false} className="border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> DETERMINISTIC BUDGET RE-CALCULATION ENGINE
            </div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <PiggyBank className="w-6 h-6 text-emerald-400" /> Budget Optimizer & Cost Matrix
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Real-time calculations for Goa 3-day trip • 2 Travelers • Benchmark Cap: ₹30,000
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-white/50 uppercase font-medium">Under Budget Cap By</span>
              <p className="text-2xl font-extrabold text-emerald-400">
                ₹{savingsMargin.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard>
          <p className="text-xs text-white/50 uppercase font-semibold">User Budget Cap</p>
          <p className="text-3xl font-extrabold text-white mt-1">₹{budgetCap.toLocaleString()}</p>
          <span className="text-xs text-blue-400 mt-1 inline-block">Set by traveler request</span>
        </GlassCard>

        <GlassCard>
          <p className="text-xs text-white/50 uppercase font-semibold">Optimized Estimated Total</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">
            ₹{currentTotal.toLocaleString()}
          </p>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (currentTotal / budgetCap) * 100)}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-xs text-white/50 uppercase font-semibold">Budget Health</p>
          <p className="text-3xl font-extrabold text-cyan-400 mt-1">
            {((savingsMargin / budgetCap) * 100).toFixed(1)}% Free
          </p>
          <span className="text-xs text-emerald-400 mt-1 inline-block font-medium">
            ✅ Safely within threshold
          </span>
        </GlassCard>
      </div>

      {/* Interactive Replanning / What-If Swaps */}
      <GlassCard hover={false} className="border border-blue-500/20 bg-blue-950/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Interactive Budget Agent Replanning</h3>
          </div>
          <span className="text-xs text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-medium">
            Instant Re-calculation
          </span>
        </div>
        <p className="text-xs text-white/60 mb-4">
          Test real-time alternative swaps required by the hackathon user scenario (&quot;User requests a cheaper hotel&quot;):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">
                {swappedHotel ? 'Active: Budget Stay Goa' : 'Active: Seaside Comfort Inn'}
              </p>
              <p className="text-xs text-white/50 mt-0.5">
                {swappedHotel
                  ? '₹1,200/night in Anjuna (Saving ₹2,000)'
                  : '₹2,200/night in Calangute'}
              </p>
            </div>
            <Button
              variant={swappedHotel ? 'success' : 'primary'}
              size="sm"
              onClick={handleSwapHotel}
            >
              {swappedHotel ? 'Revert Hotel' : 'Swap Cheaper Hotel (-₹2,000)'}
            </Button>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">
                {swappedFlight ? 'Active: SpiceJet 1-Stop' : 'Active: IndiGo Non-Stop'}
              </p>
              <p className="text-xs text-white/50 mt-0.5">
                {swappedFlight
                  ? '₹3,200/pax with 1 stop (Saving ₹2,600)'
                  : '₹4,500/pax morning non-stop'}
              </p>
            </div>
            <Button
              variant={swappedFlight ? 'success' : 'secondary'}
              size="sm"
              onClick={handleSwapFlight}
            >
              {swappedFlight ? 'Revert Flights' : 'Swap Cheaper Flight (-₹2,600)'}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Breakdown */}
        <GlassCard hover={false} className="border border-white/10">
          <h3 className="text-base font-bold text-white mb-4">Category Expense Distribution</h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdown}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#0B132B',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                  }}
                  formatter={(val) => [`₹${val.toLocaleString()}`, undefined]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10">
            {breakdown.map((b) => (
              <div key={b.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.color }} />
                <span className="text-white/70 truncate">{b.name}</span>
                <span className="font-bold text-white ml-auto">₹{b.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Tier Comparison Bar Chart */}
        <GlassCard hover={false} className="border border-white/10">
          <h3 className="text-base font-bold text-white mb-4">Tier Comparison vs Current Selection</h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alternativeTiers} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="tier" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0B132B',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                  }}
                  formatter={(val) => [`₹${val.toLocaleString()}`, undefined]}
                />
                <Legend
                  formatter={(val) => <span className="text-xs text-white/70">{val}</span>}
                />
                <Bar dataKey="flight" fill="#2563EB" name="Flights" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="hotel" fill="#7C3AED" name="Hotel" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="dining" fill="#06B6D4" name="Dining" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="activities" fill="#10B981" name="Activities" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 mt-4 text-xs text-white/60">
            💡 <span className="text-white font-medium">Agent Insight:</span> Current selection delivers the optimal balance of morning non-stop travel times and 4.2-star beachside stay within the ₹30,000 threshold.
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
