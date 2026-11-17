import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Hotel,
  Star,
  MapPin,
  Wifi,
  Coffee,
  Waves,
  Car,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Globe,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { getHotelOffers } from '../api/endpoints';
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

export default function HotelComparison() {
  const { state, setDestination, addNotification } = useApp();
  const currentDest = state.selectedDestination || 'Goa';

  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [sortBy, setSortBy] = useState('recommended');
  const [activeDestFilter, setActiveDestFilter] = useState(currentDest);

  const loadHotels = () => {
    getHotelOffers()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setHotels(res.data);
          const first = res.data.find(h =>
            (h.destination && h.destination.toLowerCase().includes(activeDestFilter.toLowerCase())) ||
            (h.location && h.location.toLowerCase().includes(activeDestFilter.toLowerCase())) ||
            (activeDestFilter === 'Tamil Nadu' && h.location.toLowerCase().includes('tamil')) ||
            (activeDestFilter === 'Kerala' && (h.location.toLowerCase().includes('kerala') || h.location.toLowerCase().includes('kumarakom') || h.location.toLowerCase().includes('munnar')))
          );
          if (first) setSelectedHotelId(first.id);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    setActiveDestFilter(currentDest);
  }, [currentDest]);

  useEffect(() => {
    loadHotels();
  }, [activeDestFilter]);

  const handleSelectHotel = (hotel) => {
    setSelectedHotelId(hotel.id);
    addNotification({
      type: 'success',
      message: `Selected ${hotel.name} (₹${hotel.pricePerNight.toLocaleString()}/night).`,
    });
  };

  const handleDestChange = (dest) => {
    setActiveDestFilter(dest);
    setDestination(dest === 'All' ? 'Goa' : dest);
  };

  const filteredHotels = hotels
    .filter((h) => {
      if (activeDestFilter === 'All') return true;
      const target = activeDestFilter.toLowerCase();
      const inDest = h.destination && h.destination.toLowerCase().includes(target);
      const inLoc = h.location && h.location.toLowerCase().includes(target);
      const inName = h.name && h.name.toLowerCase().includes(target);
      const tnAlias = target === 'tamil nadu' && (h.location && (h.location.toLowerCase().includes('tamil') || h.location.toLowerCase().includes('chennai') || h.location.toLowerCase().includes('ooty')));
      const kerAlias = target === 'kerala' && (h.location && (h.location.toLowerCase().includes('kerala') || h.location.toLowerCase().includes('kumarakom') || h.location.toLowerCase().includes('munnar')));
      return inDest || inLoc || inName || tnAlias || kerAlias;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <GlassCard hover={false} className="border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-2 border border-purple-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> MULTI-STATE HOTEL INVENTORY — TBO SUPPLIER GRID
            </div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Hotel className="w-6 h-6 text-purple-400" /> Hotel Accommodation Comparison
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Active Location: <span className="text-purple-400 font-bold">{activeDestFilter}</span> • Verified mock hotel properties across premier Indian destinations and international hubs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Sort by:</span>
            {[
              { id: 'recommended', label: 'Recommended' },
              { id: 'price-low', label: 'Lowest Price' },
              { id: 'rating', label: 'Highest Rated' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  sortBy === s.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Destination Filter Chips */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs text-white/40 font-semibold mr-1 flex items-center gap-1 shrink-0">
            <Globe className="w-3.5 h-3.5 text-purple-400" /> Filter State/City:
          </span>
          {citiesList.map((dest) => (
            <button
              key={dest}
              onClick={() => handleDestChange(dest)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeDestFilter === dest
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/5 hover:bg-white/10'
              }`}
            >
              {dest}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHotels.length === 0 ? (
          <GlassCard className="col-span-2 text-center py-10 border border-white/10">
            <Hotel className="w-10 h-10 text-white/20 mx-auto mb-2" />
            <p className="text-white/60 text-sm">No hotels found matching {activeDestFilter}.</p>
            <Button size="sm" variant="secondary" className="mt-3" onClick={() => handleDestChange('All')}>
              Show All Hotels
            </Button>
          </GlassCard>
        ) : (
          filteredHotels.map((hotel) => {
            const isSelected = selectedHotelId === hotel.id;
            return (
              <GlassCard
                key={hotel.id}
                className={`border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/20 shadow-lg shadow-purple-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => handleSelectHotel(hotel)}
              >
                <div>
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      {hotel.tag && (
                        <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full inline-block mb-1.5 border border-cyan-500/20">
                          {hotel.tag}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-white">{hotel.name}</h3>
                      <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" /> {hotel.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-xl text-amber-400 font-bold text-xs shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed mb-4">
                    {hotel.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hotel.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2.5 py-0.5 rounded-lg bg-white/5 text-white/70 border border-white/5"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Policy note */}
                  <div className="text-[11px] text-white/50 p-2 rounded-xl bg-white/[0.02] border border-white/5 mb-4">
                    <span className="font-semibold text-purple-400">Policy:</span> {hotel.cancellation}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-white/40 line-through">
                      ₹{hotel.originalPrice.toLocaleString()}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-emerald-400">
                        ₹{hotel.pricePerNight.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-white/40">/ night</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-medium">
                      Only {hotel.availability} rooms left
                    </span>
                  </div>

                  <Button
                    variant={isSelected ? 'success' : 'primary'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectHotel(hotel);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Selected
                      </>
                    ) : (
                      'Select Hotel'
                    )}
                  </Button>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}
