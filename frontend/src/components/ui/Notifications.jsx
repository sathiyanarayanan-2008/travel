import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
};

const colors = {
  success: 'border-success/30 bg-success/10',
  error: 'border-danger/30 bg-danger/10',
  info: 'border-electric/30 bg-electric/10',
  warning: 'border-warning/30 bg-warning/10',
};

export default function Notifications() {
  const { state, dispatch } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-3">
      <AnimatePresence>
        {state.notifications.map((notif) => {
          const Icon = icons[notif.type] || Info;
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`glass flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[notif.type] || colors.info} max-w-sm`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <p className="text-sm flex-1">{notif.message}</p>
              <button
                onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: notif.id })}
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
