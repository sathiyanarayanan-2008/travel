import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Notifications from '../ui/Notifications';
import { useApp } from '../../context/AppContext';

export default function Layout() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-navy-900">
      <Sidebar />
      <motion.main
        initial={false}
        animate={{ marginLeft: state.sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="p-6 min-h-screen"
      >
        <TopBar />
        <Outlet />
      </motion.main>
      <Notifications />
    </div>
  );
}
