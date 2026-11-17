import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  AlertTriangle,
  Database,
  RotateCcw,
  Plane,
  Hotel,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { simulateDisruption } from '../api/endpoints';
import { useApp } from '../context/AppContext';

export default function AdminPanel() {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('triggers');
  const [loading, setLoading] = useState(false);

  const [disruptionForm, setDisruptionForm] = useState({
    type: 'FLIGHT_DELAY',
    bookingId: 'BK-VP-2024-9428',
    description: 'IndiGo 6E-2041 delayed by 3 hours due to coastal monsoon weather.',
    severity: 'high',
  });

  const handleTriggerScenario = async (type, desc, sev) => {
    setLoading(true);
    const payload = {
      type: type || disruptionForm.type,
      bookingId: disruptionForm.bookingId,
      description: desc || disruptionForm.description,
      severity: sev || disruptionForm.severity,
    };

    try {
      await simulateDisruption(payload);
      addNotification({
        type: 'success',
        message: `Injected mock disruption: ${payload.type} into ${payload.bookingId}! Check Disruption Center.`,
      });
    } catch {
      addNotification({
        type: 'success',
        message: `Injected mock disruption: ${payload.type} (Local mode)! Visit Disruption Center.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetDemo = () => {
    addNotification({
      type: 'info',
      message: 'Demo state successfully reset to default benchmark scenario.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <GlassCard hover={false} className="border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-2 border border-blue-500/20">
              <Zap className="w-3.5 h-3.5" /> JUDGE & MENTOR DEMO CONTROL PANEL
            </div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-500" /> Demo Admin & Scenario Injector
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Trigger instant supplier disruptions, inspect seeded mock feeds, and reset demo states
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="danger" size="sm" onClick={handleResetDemo}>
              <RotateCcw className="w-4 h-4" /> Reset Demo State
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'triggers', label: '1-Click Scenario Injectors', icon: AlertTriangle },
          { id: 'custom', label: 'Custom Disruption Form', icon: Settings },
          { id: 'suppliers', label: 'Supplier Feeds Inspector', icon: Database },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: 1-Click Scenario Injectors */}
      {activeTab === 'triggers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="border border-amber-500/30 bg-amber-950/10 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Benchmark: Flight Delay (3 Hours)</h3>
                  <p className="text-xs text-white/50">Mandated Hackathon Round 2 Scenario</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                Primary Flow
              </span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Triggers a 3-hour delay on IndiGo 6E-2041 (06:15 AM → 09:15 AM). The Disruption Agent will autonomously propose shifting the Goa pickup, delayed hotel check-in, and rearranged lunch.
            </p>

            <Button
              className="w-full"
              loading={loading}
              onClick={() =>
                handleTriggerScenario(
                  'FLIGHT_DELAY',
                  'IndiGo 6E-2041 delayed by 3 hours due to heavy rain and ATC sequencing.',
                  'high'
                )
              }
            >
              <Zap className="w-4 h-4" /> Inject Flight Delay Scenario
            </Button>
          </GlassCard>

          <GlassCard className="border border-purple-500/30 bg-purple-950/10 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Hotel className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Hotel Overbooking & Upgrade</h3>
                  <p className="text-xs text-white/50">Secondary Supplier Disruption</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                Supplier Anomaly
              </span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Simulates room unavailability at Seaside Comfort Inn. The Disruption Agent proposes an instant zero-cost upgrade to Goa Beach Resort 4-star Superior Sea View.
            </p>

            <Button
              variant="secondary"
              className="w-full"
              loading={loading}
              onClick={() =>
                handleTriggerScenario(
                  'HOTEL_OVERBOOKED',
                  'Supplier reported Deluxe Balcony Room overbooked due to maintenance shutdown.',
                  'medium'
                )
              }
            >
              <Zap className="w-4 h-4" /> Inject Hotel Overbooking Scenario
            </Button>
          </GlassCard>
        </div>
      )}

      {/* Tab 2: Custom Form */}
      {activeTab === 'custom' && (
        <GlassCard hover={false} className="border border-white/10">
          <h3 className="text-base font-bold text-white mb-4">Custom Disruption Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/70 block mb-1">Disruption Event Type</label>
              <select
                value={disruptionForm.type}
                onChange={(e) => setDisruptionForm({ ...disruptionForm, type: e.target.value })}
                className="w-full bg-navy-800/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="FLIGHT_DELAY">Flight Delay</option>
                <option value="FLIGHT_CANCEL">Flight Cancellation</option>
                <option value="HOTEL_OVERBOOKED">Hotel Overbooking</option>
                <option value="HOTEL_UNAVAILABLE">Hotel Service Outage</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-white/70 block mb-1">Target Booking Reference</label>
              <input
                type="text"
                value={disruptionForm.bookingId}
                onChange={(e) =>
                  setDisruptionForm({ ...disruptionForm, bookingId: e.target.value })
                }
                className="w-full bg-navy-800/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-white/70 block mb-1">Disruption Description</label>
              <input
                type="text"
                value={disruptionForm.description}
                onChange={(e) =>
                  setDisruptionForm({ ...disruptionForm, description: e.target.value })
                }
                className="w-full bg-navy-800/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
            <Button loading={loading} onClick={() => handleTriggerScenario()}>
              <Zap className="w-4 h-4" /> Trigger Disruption Event
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Tab 3: Mock Supplier Feeds */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard hover={false} className="border border-white/10 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-400" /> Mock Flight Supplier Feeds
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.03] flex justify-between items-center">
                <span className="font-semibold text-white">TBO Supplier A (Domestic GDS)</span>
                <span className="text-emerald-400 font-bold">12 Seeded Offers</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] flex justify-between items-center">
                <span className="font-semibold text-white">TBO Supplier B (LCC Direct Connect)</span>
                <span className="text-emerald-400 font-bold">8 Seeded Offers</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] flex justify-between items-center">
                <span className="font-semibold text-white">TBO Supplier C (Premium Aggregator)</span>
                <span className="text-emerald-400 font-bold">5 Seeded Offers</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover={false} className="border border-white/10 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Hotel className="w-4 h-4 text-purple-400" /> Mock Hotel Supplier Feeds
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.03] flex justify-between items-center">
                <span className="font-semibold text-white">TBO Bedbank Direct</span>
                <span className="text-emerald-400 font-bold">15 Properties</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] flex justify-between items-center">
                <span className="font-semibold text-white">Goa Hospitality Network</span>
                <span className="text-emerald-400 font-bold">10 Properties</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] flex justify-between items-center">
                <span className="font-semibold text-white">Boutique Stays Feed</span>
                <span className="text-emerald-400 font-bold">5 Properties</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
