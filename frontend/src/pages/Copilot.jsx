import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  MapPin,
  Calendar,
  Users as UsersIcon,
  IndianRupee,
  Compass,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';
import { useApp } from '../context/AppContext';
import { sendChatMessage } from '../api/endpoints';

const scenarioPrompts = [
  'Plan a 3-day Goa trip from Chennai for 2 people under INR 30,000, with beaches, affordable hotels, and morning flights.',
  'Plan a 4-day Manali snow trip from Delhi for 4 people under INR 70,000 with cottages and bonfire.',
  'Plan a 3-day Jaipur royal heritage trip from Mumbai for 3 people under INR 45,000.',
  'Plan a 4-day Kerala backwater & Munnar tea tour from Bangalore for 2 people under INR 40,000.',
  'Can you suggest a cheaper hotel option for the itinerary?',
];

export default function Copilot() {
  const { state, setDestination, addNotification } = useApp();
  const currentDest = state.selectedDestination || 'Goa';

  const [messages, setMessages] = useState([
    {
      id: 'welcome-0',
      role: 'assistant',
      content:
        "👋 Welcome to **VoyagePilot AI Copilot**! I coordinate specialized AI agents (Intent, Itinerary, Supplier, Budget, Booking, Disruption, and Support) to power your travel workflow across **any destination** (Goa, Manali, Jaipur, Kerala, Dubai, and beyond).\n\nTry testing any of the suggested benchmark prompts below, or type your own custom trip request.",
      timestamp: new Date().toISOString(),
      agentType: 'Intent',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState('demo-conv-1');
  const [extractedPrefs, setExtractedPrefs] = useState({
    origin: 'Chennai',
    destination: 'Goa',
    duration: '3 days',
    travelers: 2,
    budget: '₹30,000',
    interests: ['Beaches', 'Affordable Hotels', 'Morning Flights'],
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage({
        message: query,
        conversationId,
        context: { extractedPrefs },
      });

      if (res.data) {
        if (res.data.conversationId) setConversationId(res.data.conversationId);
        if (res.data.extractedData) {
          setExtractedPrefs((prev) => ({ ...prev, ...res.data.extractedData }));
          if (res.data.extractedData.destination) {
            setDestination(res.data.extractedData.destination);
          }
        }

        const botReply = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: res.data.reply || 'Processing completed with updated travel graph.',
          agentType: res.data.agentType || 'Intent',
          timestamp: new Date().toISOString(),
          extractedData: res.data.extractedData,
        };
        setMessages((prev) => [...prev, botReply]);
      }
    } catch {
      // Deterministic fallback response when backend or network is offline
      const fallback = generateDeterministicResponse(query, extractedPrefs);
      if (fallback.extracted) {
        setExtractedPrefs((prev) => ({ ...prev, ...fallback.extracted }));
        if (fallback.extracted.destination) {
          setDestination(fallback.extracted.destination);
        }
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: fallback.reply,
          agentType: fallback.agentType,
          timestamp: new Date().toISOString(),
          extractedData: fallback.extracted,
        },
      ]);
      addNotification({
        type: 'info',
        message: 'Processed via deterministic agent fallback engine.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-0',
        role: 'assistant',
        content:
          "👋 Welcome back! Chat history cleared. What destination would you like to plan today (e.g., Goa, Manali, Jaipur, Kerala, Dubai)?",
        timestamp: new Date().toISOString(),
        agentType: 'Intent',
      },
    ]);
    addNotification({ type: 'info', message: 'Chat reset to baseline' });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-7.5rem)]">
      {/* Main Chat Stream */}
      <div className="flex-1 flex flex-col min-w-0">
        <GlassCard hover={false} className="flex-1 flex flex-col overflow-hidden p-0 border border-white/10">
          {/* Chat Header Bar */}
          <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">VoyagePilot Multi-Agent Copilot</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    Active Orchestration
                  </span>
                </div>
                <p className="text-xs text-white/50">Gemini 2.0 Backend Adapter with deterministic failover</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleResetChat} className="text-xs">
              <RotateCcw className="w-3.5 h-3.5" /> Reset Chat
            </Button>
          </div>

          {/* Messages Scroller */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-md ${
                        isUser
                          ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white'
                          : 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? 'text-right' : 'text-left'}`}>
                      {!isUser && msg.agentType && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-400 mb-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                          <Sparkles className="w-3 h-3" />
                          <span>{msg.agentType} Agent</span>
                        </div>
                      )}

                      <div
                        className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-600/20'
                            : 'glass-light border border-white/10 text-white/95'
                        }`}
                      >
                        {msg.content}
                      </div>

                      <span className="text-[10px] text-white/30 block mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-600/30 flex items-center justify-center text-cyan-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="glass-light border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-xs text-white/70">Orchestrating agents and retrieving supplier offers...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-5 py-2.5 bg-black/20 border-t border-white/5 overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/40 whitespace-nowrap">Suggested:</span>
              <div className="flex gap-2">
                {scenarioPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-xs whitespace-nowrap px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                  >
                    {prompt.length > 55 ? `${prompt.substring(0, 52)}...` : prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-white/10 bg-white/[0.01]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-end gap-3"
            >
              <div className="flex-1 glass rounded-2xl border border-white/10 focus-within:border-blue-500/50 p-2.5 transition-colors">
                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask to plan ANY trip: e.g. 'Plan 4 days in Manali for 4 people from Delhi under ₹70,000'..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none resize-none px-2"
                />
              </div>

              <Button
                type="submit"
                disabled={!input.trim() || loading}
                loading={loading}
                className="h-12 px-5 rounded-2xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </GlassCard>
      </div>

      {/* Structured Agent Extraction Panel */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
        <GlassCard hover={false} className="border border-white/10">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Extracted Intent
            </h4>
            <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
              Intent Agent
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03]">
              <span className="text-white/50 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> Origin
              </span>
              <span className="font-semibold text-white">{extractedPrefs.origin || 'Chennai'}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03]">
              <span className="text-white/50 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Destination
              </span>
              <span className="font-semibold text-white">{extractedPrefs.destination || 'Goa'}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03]">
              <span className="text-white/50 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" /> Duration
              </span>
              <span className="font-semibold text-white">{extractedPrefs.duration || '3 Days'}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03]">
              <span className="text-white/50 flex items-center gap-1.5">
                <UsersIcon className="w-3.5 h-3.5 text-emerald-400" /> Travelers
              </span>
              <span className="font-semibold text-white">{extractedPrefs.travelers || 2} Adults</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03]">
              <span className="text-white/50 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-amber-400" /> Budget Cap
              </span>
              <span className="font-bold text-emerald-400">{extractedPrefs.budget || '₹30,000'}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-[11px] text-white/50 mb-2">Interests & Constraints:</p>
            <div className="flex flex-wrap gap-1.5">
              {(extractedPrefs.interests || ['Beaches', 'Morning Flights', 'Affordable Hotels']).map(
                (item, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/80"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </GlassCard>

        {/* Action Direct Links */}
        <GlassCard hover={false} className="border border-blue-500/20 bg-blue-950/20 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Next Steps</h4>
          <Link to="/itinerary" className="block">
            <Button variant="secondary" size="sm" className="w-full justify-between text-xs">
              <span className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-cyan-400" /> View Smart Itinerary
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link to="/flights" className="block">
            <Button variant="secondary" size="sm" className="w-full justify-between text-xs">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Compare Flight Offers
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link to="/hotels" className="block">
            <Button variant="secondary" size="sm" className="w-full justify-between text-xs">
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-purple-400" /> Compare Hotel Offers
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link to="/budget" className="block">
            <Button variant="secondary" size="sm" className="w-full justify-between text-xs">
              <span className="flex items-center gap-2">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Open Budget Optimizer
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}

function generateDeterministicResponse(query, currentPrefs) {
  const lower = query.toLowerCase();

  // 1. Manali
  if (lower.includes('manali')) {
    return {
      agentType: 'Itinerary',
      reply:
        "🏔️ **Itinerary Agent Generated 4-Day Manali Himalayan Plan (Delhi → Manali):**\n\n" +
        "• **Day 1:** Morning flight from Delhi to Kullu / scenic cab to Manali. Check-in at Solang Valley Himalayan Resort. Hadimba Devi Temple walk & trout dinner in Old Manali.\n" +
        "• **Day 2:** Solang Valley ropeway cable car, snow quad biking, zorbing, hot springs bath at Vashisht.\n" +
        "• **Day 3:** Day trip through the 9km Atal Tunnel to Sissu Waterfall & Lahaul Valley. Evening Mall Road shopping.\n" +
        "• **Day 4:** Jogini Waterfall morning trek, cafe breakfast, and return flight.\n\n" +
        "💰 **Estimated Total:** **₹65,000** for 4 travelers *(Under your ₹70,000 budget cap)*.\n\n" +
        "⚠️ [SIMULATED DATA] Switch to the **Smart Itinerary Builder** or **Flight Comparison** to inspect Manali offers.",
      extracted: {
        origin: 'Delhi',
        destination: 'Manali',
        duration: '4 Days',
        travelers: 4,
        budget: '₹70,000',
        interests: ['Snow Peaks', 'Solang Valley', 'Cottages', 'Bonfire'],
      },
    };
  }

  // 2. Jaipur
  if (lower.includes('jaipur')) {
    return {
      agentType: 'Itinerary',
      reply:
        "🏰 **Itinerary Agent Generated 3-Day Jaipur Royal Heritage Plan (Mumbai → Jaipur):**\n\n" +
        "• **Day 1:** IndiGo 6E-551 (06:30 AM) flight from Mumbai. Check-in at Shahpura Haveli Heritage Stay. Grand Amer Fort guided audio tour, Panna Meena Stepwell, and rooftop Rajasthani dinner.\n" +
        "• **Day 2:** Hawa Mahal facade morning photography, City Palace Royal Museum, Johari Bazaar gemstone shopping, and dinner at Chokhi Dhani.\n" +
        "• **Day 3:** Jantar Mantar observatory, Jal Mahal lake views, handicraft shopping, and return flight.\n\n" +
        "💰 **Estimated Total:** **₹42,000** for 3 travelers *(Under ₹45,000 budget cap)*.\n\n" +
        "⚠️ [SIMULATED DATA] Inspect day-by-day Jaipur activities in the **Smart Itinerary Builder**.",
      extracted: {
        origin: 'Mumbai',
        destination: 'Jaipur',
        duration: '3 Days',
        travelers: 3,
        budget: '₹45,000',
        interests: ['Forts', 'Palaces', 'Bazaars', 'Heritage Stays'],
      },
    };
  }

  // 3. Kerala
  if (lower.includes('kerala') || lower.includes('kochi') || lower.includes('alleppey') || lower.includes('munnar')) {
    return {
      agentType: 'Itinerary',
      reply:
        "🛶 **Itinerary Agent Generated 4-Day Kerala Backwaters & Munnar Plan (Bangalore → Kerala):**\n\n" +
        "• **Day 1:** IndiGo morning flight from Bangalore to Kochi. Board private luxury Kettuvallam Houseboat in Alleppey backwaters. Traditional Karimeen lunch and deck dinner.\n" +
        "• **Day 2:** Scenic hill climb to Munnar via Cheeyappara waterfalls. Check-in at Munnar Misty Hills Cottage. KDHP Tea Processing Museum tour.\n" +
        "• **Day 3:** Eravikulam National Park Nilgiri Tahr wildlife tour, Mattupetty Dam, Kathakali martial arts evening show.\n" +
        "• **Day 4:** Spice plantation walk, Fort Kochi Chinese Fishing Nets, and return flight.\n\n" +
        "💰 **Estimated Total:** **₹38,000** for 2 travelers *(Under ₹40,000 budget cap)*.\n\n" +
        "⚠️ [SIMULATED DATA] View Kerala houseboats and tea estate cottages in **Hotel Comparison**.",
      extracted: {
        origin: 'Bangalore',
        destination: 'Kerala',
        duration: '4 Days',
        travelers: 2,
        budget: '₹40,000',
        interests: ['Backwaters', 'Houseboats', 'Tea Plantations', 'Ayurveda'],
      },
    };
  }

  // 4. Dubai
  if (lower.includes('dubai')) {
    return {
      agentType: 'Itinerary',
      reply:
        "🏙️ **Itinerary Agent Generated 4-Day Dubai Experience (Mumbai → Dubai):**\n\n" +
        "• **Day 1:** Emirates EK-501 flight. Check in at Rove Downtown Dubai. At The Top Burj Khalifa (Level 124/125) and Dubai Mall Fountain Show.\n" +
        "• **Day 2:** Museum of the Future morning tour. Afternoon 4x4 Red Dune Desert Safari with sandboarding, camel rides, and Bedouin BBQ dinner.\n" +
        "• **Day 3:** Dubai Marina Dhow Cruise, Ain Dubai, and JBR Beach walk.\n" +
        "• **Day 4:** Gold & Spice Souk traditional Abra boat ride, luxury shopping, and departure.\n\n" +
        "💰 **Estimated Total:** **₹92,000** for 2 travelers.\n\n" +
        "⚠️ [SIMULATED DATA] Flight and hotel offers for Dubai are available in **Flight Comparison**.",
      extracted: {
        origin: 'Mumbai',
        destination: 'Dubai',
        duration: '4 Days',
        travelers: 2,
        budget: '₹95,000',
        interests: ['Burj Khalifa', 'Desert Safari', 'Luxury Malls', 'Skyline'],
      },
    };
  }

  // 5. Cheaper Hotel Request
  if (lower.includes('cheaper hotel') || lower.includes('budget hotel') || lower.includes('cheap hotel')) {
    return {
      agentType: 'Budget',
      reply:
        "🏨 **Budget Agent Suggestion:**\n\n" +
        "I swapped the hotel from *Seaside Comfort Inn* (₹2,200/night) to **Budget Stay Goa** (₹1,200/night) in Anjuna.\n\n" +
        "• **Previous Total:** ₹27,500\n" +
        "• **Updated Hotel Total (2 nights):** ₹2,400 (Savings of ₹2,000)\n" +
        "• **Revised Trip Total:** **₹25,500** (Remaining under ₹30,000 budget: ₹4,500)\n\n" +
        "[SIMULATED DATA] The budget chart and itinerary have been refreshed.",
      extracted: { budget: '₹25,500 (Optimized)' },
    };
  }

  // Default Goa Benchmark
  return {
    agentType: 'Itinerary',
    reply:
      "🌴 **Itinerary Agent Generated 3-Day Goa Plan (Chennai → Goa):**\n\n" +
      "• **Day 1:** 06:15 AM IndiGo flight → North Goa arrival, Check-in at Seaside Comfort Inn, lunch at Britto's, afternoon relaxation at Baga Beach, sunset at Calangute.\n" +
      "• **Day 2:** Heritage tour of Basilica of Bom Jesus, Old Goa churches, authentic lunch at Martin's Corner, kayaking at Palolem Beach, evening at Tito's Lane.\n" +
      "• **Day 3:** Sahakari Spice Plantation tour & traditional lunch, Mapusa handicraft shopping, 18:30 PM flight back to Chennai.\n\n" +
      "💰 **Estimated Total:** ₹27,500 for 2 travelers (Well under your ₹30,000 budget cap).\n\n" +
      "[SIMULATED DATA] You can inspect the full day-by-day interactive timeline on the **Smart Itinerary Builder** page.",
    extracted: {
      origin: 'Chennai',
      destination: 'Goa',
      duration: '3 days',
      travelers: 2,
      budget: '₹27,500',
    },
  };
}
