import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Plane,
  Hotel,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Sparkles,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppContext';

const initialDisruptions = [
  {
    id: 'DIS-2024-01',
    type: 'FLIGHT_DELAY',
    severity: 'high',
    title: 'IndiGo 6E-2041 Delayed by 3h 15m (Weather / ATC)',
    description:
      'Flight 6E-2041 (Chennai → Goa) departure shifted from 06:15 AM to 09:30 AM due to coastal airspace clearance delay.',
    affectedBooking: 'BK-VP-2024-9428',
    timestamp: 'Today at 05:20 AM',
    status: 'pending',
    proposal: {
      summary: 'Automated 4-point itinerary adjustment without missing any core attractions:',
      changes: [
        'Rescheduled Airport Cab Pickup in Goa from 08:45 AM to 12:00 PM.',
        'Delayed Seaside Comfort Inn check-in to 12:30 PM (Late arrival pre-notified).',
        'Shifted Britto’s lunch to 1:30 PM and compressed Baga water sports window.',
        'Preserved evening Calangute sunset and Thalassa dinner without conflicts.',
      ],
      costImpact: 0,
    },
  },
  {
    id: 'DIS-2024-02',
    type: 'HOTEL_OVERBOOKED',
    severity: 'medium',
    title: 'Seaside Comfort Inn Overbooking Alert',
    description:
      'Supplier reported deluxe balcony room unavailable for Night 1 due to maintenance plumbing failure.',
    affectedBooking: 'BK-VP-2024-9428',
    timestamp: 'Yesterday at 04:15 PM',
    status: 'resolved',
    proposal: {
      summary: 'Automatic upgrade to Goa Beach Resort (Baga Beach) at zero cost surcharge:',
      changes: [
        'Upgraded from 3-Star Deluxe to 4-Star Superior Sea View.',
        'Complementary dinner buffet included on Night 1.',
        'Zero cost difference (Covered by supplier rate guarantee policy).',
      ],
      costImpact: 0,
    },
  },
];

export default function DisruptionCenter() {
  const { addNotification } = useApp();
  const [disruptions, setDisruptions] = useState(initialDisruptions);

  const handleApprove = (id) => {
    setDisruptions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'approved' } : d))
    );
    addNotification({
      type: 'success',
      message: 'Disruption resolution approved! Saved itinerary timeline automatically updated.',
    });
  };

  const handleReject = (id) => {
    setDisruptions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'rejected' } : d))
    );
    addNotification({
      type: 'info',
      message: 'Resolution rejected. Disruption Agent flagged for manual concierge escalation.',
    });
  };

  const pendingCount = disruptions.filter((d) => d.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <GlassCard hover={false} className="border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold mb-2 border border-rose-500/20">
              <ShieldAlert className="w-3.5 h-3.5" /> AGENTIC DISRUPTION MITIGATION ENGINE
            </div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-400" /> Disruption Center & Autonomous Re-Routing
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Monitors supplier anomalies, proposes intelligent timeline compensations, and enforces human-in-the-loop approval
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                pendingCount > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {pendingCount} Pending Resolution
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Disruptions Stream */}
      <div className="space-y-4">
        {disruptions.map((dis) => (
          <GlassCard
            key={dis.id}
            hover={false}
            className={`border transition-all ${
              dis.status === 'pending'
                ? 'border-amber-500/40 bg-amber-950/10'
                : dis.status === 'approved' || dis.status === 'resolved'
                ? 'border-emerald-500/30 bg-emerald-950/10'
                : 'border-white/10 opacity-75'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-3 rounded-2xl shrink-0 ${
                    dis.type.includes('FLIGHT')
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}
                >
                  {dis.type.includes('FLIGHT') ? (
                    <Plane className="w-6 h-6" />
                  ) : (
                    <Hotel className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-white">{dis.title}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        dis.severity === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {dis.severity} Severity
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mt-1 leading-relaxed">{dis.description}</p>
                  <p className="text-[11px] text-white/40 mt-1.5 font-mono">
                    Affected Booking: <span className="text-cyan-400 font-bold">{dis.affectedBooking}</span> • Logged: {dis.timestamp}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase shrink-0 ${
                  dis.status === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : dis.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : dis.status === 'resolved'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {dis.status}
              </span>
            </div>

            {/* AI Agent Proposal Container */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Disruption Agent Proposed Resolution
                </h4>
                <span className="text-xs text-emerald-400 font-bold">
                  Cost Surcharge: ₹{dis.proposal.costImpact} (Protected)
                </span>
              </div>

              <p className="text-xs text-white/80">{dis.proposal.summary}</p>

              <div className="space-y-1.5 pl-1">
                {dis.proposal.changes.map((change, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{change}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Action Buttons */}
            {dis.status === 'pending' && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <Button variant="danger" size="sm" onClick={() => handleReject(dis.id)}>
                  <XCircle className="w-4 h-4" /> Reject Proposal
                </Button>
                <Button size="sm" onClick={() => handleApprove(dis.id)}>
                  <CheckCircle2 className="w-4 h-4" /> Approve & Update Itinerary
                </Button>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
