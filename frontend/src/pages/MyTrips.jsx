import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  Users,
  Download,
  Eye,
  Trash2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plane,
  Hotel,
  Clock,
  Printer,
  X,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { getTrips, cancelBooking } from '../api/endpoints';
import { useApp } from '../context/AppContext';

const initialTrips = [
  {
    id: 'TRIP-GOA-001',
    bookingId: 'BK-VP-2024-9428',
    origin: 'Chennai (MAA)',
    destination: 'Goa (GOI)',
    travelers: 2,
    startDate: '2024-11-20',
    endDate: '2024-11-22',
    status: 'CONFIRMED',
    totalCost: 27500,
    flight: 'IndiGo 6E-2041 (Non-stop)',
    hotel: 'Seaside Comfort Inn (Calangute)',
    simulated: true,
  },
  {
    id: 'TRIP-MAN-002',
    bookingId: 'BK-VP-2024-3119',
    origin: 'Delhi (DEL)',
    destination: 'Manali',
    travelers: 4,
    startDate: '2024-12-01',
    endDate: '2024-12-05',
    status: 'PLANNING',
    totalCost: 65000,
    flight: 'Air India AI-884',
    hotel: 'Solang Valley Resort',
    simulated: true,
  },
  {
    id: 'TRIP-JAI-003',
    bookingId: 'BK-VP-2024-1082',
    origin: 'Mumbai (BOM)',
    destination: 'Jaipur',
    travelers: 3,
    startDate: '2024-10-10',
    endDate: '2024-10-12',
    status: 'COMPLETED',
    totalCost: 42000,
    flight: 'IndiGo 6E-551',
    hotel: 'Jai Mahal Palace',
    simulated: true,
  },
];

export default function MyTrips() {
  const { addNotification } = useApp();
  const [trips, setTrips] = useState(initialTrips);
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [cancellingTrip, setCancellingTrip] = useState(null);

  useEffect(() => {
    getTrips()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const merged = res.data.map((t, i) => ({
            id: t.id || `TRIP-${i}`,
            bookingId: t.bookingId || `BK-VP-2024-${8000 + i}`,
            origin: t.origin || 'Chennai',
            destination: t.destination || 'Goa',
            travelers: t.travelers || 2,
            startDate: t.startDate || '2024-11-20',
            endDate: t.endDate || '2024-11-22',
            status: t.status || 'CONFIRMED',
            totalCost: t.totalCost || 27500,
            flight: 'IndiGo 6E-2041',
            hotel: 'Seaside Comfort Inn',
            simulated: true,
          }));
          setTrips(merged);
        }
      })
      .catch(() => {});
  }, []);

  const handleCancelClick = (trip) => {
    setCancellingTrip(trip);
  };

  const confirmCancel = () => {
    if (!cancellingTrip) return;
    setTrips((prev) =>
      prev.map((t) =>
        t.id === cancellingTrip.id ? { ...t, status: 'CANCELLED' } : t
      )
    );
    cancelBooking(cancellingTrip.bookingId).catch(() => {});
    addNotification({
      type: 'warning',
      message: `Booking ${cancellingTrip.bookingId} has been successfully cancelled (Simulated).`,
    });
    setCancellingTrip(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <GlassCard hover={false} className="border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-2 border border-blue-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> REPOSITORIES & BOOKING VOUCHERS
            </div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-500" /> My Trips & Bookings
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Audit trail, itinerary logs, and downloadable simulated travel vouchers
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-white/50 uppercase font-medium">Saved Records</span>
            <p className="text-2xl font-extrabold text-white">{trips.length} Portfolios</p>
          </div>
        </div>
      </GlassCard>

      {/* Trips list */}
      <div className="space-y-4">
        {trips.map((trip) => (
          <GlassCard key={trip.id} className="border border-white/10 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Route & Booking ID */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">
                    {trip.origin} → {trip.destination}
                  </h3>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      trip.status === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : trip.status === 'CANCELLED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : trip.status === 'COMPLETED'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>
                <p className="text-xs text-white/50 font-mono">
                  Booking Ref: <span className="text-cyan-400 font-bold">{trip.bookingId}</span> • [SIMULATED]
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {trip.startDate} to {trip.endDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    {trip.travelers} Travelers
                  </span>
                  <span className="flex items-center gap-1">
                    <Plane className="w-3.5 h-3.5 text-cyan-400" />
                    {trip.flight}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hotel className="w-3.5 h-3.5 text-emerald-400" />
                    {trip.hotel}
                  </span>
                </div>
              </div>

              {/* Price & Action buttons */}
              <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/10">
                <div className="text-right">
                  <span className="text-xs text-white/40">Total Charged</span>
                  <p className="text-2xl font-extrabold text-emerald-400">
                    ₹{trip.totalCost.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveVoucher(trip)}
                    className="text-xs"
                  >
                    <Download className="w-4 h-4" /> View Voucher
                  </Button>

                  {trip.status === 'CONFIRMED' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelClick(trip)}
                      className="text-xs"
                    >
                      <Trash2 className="w-4 h-4" /> Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Prominent Simulated Voucher Modal */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-blue-500/30 shadow-2xl relative overflow-hidden"
          >
            {/* Header with prominent simulated banner */}
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-center font-bold text-xs uppercase tracking-wider mb-6">
              ⚠️ SIMULATED TRAVEL VOUCHER — NOT A VALID AIRLINE BOARDING PASS OR PAYMENT RECEIPT
            </div>

            <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white gradient-text">
                  VoyagePilot AI Travel Voucher
                </h2>
                <p className="text-xs text-white/50">TBO Hackathon 4.0 B2B Prototype Generation</p>
              </div>
              <button
                onClick={() => setActiveVoucher(null)}
                className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Body Details */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div>
                  <span className="text-white/40 block">Booking Reference</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">
                    {activeVoucher.bookingId}
                  </span>
                </div>
                <div>
                  <span className="text-white/40 block">Status</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {activeVoucher.status}
                  </span>
                </div>
                <div>
                  <span className="text-white/40 block">Travel Dates</span>
                  <span className="font-bold text-white text-sm">
                    {activeVoucher.startDate} – {activeVoucher.endDate}
                  </span>
                </div>
                <div>
                  <span className="text-white/40 block">Travelers</span>
                  <span className="font-bold text-white text-sm">
                    {activeVoucher.travelers} Adults
                  </span>
                </div>
              </div>

              {/* Flight Section */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-blue-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Plane className="w-4 h-4" /> Flight Reservation (Simulated)
                  </span>
                  <span>IndiGo 6E-2041 (MAA → GOI)</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Departure: 06:15 AM (Chennai)</span>
                  <span>Arrival: 08:00 AM (Goa)</span>
                </div>
                <div className="text-white/40">Includes 15kg check-in baggage per person. Free cancellation within 24h.</div>
              </div>

              {/* Hotel Section */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-purple-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Hotel className="w-4 h-4" /> Hotel Accommodation (Simulated)
                  </span>
                  <span>Seaside Comfort Inn, Calangute</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Room: Deluxe Double (Balcony)</span>
                  <span>Nights: 2 Nights</span>
                </div>
                <div className="text-white/40">Includes complimentary breakfast and pool access. Free cancellation up to 48h.</div>
              </div>

              {/* Price summary */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-emerald-300 font-bold text-sm block">Total Amount Paid</span>
                  <span className="text-[10px] text-white/50">Simulated test payment via demo account</span>
                </div>
                <span className="text-2xl font-extrabold text-emerald-400">
                  ₹{activeVoucher.totalCost.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setActiveVoucher(null)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer className="w-4 h-4" /> Print / Save Voucher
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal for Cancellation */}
      {cancellingTrip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-3xl p-6 max-w-md w-full border border-rose-500/30 shadow-2xl"
          >
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Confirm Simulated Cancellation</h3>
            </div>
            <p className="text-xs text-white/70 mb-4 leading-relaxed">
              Are you sure you want to cancel booking{' '}
              <span className="font-mono text-cyan-400 font-bold">
                {cancellingTrip.bookingId}
              </span>{' '}
              ({cancellingTrip.origin} → {cancellingTrip.destination})? This will update the reservation record to CANCELLED in simulated storage.
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setCancellingTrip(null)}>
                Keep Booking
              </Button>
              <Button variant="danger" size="sm" onClick={confirmCancel}>
                Confirm Cancellation
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
