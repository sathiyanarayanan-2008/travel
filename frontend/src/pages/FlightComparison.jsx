import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane,
  Clock,
  Luggage,
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Search,
  Globe,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { getFlightOffers } from '../api/endpoints';
import { useApp } from '../context/AppContext';

const citiesList = [
  'All',
  'Goa',
  'Manali',
  'Kerala',
  'Jaipur',
  'Hyderabad',
  'Bangalore',
  'Delhi',
  'Tamil Nadu',
  'Dubai',
];

export default function FlightComparison() {
  const { state, setDestination, addNotification } = useApp();
  const currentDest = state.selectedDestination || 'Goa';

  const [flights, setFlights] = useState([]);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [filterStops, setFilterStops] = useState('all');
  const [activeDestFilter, setActiveDestFilter] = useState(currentDest);

  const loadFlights = () => {
    getFlightOffers()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setFlights(res.data);
          const first = res.data.find(f =>
            f.destination.toLowerCase().includes(activeDestFilter.toLowerCase()) ||
            (activeDestFilter === 'Tamil Nadu' && f.destination.toLowerCase().includes('chennai')) ||
            (activeDestFilter === 'Kerala' && f.destination.toLowerCase().includes('kochi')) ||
            (activeDestFilter === 'Manali' && (f.destination.toLowerCase().includes('kullu') || f.destination.toLowerCase().includes('chandigarh')))
          );
          if (first) setSelectedFlightId(first.id);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    setActiveDestFilter(currentDest);
  }, [currentDest]);

  useEffect(() => {
    loadFlights();
  }, [activeDestFilter]);

  const handleSelectFlight = (flight) => {
    setSelectedFlightId(flight.id);
    addNotification({
      type: 'success',
      message: `Selected ${flight.airline} ${flight.flightNo} (${flight.origin} → ${flight.destination}).`,
    });
  };

  const handleDestChange = (dest) => {
    setActiveDestFilter(dest);
    setDestination(dest === 'All' ? 'Goa' : dest);
  };

  const filteredFlights = flights
    .filter((f) => {
      if (activeDestFilter === 'All') return true;
      const target = activeDestFilter.toLowerCase();
      const inDest = f.destination.toLowerCase().includes(target);
      const inOrig = f.origin.toLowerCase().includes(target);
      const tnAlias = target === 'tamil nadu' && (f.destination.toLowerCase().includes('chennai') || f.destination.toLowerCase().includes('madurai'));
      const kerAlias = target === 'kerala' && f.destination.toLowerCase().includes('kochi');
      const manAlias = target === 'manali' && (f.destination.toLowerCase().includes('kullu') || f.destination.toLowerCase().includes('chandigarh'));
      return inDest || inOrig || tnAlias || kerAlias || manAlias;
    })
    .filter((f) => {
      if (filterStops === 'nonstop') return f.stops === 0;
      if (filterStops === '1stop') return f.stops === 1;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'departure') return a.departure.localeCompare(b.departure);
      if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <GlassCard hover={false} className="border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2 border border-cyan-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> MULTI-STATE & CITY SIMULATED FLIGHT FEEDS
            </div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Plane className="w-6 h-6 text-blue-500" /> Multi-Supplier Flight Comparison
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Active Focus: <span className="text-cyan-400 font-bold">{activeDestFilter}</span> • Showing verified mock airline inventory across all Indian states and metro corridors
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/50">Sort by:</span>
            {['price', 'departure', 'duration'].map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`text-xs px-3 py-1.5 rounded-xl capitalize font-medium transition-all cursor-pointer ${
                  sortBy === s
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Destination Filter Chips */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs text-white/40 font-semibold mr-1 flex items-center gap-1 shrink-0">
            <Globe className="w-3.5 h-3.5 text-blue-400" /> Filter State/City:
          </span>
          {citiesList.map((dest) => (
            <button
              key={dest}
              onClick={() => handleDestChange(dest)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeDestFilter === dest
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/5 hover:bg-white/10'
              }`}
            >
              {dest}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Flight Offers List */}
      <div className="space-y-3.5">
        {filteredFlights.length === 0 ? (
          <GlassCard className="text-center py-10 border border-white/10">
            <Plane className="w-10 h-10 text-white/20 mx-auto mb-2" />
            <p className="text-white/60 text-sm">No direct flights found matching {activeDestFilter}.</p>
            <Button size="sm" variant="secondary" className="mt-3" onClick={() => handleDestChange('All')}>
              Show All Flights
            </Button>
          </GlassCard>
        ) : (
          filteredFlights.map((flight) => {
            const isSelected = selectedFlightId === flight.id;
            return (
              <GlassCard
                key={flight.id}
                className={`border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-blue-500 bg-blue-950/20 shadow-lg shadow-blue-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => handleSelectFlight(flight)}
              >
                {flight.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-violet-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl shadow-sm">
                    {flight.badge}
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
                  {/* Airline & Number */}
                  <div className="flex items-center gap-4 lg:w-48">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                      <Plane className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{flight.airline}</h3>
                      <p className="text-xs text-white/50 font-mono">{flight.flightNo}</p>
                      <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-medium mt-1 inline-block">
                        {flight.supplier}
                      </span>
                    </div>
                  </div>

                  {/* Route Schedule */}
                  <div className="flex-1 flex items-center justify-between max-w-md mx-auto w-full">
                    <div className="text-left">
                      <p className="text-xl font-extrabold text-white">{flight.departure}</p>
                      <p className="text-xs text-white/40">{flight.origin}</p>
                    </div>

                    <div className="flex-1 px-6 flex flex-col items-center">
                      <span className="text-xs text-white/50 mb-1">{flight.duration}</span>
                      <div className="w-full flex items-center gap-1.5">
                        <div className="h-0.5 flex-1 bg-white/10 rounded" />
                        <Plane className="w-3.5 h-3.5 text-blue-400 shrink-0 rotate-90" />
                        <div className="h-0.5 flex-1 bg-white/10 rounded" />
                      </div>
                      <span className="text-[11px] text-emerald-400 font-medium mt-1">
                        {flight.stops === 0 ? 'Non-Stop' : `${flight.stops} Stop`}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-extrabold text-white">{flight.arrival}</p>
                      <p className="text-xs text-white/40">{flight.destination}</p>
                    </div>
                  </div>

                  {/* Pricing & Selection */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-60 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/10">
                    <div className="text-right">
                      <span className="text-xs text-white/40 line-through">
                        ₹{flight.originalPrice.toLocaleString()}
                      </span>
                      <p className="text-2xl font-extrabold text-emerald-400">
                        ₹{flight.price.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-white/40">per passenger</span>
                    </div>

                    <Button
                      variant={isSelected ? 'success' : 'primary'}
                      size="sm"
                      className="min-w-[100px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectFlight(flight);
                      }}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Selected
                        </>
                      ) : (
                        'Select'
                      )}
                    </Button>
                  </div>
                </div>

                {/* Extra Policy Bar */}
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Luggage className="w-3.5 h-3.5 text-blue-400" /> {flight.baggage}
                    </span>
                    <span>🍽️ {flight.meals}</span>
                    <span>🛡️ {flight.cancellation}</span>
                  </div>
                  <div className="text-amber-400 font-medium">
                    {flight.availability} seats remaining at this fare
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}
