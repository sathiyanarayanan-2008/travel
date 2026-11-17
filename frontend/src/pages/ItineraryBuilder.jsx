import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Plus,
  DollarSign,
  Save,
  CheckCircle,
  Share2,
  Sparkles,
  ArrowRight,
  Info,
  Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppContext';

const destinationItineraries = {
  Goa: {
    tripName: '3-Day Goa Coastal & Heritage Getaway',
    destination: 'Goa',
    origin: 'Chennai',
    duration: 3,
    travelers: 2,
    totalCost: 27500,
    days: [
      {
        day: 1,
        title: 'Arrival, Check-in & North Goa Sunsets',
        activities: [
          { id: '1-1', time: '06:15', title: 'IndiGo 6E-2041 Flight (Chennai → Goa)', type: 'transport', cost: 9000, icon: '✈️' },
          { id: '1-2', time: '08:45', title: 'Private AC Airport Transfer to Calangute', type: 'transport', cost: 1200, icon: '🚕' },
          { id: '1-3', time: '10:30', title: 'Check-in at Seaside Comfort Inn', type: 'hotel', cost: 4400, icon: '🏨' },
          { id: '1-4', time: '12:30', title: 'Seafood Lunch at Britto’s, Baga Beach', type: 'food', cost: 1200, icon: '🍽️' },
          { id: '1-5', time: '15:00', title: 'Water Sports & Beach Relaxation at Baga', type: 'activity', cost: 1500, icon: '🏖️' },
          { id: '1-6', time: '18:00', title: 'Sunset Cocktails & Views at Calangute Beach', type: 'sightseeing', cost: 800, icon: '🌅' },
          { id: '1-7', time: '20:30', title: 'Dinner at Thalassa Greek Taverna', type: 'food', cost: 2200, icon: '🍽️' },
        ],
      },
      {
        day: 2,
        title: 'Old Goa Heritage Churches & South Coast',
        activities: [
          { id: '2-1', time: '08:30', title: 'Complimentary Buffet Breakfast at Hotel', type: 'food', cost: 0, icon: '☕' },
          { id: '2-2', time: '09:45', title: 'Guided Tour: Basilica of Bom Jesus & Se Cathedral', type: 'sightseeing', cost: 400, icon: '⛪' },
          { id: '2-3', time: '13:00', title: 'Traditional Goan Feast at Martin’s Corner', type: 'food', cost: 1600, icon: '🍛' },
          { id: '2-4', time: '15:30', title: 'Palolem Beach Sea Kayaking', type: 'activity', cost: 1000, icon: '🛶' },
          { id: '2-5', time: '18:00', title: 'Cabo de Rama Fort Sunset Walk', type: 'sightseeing', cost: 200, icon: '🏰' },
          { id: '2-6', time: '20:45', title: 'Live Music & Dinner at Tito’s Lane', type: 'food', cost: 1800, icon: '🎶' },
        ],
      },
      {
        day: 3,
        title: 'Spice Plantations, Handicraft Bazaars & Departure',
        activities: [
          { id: '3-1', time: '08:00', title: 'Breakfast & Morning Beach Walk', type: 'food', cost: 0, icon: '☕' },
          { id: '3-2', time: '09:30', title: 'Sahakari Spice Plantation Guided Tour & Tasting', type: 'sightseeing', cost: 800, icon: '🌿' },
          { id: '3-3', time: '12:30', title: 'Organic Buffet Lunch at Plantation', type: 'food', cost: 1000, icon: '🍽️' },
          { id: '3-4', time: '14:30', title: 'Mapusa Market Cashew & Souvenir Shopping', type: 'activity', cost: 1000, icon: '🛍️' },
          { id: '3-5', time: '16:00', title: 'Hotel Checkout & Departure Airport Transfer', type: 'transport', cost: 1200, icon: '🚕' },
          { id: '3-6', time: '18:30', title: 'IndiGo 6E-2043 Return Flight to Chennai', type: 'transport', cost: 9000, icon: '✈️' },
        ],
      },
    ],
  },
  Manali: {
    tripName: '4-Day Manali Snow Peaks & Pine Trails',
    destination: 'Manali',
    origin: 'Delhi',
    duration: 4,
    travelers: 4,
    totalCost: 65000,
    days: [
      {
        day: 1,
        title: 'Scenic Arrival, Hadimba Temple & Old Manali Cafes',
        activities: [
          { id: 'm-1-1', time: '06:45', title: 'Air India AI-9811 (Delhi → Kullu)', type: 'transport', cost: 28800, icon: '✈️' },
          { id: 'm-1-2', time: '09:00', title: 'Scenic Mountain Cab to Manali Resort', type: 'transport', cost: 2500, icon: '🚕' },
          { id: 'm-1-3', time: '11:00', title: 'Check-in at Solang Valley Himalayan Resort', type: 'hotel', cost: 13600, icon: '🏨' },
          { id: 'm-1-4', time: '13:00', title: 'Trout Lunch at Cafe 1947, Old Manali', type: 'food', cost: 2400, icon: '🍽️' },
          { id: 'm-1-5', time: '15:30', title: 'Ancient Cedar Walk & Hadimba Devi Temple', type: 'sightseeing', cost: 200, icon: '🌲' },
          { id: 'm-1-6', time: '19:30', title: 'Bonfire & Himachali Dinner at Resort', type: 'food', cost: 3000, icon: '🔥' },
        ],
      },
      {
        day: 2,
        title: 'Solang Valley Snow Sports & Zorbing',
        activities: [
          { id: 'm-2-1', time: '08:30', title: 'Mountain View Breakfast Buffet', type: 'food', cost: 0, icon: '☕' },
          { id: 'm-2-2', time: '09:45', title: 'Solang Valley Ropeway Cable Car to Mt Phatru', type: 'activity', cost: 3200, icon: '🚡' },
          { id: 'm-2-3', time: '12:00', title: 'Snow Quad Biking & Zorbing Experience', type: 'activity', cost: 4000, icon: '⛷️' },
          { id: 'm-2-4', time: '14:00', title: 'Hot Maggi & Momos with Mountain Views', type: 'food', cost: 800, icon: '🍲' },
          { id: 'm-2-5', time: '17:00', title: 'Vashisht Hot Sulphur Springs Bath', type: 'sightseeing', cost: 0, icon: '♨️' },
          { id: 'm-2-6', time: '20:00', title: 'Woodfired Pizza Dinner at Il Forno', type: 'food', cost: 2800, icon: '🍕' },
        ],
      },
    ],
  },
  Kerala: {
    tripName: '4-Day Kerala Backwaters & Munnar Tea Estates',
    destination: 'Kerala',
    origin: 'Bangalore',
    duration: 4,
    travelers: 2,
    totalCost: 38000,
    days: [
      {
        day: 1,
        title: 'Kochi Arrival & Alleppey Luxury Houseboat Cruise',
        activities: [
          { id: 'k-1-1', time: '07:00', title: 'IndiGo 6E-409 Flight (Bangalore → Kochi)', type: 'transport', cost: 5200, icon: '✈️' },
          { id: 'k-1-2', time: '08:30', title: 'Private AC Transfer to Alleppey Jetty', type: 'transport', cost: 1800, icon: '🚕' },
          { id: 'k-1-3', time: '11:30', title: 'Board Private Kettuvallam Houseboat on Vembanad', type: 'hotel', cost: 12000, icon: '⛵' },
          { id: 'k-1-4', time: '13:00', title: 'Karimeen Pollichathu & Traditional Kerala Lunch', type: 'food', cost: 0, icon: '🐟' },
          { id: 'k-1-5', time: '15:30', title: 'Paddy Fields & Coconut Lagoon Slow Cruise', type: 'activity', cost: 0, icon: '🌴' },
          { id: 'k-1-6', time: '19:30', title: 'Candlelight Deck Dinner with Backwater Breeze', type: 'food', cost: 0, icon: '🕯️' },
        ],
      },
      {
        day: 2,
        title: 'Munnar Tea Gardens & Spice Plantations',
        activities: [
          { id: 'k-2-1', time: '08:30', title: 'Houseboat Breakfast & Checkout', type: 'food', cost: 0, icon: '☕' },
          { id: 'k-2-2', time: '09:30', title: 'Scenic Hill Climb to Munnar via Cheeyappara Falls', type: 'transport', cost: 2400, icon: '🚕' },
          { id: 'k-2-3', time: '13:00', title: 'Check-in at Munnar Misty Hills Cottage', type: 'hotel', cost: 4200, icon: '🏨' },
          { id: 'k-2-4', time: '15:00', title: 'KDHP Tea Museum & Factory Processing Tour', type: 'sightseeing', cost: 500, icon: '🍃' },
          { id: 'k-2-5', time: '17:30', title: 'Kathakali & Kalaripayattu Martial Arts Show', type: 'activity', cost: 1200, icon: '🎭' },
          { id: 'k-2-6', time: '20:00', title: 'Appam & Stew Dinner at Rapsy Restaurant', type: 'food', cost: 1100, icon: '🍛' },
        ],
      },
    ],
  },
  Jaipur: {
    tripName: '3-Day Jaipur Royal Palaces & Pink City Bazaars',
    destination: 'Jaipur',
    origin: 'Mumbai',
    duration: 3,
    travelers: 3,
    totalCost: 42000,
    days: [
      {
        day: 1,
        title: 'Amer Fort, Panna Meena Stepwell & Royal Courtyards',
        activities: [
          { id: 'j-1-1', time: '06:30', title: 'IndiGo 6E-551 Flight (Mumbai → Jaipur)', type: 'transport', cost: 11400, icon: '✈️' },
          { id: 'j-1-2', time: '08:45', title: 'AC Cab Transfer to Shahpura Haveli', type: 'transport', cost: 1200, icon: '🚕' },
          { id: 'j-1-3', time: '10:30', title: 'Check-in at Shahpura Haveli Heritage Stay', type: 'hotel', cost: 7800, icon: '🏨' },
          { id: 'j-1-4', time: '12:00', title: 'Dal Baati Churma Lunch at 1135 AD', type: 'food', cost: 3200, icon: '🍛' },
          { id: 'j-1-5', time: '14:00', title: 'Grand Amer Fort Palace Guided Audio Tour', type: 'sightseeing', cost: 1500, icon: '🏰' },
          { id: 'j-1-6', time: '17:00', title: 'Panna Meena Kund Geometric Stepwell Photos', type: 'sightseeing', cost: 0, icon: '🏛️' },
          { id: 'j-1-7', time: '20:00', title: 'Rooftop Rajasthani Dinner with Live Sarangi', type: 'food', cost: 2800, icon: '🎶' },
        ],
      },
    ],
  },
  Hyderabad: {
    tripName: '3-Day Hyderabad Nizam Heritage & Biryani Trail',
    destination: 'Hyderabad',
    origin: 'Bangalore',
    duration: 3,
    travelers: 2,
    totalCost: 21500,
    days: [
      {
        day: 1,
        title: 'Arrival, Historic Charminar & Authentic Dum Biryani',
        activities: [
          { id: 'h-1-1', time: '06:15', title: 'IndiGo 6E-621 Flight (Bangalore → Hyderabad)', type: 'transport', cost: 5800, icon: '✈️' },
          { id: 'h-1-2', time: '08:00', title: 'Cab Transfer to Abids Heritage Hotel', type: 'transport', cost: 900, icon: '🚕' },
          { id: 'h-1-3', time: '10:00', title: 'Check-in at Charminar Heritage Comfort', type: 'hotel', cost: 4200, icon: '🏨' },
          { id: 'h-1-4', time: '12:30', title: 'Kacchi Dum Mutton Biryani at Paradise / Shadab', type: 'food', cost: 1100, icon: '🍲' },
          { id: 'h-1-5', time: '14:30', title: 'Charminar Minaret Climb & Laad Bazaar Pearl Shopping', type: 'activity', cost: 1500, icon: '💎' },
          { id: 'h-1-6', time: '17:30', title: 'Chowmahalla Palace Nizam Grand Durbar Walk', type: 'sightseeing', cost: 400, icon: '👑' },
          { id: 'h-1-7', time: '20:00', title: 'Irani Chai & Osmania Biscuits at Nimrah Cafe', type: 'food', cost: 300, icon: '☕' },
        ],
      },
      {
        day: 2,
        title: 'Golconda Fort Acoustic Marvel & Hussain Sagar Sunset',
        activities: [
          { id: 'h-2-1', time: '08:30', title: 'Breakfast & Filter Coffee at Hotel', type: 'food', cost: 0, icon: '☕' },
          { id: 'h-2-2', time: '09:30', title: 'Golconda Fort Guided Clapping Acoustic Tour', type: 'sightseeing', cost: 600, icon: '🏰' },
          { id: 'h-2-3', time: '12:30', title: 'Qutb Shahi Tombs Heritage Walk', type: 'sightseeing', cost: 300, icon: '🏛️' },
          { id: 'h-2-4', time: '14:00', title: 'Andhra Thali Lunch at Chutneys', type: 'food', cost: 800, icon: '🍛' },
          { id: 'h-2-5', time: '16:30', title: 'Hussain Sagar Lake Speedboat to Buddha Statue', type: 'activity', cost: 800, icon: '🚤' },
          { id: 'h-2-6', time: '19:30', title: 'Dinner overlooking Durgam Cheruvu Cable Bridge', type: 'food', cost: 2200, icon: '🌉' },
        ],
      },
    ],
  },
  Bangalore: {
    tripName: '3-Day Bangalore Silicon Garden City & Breweries',
    destination: 'Bangalore',
    origin: 'Mumbai',
    duration: 3,
    travelers: 2,
    totalCost: 24000,
    days: [
      {
        day: 1,
        title: 'Lalbagh Glasshouse, Cubbon Park & Indiranagar Pubs',
        activities: [
          { id: 'b-1-1', time: '07:15', title: 'Air India AI-603 Flight (Mumbai → Bangalore)', type: 'transport', cost: 7000, icon: '✈️' },
          { id: 'b-1-2', time: '09:30', title: 'Vayu Vajra AC Airport Express to Indiranagar', type: 'transport', cost: 600, icon: '🚌' },
          { id: 'b-1-3', time: '11:00', title: 'Check-in at Bloomrooms Indiranagar', type: 'hotel', cost: 4800, icon: '🏨' },
          { id: 'b-1-4', time: '12:30', title: 'MTR 1924 Authentic Rava Idli & Filter Kaapi', type: 'food', cost: 600, icon: '☕' },
          { id: 'b-1-5', time: '14:30', title: 'Lalbagh Botanical Garden & 240-Acre Tree Walk', type: 'sightseeing', cost: 200, icon: '🌳' },
          { id: 'b-1-6', time: '17:00', title: 'Cubbon Park & Vidhana Soudha Architecture', type: 'sightseeing', cost: 0, icon: '🏛️' },
          { id: 'b-1-7', time: '20:00', title: 'Craft Beer Flight & Dinner at Toit Brewpub', type: 'food', cost: 2600, icon: '🍺' },
        ],
      },
      {
        day: 2,
        title: 'Nandi Hills Sunrise & Bangalore Palace Royalty',
        activities: [
          { id: 'b-2-1', time: '05:00', title: 'Early Morning Drive to Nandi Hills Sunrise Point', type: 'transport', cost: 2200, icon: '🚕' },
          { id: 'b-2-2', time: '06:15', title: 'Nandi Hills Cloud Mist Sunrise & Tipu’s Drop', type: 'sightseeing', cost: 200, icon: '🌄' },
          { id: 'b-2-3', time: '09:00', title: 'Breakfast at Indian Paratha Company / Cafe', type: 'food', cost: 700, icon: '🥞' },
          { id: 'b-2-4', time: '11:30', title: 'Bangalore Palace Tudor-Style Audio Tour', type: 'sightseeing', cost: 800, icon: '🏰' },
          { id: 'b-2-5', time: '15:00', title: 'Church Street Bookshops & Artisan Cafes', type: 'activity', cost: 1200, icon: '📚' },
          { id: 'b-2-6', time: '19:30', title: 'Dinner at Windmills Craftworks, Whitefield', type: 'food', cost: 3000, icon: '🍽️' },
        ],
      },
    ],
  },
  Delhi: {
    tripName: '3-Day Delhi Heritage, Monuments & Culinary Trail',
    destination: 'Delhi',
    origin: 'Bangalore',
    duration: 3,
    travelers: 2,
    totalCost: 26500,
    days: [
      {
        day: 1,
        title: 'Qutub Minar, Humayun Tomb & India Gate Sunset',
        activities: [
          { id: 'd-1-1', time: '07:30', title: 'IndiGo 6E-5012 Flight (Bangalore → Delhi)', type: 'transport', cost: 9200, icon: '✈️' },
          { id: 'd-1-2', time: '10:30', title: 'Delhi Metro Express to Connaught Place', type: 'transport', cost: 300, icon: '🚇' },
          { id: 'd-1-3', time: '11:30', title: 'Check-in at Haveli Dharampura / Connaught Stay', type: 'hotel', cost: 7600, icon: '🏨' },
          { id: 'd-1-4', time: '13:00', title: 'Butter Chicken & Naan at Gulati, Pandara Road', type: 'food', cost: 1800, icon: '🍗' },
          { id: 'd-1-5', time: '15:00', title: 'UNESCO Humayun’s Tomb Red Sandstone Walk', type: 'sightseeing', cost: 400, icon: '🏛️' },
          { id: 'd-1-6', time: '17:30', title: 'India Gate Kartavya Path Walk & Sunset', type: 'sightseeing', cost: 0, icon: '🇮🇳' },
          { id: 'd-1-7', time: '20:00', title: 'Qutub Minar Illuminated Complex & Olive Bar Dinner', type: 'food', cost: 3200, icon: '🍷' },
        ],
      },
      {
        day: 2,
        title: 'Old Delhi Rickshaw Safari, Red Fort & Chandni Chowk',
        activities: [
          { id: 'd-2-1', time: '08:30', title: 'Paranthe Wali Gali Traditional Breakfast', type: 'food', cost: 500, icon: '🥟' },
          { id: 'd-2-2', time: '09:30', title: 'Jama Masjid Courtyard & Minaret Panorama', type: 'sightseeing', cost: 200, icon: '🕌' },
          { id: 'd-2-3', time: '11:00', title: 'Mughal Red Fort Diwan-i-Khas Walk', type: 'sightseeing', cost: 600, icon: '🏰' },
          { id: 'd-2-4', time: '13:30', title: 'Karim’s Historic Mutton Korma & Roti', type: 'food', cost: 1200, icon: '🍛' },
          { id: 'd-2-5', time: '15:30', title: 'Khari Baoli Asia’s Largest Spice Market Rickshaw', type: 'activity', cost: 800, icon: '🌶️' },
          { id: 'd-2-6', time: '19:30', title: 'Dilli Haat Crafts Bazaar & Kashmiri Wazwan Dinner', type: 'food', cost: 1600, icon: '🛍️' },
        ],
      },
    ],
  },
  'Tamil Nadu': {
    tripName: '3-Day Tamil Nadu Coastal Temples & Heritage',
    destination: 'Tamil Nadu',
    origin: 'Bangalore',
    duration: 3,
    travelers: 2,
    totalCost: 22000,
    days: [
      {
        day: 1,
        title: 'Chennai Marina Beach & Mahabalipuram Shore Temples',
        activities: [
          { id: 'tn-1-1', time: '06:45', title: 'IndiGo 6E-334 Flight (Bangalore → Chennai)', type: 'transport', cost: 4400, icon: '✈️' },
          { id: 'tn-1-2', time: '08:30', title: 'East Coast Road AC Cab to Mahabalipuram', type: 'transport', cost: 1400, icon: '🚕' },
          { id: 'tn-1-3', time: '10:30', title: 'Check-in at Radisson Blu Resort Temple Bay', type: 'hotel', cost: 8000, icon: '🏨' },
          { id: 'tn-1-4', time: '12:30', title: 'Fresh Catch Seafood Thali at Moonrakers', type: 'food', cost: 1100, icon: '🦐' },
          { id: 'tn-1-5', time: '14:30', title: 'UNESCO 7th-Century Shore Temple & Pancha Rathas', type: 'sightseeing', cost: 600, icon: '🛕' },
          { id: 'tn-1-6', time: '17:00', title: 'Krishna’s Butter Ball Monolith & Beach Walk', type: 'sightseeing', cost: 0, icon: '🪨' },
          { id: 'tn-1-7', time: '20:00', title: 'Coastal Grill Dinner at Bay View', type: 'food', cost: 2400, icon: '🍽️' },
        ],
      },
      {
        day: 2,
        title: 'Kanchipuram Silk Weaving & Pondicherry French Quarter',
        activities: [
          { id: 'tn-2-1', time: '08:00', title: 'South Indian Filter Coffee & Idli Breakfast', type: 'food', cost: 0, icon: '☕' },
          { id: 'tn-2-2', time: '09:00', title: 'Drive to Kanchipuram Silk Weavers Loom Tour', type: 'activity', cost: 1500, icon: '🧵' },
          { id: 'tn-2-3', time: '11:30', title: 'Ekambareswarar Temple Thousand-Pillar Hall', type: 'sightseeing', cost: 200, icon: '🏛️' },
          { id: 'tn-2-4', time: '13:30', title: 'Traditional Banana Leaf Lunch', type: 'food', cost: 600, icon: '🍃' },
          { id: 'tn-2-5', time: '16:00', title: 'Pondicherry Promenade Beach French Colony Walk', type: 'activity', cost: 0, icon: '🇫🇷' },
          { id: 'tn-2-6', time: '19:30', title: 'French-Creole Dinner at Villa Shanti', type: 'food', cost: 2200, icon: '🥖' },
        ],
      },
    ],
  },
  Dubai: {
    tripName: '4-Day Dubai Desert Safari & Skyline Experience',
    destination: 'Dubai',
    origin: 'Mumbai',
    duration: 4,
    travelers: 2,
    totalCost: 92000,
    days: [
      {
        day: 1,
        title: 'Arrival, Dubai Mall & Burj Khalifa 124th Floor',
        activities: [
          { id: 'd-1-1', time: '04:30', title: 'Emirates EK-501 (Mumbai → Dubai)', type: 'transport', cost: 29000, icon: '✈️' },
          { id: 'd-1-2', time: '07:30', title: 'Dubai Airport Metro / Limousine Transfer', type: 'transport', cost: 2500, icon: '🚕' },
          { id: 'd-1-3', time: '10:00', title: 'Check-in at Rove Downtown Dubai', type: 'hotel', cost: 22500, icon: '🏨' },
          { id: 'd-1-4', time: '14:00', title: 'At The Top: Burj Khalifa Level 124 & 125', type: 'sightseeing', cost: 8400, icon: '🏙️' },
          { id: 'd-1-5', time: '18:30', title: 'Dubai Fountain Lake Ride & Show', type: 'activity', cost: 2200, icon: '⛲' },
          { id: 'd-1-6', time: '20:30', title: 'Dinner at Souk Al Bahar overlooking Fountain', type: 'food', cost: 5500, icon: '🍽️' },
        ],
      },
    ],
  },
};

export default function ItineraryBuilder() {
  const { state, setDestination, addNotification } = useApp();
  const currentDest = state.selectedDestination || 'Goa';
  const [itinerary, setItinerary] = useState(
    destinationItineraries[currentDest] || destinationItineraries.Goa
  );
  const [expandedDays, setExpandedDays] = useState([1, 2, 3]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [newActivity, setNewActivity] = useState({
    time: '14:00',
    title: '',
    type: 'activity',
    cost: '500',
    icon: '🎯',
  });

  useEffect(() => {
    if (destinationItineraries[currentDest]) {
      setItinerary(destinationItineraries[currentDest]);
      setExpandedDays([1, 2, 3]);
    }
  }, [currentDest]);

  const toggleDay = (dayNum) => {
    setExpandedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const getDayTotal = (day) => day.activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);

  const calculateGrandTotal = (days) =>
    days.reduce((total, d) => total + getDayTotal(d), 0);

  const handleRemoveActivity = (dayIndex, actId) => {
    const updatedDays = itinerary.days.map((day, dIdx) => {
      if (dIdx !== dayIndex) return day;
      return {
        ...day,
        activities: day.activities.filter((a) => a.id !== actId),
      };
    });
    setItinerary({
      ...itinerary,
      days: updatedDays,
      totalCost: calculateGrandTotal(updatedDays),
    });
    addNotification({ type: 'info', message: 'Activity removed from itinerary.' });
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivity.title.trim()) return;

    const activityObj = {
      id: `act-${Date.now()}`,
      time: newActivity.time,
      title: newActivity.title.trim(),
      type: newActivity.type,
      cost: parseFloat(newActivity.cost) || 0,
      icon: newActivity.icon || '🎯',
    };

    const updatedDays = itinerary.days.map((day, dIdx) => {
      if (dIdx !== activeDayIndex) return day;
      return {
        ...day,
        activities: [...day.activities, activityObj].sort((a, b) =>
          a.time.localeCompare(b.time)
        ),
      };
    });

    setItinerary({
      ...itinerary,
      days: updatedDays,
      totalCost: calculateGrandTotal(updatedDays),
    });

    setShowAddModal(false);
    setNewActivity({ time: '14:00', title: '', type: 'activity', cost: '500', icon: '🎯' });
    addNotification({ type: 'success', message: 'New activity added to itinerary.' });
  };

  const handleSaveItinerary = () => {
    addNotification({
      type: 'success',
      message: `Itinerary for ${itinerary.destination} successfully saved.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Destination Tabs */}
      <GlassCard hover={false} className="border border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                Multi-Destination Itinerary Generator
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                Active: {itinerary.destination}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Map className="w-6 h-6 text-blue-500" /> {itinerary.tripName}
            </h1>
            <p className="text-sm text-white/50 mt-1">
              {itinerary.origin} → {itinerary.destination} • {itinerary.duration} Days • {itinerary.travelers} Travelers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right pr-4 border-r border-white/10">
              <p className="text-xs text-white/50 uppercase font-medium">Estimated Total</p>
              <p className="text-2xl font-extrabold text-emerald-400">
                ₹{itinerary.totalCost.toLocaleString()}
              </p>
            </div>

            <Button variant="secondary" size="sm" onClick={handleSaveItinerary}>
              <Save className="w-4 h-4" /> Save Plan
            </Button>
            <Link to="/budget">
              <Button size="sm">
                <Sparkles className="w-4 h-4" /> Optimize Budget
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Destination Selectors */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/40 font-semibold mr-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-blue-400" /> Select Itinerary:
          </span>
          {Object.keys(destinationItineraries).map((dest) => (
            <button
              key={dest}
              onClick={() => setDestination(dest)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentDest === dest
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/5 hover:bg-white/10'
              }`}
            >
              {dest}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Day by Day Sections */}
      <div className="space-y-4">
        {itinerary.days.map((day, dIdx) => (
          <GlassCard key={day.day} hover={false} className="border border-white/10 overflow-hidden">
            {/* Day Header */}
            <div
              onClick={() => toggleDay(day.day)}
              className="flex items-center justify-between cursor-pointer py-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
                  D{day.day}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Day {day.day}: {day.title}
                  </h3>
                  <p className="text-xs text-white/50">
                    {day.activities.length} activities scheduled • Day total: ₹{getDayTotal(day).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDayIndex(dIdx);
                    setShowAddModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Activity
                </button>
                <div className="text-white/40 hover:text-white">
                  {expandedDays.includes(day.day) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
            </div>

            {/* Timeline Stream */}
            <AnimatePresence initial={false}>
              {expandedDays.includes(day.day) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 pt-4 border-t border-white/5 pl-4 sm:pl-8 space-y-3 relative before:absolute before:left-2 sm:before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:to-violet-500">
                    {day.activities.map((act) => (
                      <div
                        key={act.id}
                        className="relative flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all group"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="text-xl shrink-0">{act.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                                {act.time}
                              </span>
                              <span className="text-sm font-semibold text-white">{act.title}</span>
                            </div>
                            <span className="text-[11px] text-white/40 capitalize">
                              Category: {act.type}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-emerald-400">
                            {act.cost > 0 ? `₹${act.cost.toLocaleString()}` : 'Included'}
                          </span>
                          <button
                            onClick={() => handleRemoveActivity(dIdx, act.id)}
                            className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove activity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        ))}
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-3xl p-6 max-w-md w-full border border-white/20 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-white mb-1">
              Add Activity to Day {itinerary.days[activeDayIndex]?.day} ({itinerary.destination})
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Expand the itinerary with custom experiences, meals, or reservations.
            </p>

            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="text-xs text-white/70 block mb-1">Time (24h format)</label>
                <input
                  type="text"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                  placeholder="14:30"
                  className="w-full bg-navy-800/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">Activity Title</label>
                <input
                  type="text"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  placeholder="e.g. Charminar Walk or Nilgiri Tea Tasting"
                  className="w-full bg-navy-800/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/70 block mb-1">Category</label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                    className="w-full bg-navy-800/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  >
                    <option value="activity">Activity</option>
                    <option value="food">Dining</option>
                    <option value="sightseeing">Sightseeing</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/70 block mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={newActivity.cost}
                    onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })}
                    placeholder="500"
                    className="w-full bg-navy-800/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">Icon Emoji</label>
                <div className="flex gap-2">
                  {['🏖️', '🍽️', '🏛️', '☕', '🛶', '🚕', '🛍️', '💎', '🌳', '🛕'].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setNewActivity({ ...newActivity, icon: emoji })}
                      className={`p-2 rounded-lg text-lg border transition-all ${
                        newActivity.icon === emoji
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Add to Timeline
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
