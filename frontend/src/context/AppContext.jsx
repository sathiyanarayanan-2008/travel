import { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext(null);

const initialState = {
  conversations: [],
  currentConversation: null,
  trips: [],
  currentTrip: null,
  bookings: [],
  disruptions: [],
  notifications: [],
  sidebarOpen: true,
  loading: {},
  selectedDestination: 'Goa',
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversation: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        currentConversation: state.currentConversation
          ? { ...state.currentConversation, messages: [...(state.currentConversation.messages || []), action.payload] }
          : { messages: [action.payload] },
      };
    case 'SET_TRIPS':
      return { ...state, trips: action.payload };
    case 'SET_CURRENT_TRIP':
      return { ...state, currentTrip: action.payload };
    case 'ADD_TRIP':
      return { ...state, trips: [action.payload, ...state.trips] };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload };
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'SET_DISRUPTIONS':
      return { ...state, disruptions: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, { id: Date.now(), ...action.payload }] };
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter((n) => n.id !== action.payload) };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.key]: action.value } };
    case 'SET_DESTINATION':
      return { ...state, selectedDestination: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    dispatch({ type: 'ADD_NOTIFICATION', payload: { ...notification, id } });
    setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }), 5000);
  }, []);

  const setDestination = useCallback((destination) => {
    dispatch({ type: 'SET_DESTINATION', payload: destination });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, addNotification, setDestination }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
