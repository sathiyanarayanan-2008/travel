import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Copilot from './pages/Copilot';
import ItineraryBuilder from './pages/ItineraryBuilder';
import FlightComparison from './pages/FlightComparison';
import HotelComparison from './pages/HotelComparison';
import BudgetOptimizer from './pages/BudgetOptimizer';
import MyTrips from './pages/MyTrips';
import DisruptionCenter from './pages/DisruptionCenter';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/copilot" element={<Copilot />} />
            <Route path="/itinerary" element={<ItineraryBuilder />} />
            <Route path="/flights" element={<FlightComparison />} />
            <Route path="/hotels" element={<HotelComparison />} />
            <Route path="/budget" element={<BudgetOptimizer />} />
            <Route path="/trips" element={<MyTrips />} />
            <Route path="/disruptions" element={<DisruptionCenter />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
