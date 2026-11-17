package com.voyagepilot.service;

import com.voyagepilot.dto.ChatRequest;
import com.voyagepilot.dto.ChatResponse;
import com.voyagepilot.model.*;
import com.voyagepilot.repository.*;
import com.voyagepilot.service.ai.AiProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AgentOrchestrator {

    private static final Logger log = LoggerFactory.getLogger(AgentOrchestrator.class);

    private final ConversationRepository conversationRepo;
    private final AgentLogRepository agentLogRepo;
    private final FlightOfferRepository flightRepo;
    private final HotelOfferRepository hotelRepo;
    private final AiProvider aiProvider;

    public AgentOrchestrator(ConversationRepository conversationRepo,
                             AgentLogRepository agentLogRepo,
                             FlightOfferRepository flightRepo,
                             HotelOfferRepository hotelRepo,
                             AiProvider aiProvider) {
        this.conversationRepo = conversationRepo;
        this.agentLogRepo = agentLogRepo;
        this.flightRepo = flightRepo;
        this.hotelRepo = hotelRepo;
        this.aiProvider = aiProvider;
    }

    public ChatResponse processMessage(ChatRequest request) {
        long startTime = System.currentTimeMillis();
        String userRawMessage = request.getMessage().trim();
        String userLower = userRawMessage.toLowerCase();

        // 1. Retrieve or initialize conversation session
        String convId = request.getConversationId();
        Conversation conversation;
        if (convId != null && conversationRepo.existsById(convId)) {
            conversation = conversationRepo.findById(convId).get();
        } else {
            conversation = new Conversation();
            conversation.setUserId("demo-agent-01");
            conversation = conversationRepo.save(conversation);
        }

        // 2. Add user message to conversation history
        conversation.getMessages().add(new Conversation.Message("user", userRawMessage, null));

        // 3. Entity Extraction & Preference Graph (Intent Agent)
        Map<String, Object> newlyExtracted = extractEntities(userLower);
        if (!newlyExtracted.isEmpty()) {
            conversation.getExtractedPreferences().putAll(newlyExtracted);
        }

        // 4. Multi-Agent Routing Logic
        String targetAgent = routeToAgent(userLower, conversation.getExtractedPreferences());

        // 5. Execute Agent Action
        String reply;
        switch (targetAgent) {
            case "Budget" -> reply = handleBudgetAgent(userLower, conversation.getExtractedPreferences());
            case "Supplier" -> reply = handleSupplierAgent(userLower, conversation.getExtractedPreferences());
            case "Itinerary" -> reply = handleItineraryAgent(userLower, conversation.getExtractedPreferences());
            case "Booking" -> reply = handleBookingAgent(userLower, conversation.getExtractedPreferences());
            case "Disruption" -> reply = handleDisruptionAgent(userLower, conversation.getExtractedPreferences());
            case "Support" -> reply = handleSupportAgent(userLower, conversation.getExtractedPreferences());
            default -> reply = handleIntentAgent(userLower, conversation.getExtractedPreferences());
        }

        // 6. Save assistant reply to state
        conversation.getMessages().add(new Conversation.Message("assistant", reply, targetAgent));
        conversation.setUpdatedAt(Instant.now());
        conversationRepo.save(conversation);

        // 7. Audit log agent decision
        long duration = System.currentTimeMillis() - startTime;
        logDecision(targetAgent, "orchestrate", conversation.getId(),
                Map.of("query", userRawMessage), Map.of("replySummary", reply.substring(0, Math.min(80, reply.length()))),
                "Handled by " + targetAgent + " Agent using " + aiProvider.getProviderName(), duration);

        return new ChatResponse(reply, targetAgent, conversation.getExtractedPreferences(), conversation.getId());
    }

    private String routeToAgent(String input, Map<String, Object> prefs) {
        if (input.contains("cheaper hotel") || input.contains("cheap hotel") || input.contains("budget") || input.contains("replan") || input.contains("cost")) {
            return "Budget";
        }
        if (input.contains("flight") || input.contains("hotel") || input.contains("airline") || input.contains("supplier") || input.contains("compare")) {
            return "Supplier";
        }
        if (input.contains("book") || input.contains("confirm") || input.contains("reserve") || input.contains("voucher")) {
            return "Booking";
        }
        if (input.contains("delay") || input.contains("disrupt") || input.contains("weather") || input.contains("delayed")) {
            return "Disruption";
        }
        if (input.contains("cancel") || input.contains("policy") || input.contains("modify") || input.contains("refund") || input.contains("help")) {
            return "Support";
        }
        if (input.contains("plan") || input.contains("itinerary") || input.contains("day") || input.contains("schedule")) {
            return "Itinerary";
        }
        return "Intent";
    }

    private Map<String, Object> extractEntities(String input) {
        Map<String, Object> extracted = new HashMap<>();

        // Destinations & Indian States
        Map<String, String> cityStateMap = new LinkedHashMap<>();
        cityStateMap.put("tamil nadu", "Tamil Nadu");
        cityStateMap.put("tamilnadu", "Tamil Nadu");
        cityStateMap.put("hyderabad", "Hyderabad");
        cityStateMap.put("bangalore", "Bangalore");
        cityStateMap.put("bengaluru", "Bangalore");
        cityStateMap.put("manali", "Manali");
        cityStateMap.put("kerala", "Kerala");
        cityStateMap.put("jaipur", "Jaipur");
        cityStateMap.put("delhi", "Delhi");
        cityStateMap.put("chennai", "Tamil Nadu");
        cityStateMap.put("goa", "Goa");
        cityStateMap.put("dubai", "Dubai");
        cityStateMap.put("mumbai", "Mumbai");
        cityStateMap.put("kolkata", "Kolkata");
        cityStateMap.put("ooty", "Tamil Nadu");
        cityStateMap.put("munnar", "Kerala");
        cityStateMap.put("alleppey", "Kerala");
        cityStateMap.put("shimla", "Shimla");
        cityStateMap.put("kashmir", "Kashmir");

        for (Map.Entry<String, String> entry : cityStateMap.entrySet()) {
            if (input.contains(entry.getKey())) {
                extracted.put("destination", entry.getValue());
                break;
            }
        }

        // Origin
        Matcher originMatcher = Pattern.compile("from\\s+([a-zA-Z\\s]+?)(?:\\s+to|\\s+for|\\s+under|\\s+with|$)").matcher(input);
        if (originMatcher.find()) {
            String orig = originMatcher.group(1).trim();
            extracted.put("origin", Character.toUpperCase(orig.charAt(0)) + orig.substring(1).toLowerCase());
        }

        // Travelers
        Matcher travelersMatcher = Pattern.compile("(\\d+)\\s*(?:people|person|pax|travelers|adults)").matcher(input);
        if (travelersMatcher.find()) {
            extracted.put("travelers", Integer.parseInt(travelersMatcher.group(1)));
        }

        // Budget
        Matcher budgetMatcher = Pattern.compile("(?:under|budget|inr|rs|₹)\\s*₹?\\s*([\\d,]+)").matcher(input);
        if (budgetMatcher.find()) {
            extracted.put("budget", "₹" + budgetMatcher.group(1).replace(",", ""));
        }

        // Duration
        Matcher durationMatcher = Pattern.compile("(\\d+)\\s*(?:day|days|night|nights)").matcher(input);
        if (durationMatcher.find()) {
            extracted.put("duration", durationMatcher.group(1) + " Days");
        }

        // Interests
        List<String> interests = new ArrayList<>();
        if (input.contains("beach") || input.contains("beaches")) interests.add("Beaches");
        if (input.contains("morning flight") || input.contains("morning")) interests.add("Morning Flights");
        if (input.contains("affordable hotel") || input.contains("cheap hotel") || input.contains("hotel")) interests.add("Affordable Hotels");
        if (input.contains("heritage") || input.contains("fort") || input.contains("palace")) interests.add("Heritage & Forts");
        if (input.contains("biryani") || input.contains("food") || input.contains("culinary")) interests.add("Culinary & Food");
        if (input.contains("snow") || input.contains("mountain") || input.contains("ski")) interests.add("Snow Peaks & Mountains");
        if (input.contains("temple") || input.contains("temples")) interests.add("Temple Architecture");
        if (input.contains("backwater") || input.contains("houseboat")) interests.add("Backwater Cruises");
        if (input.contains("tea") || input.contains("plantation")) interests.add("Tea Plantations");
        if (input.contains("beer") || input.contains("brewery") || input.contains("pubs")) interests.add("Microbreweries & Nightlife");
        if (!interests.isEmpty()) {
            extracted.put("interests", interests);
        }

        return extracted;
    }

    private String handleIntentAgent(String input, Map<String, Object> prefs) {
        String dest = (String) prefs.getOrDefault("destination", null);
        String orig = (String) prefs.getOrDefault("origin", null);

        if (dest != null) {
            List<String> missing = new ArrayList<>();
            if (orig == null) missing.add("Departure city (e.g. from Delhi, Mumbai, Bangalore)");
            if (!prefs.containsKey("duration")) missing.add("Trip duration (e.g. 3 days, 4 days)");
            if (!prefs.containsKey("travelers")) missing.add("Number of travelers (e.g. 2 people, 4 travelers)");
            if (!prefs.containsKey("budget")) missing.add("Budget limit (e.g. under ₹40,000)");

            if (!missing.isEmpty()) {
                return String.format("✈️ **Intent Agent Captured:** Destination set to **%s**.\n\nTo build your verified itinerary and match live offers, please share:\n%s",
                        dest, String.join("\n", missing.stream().map(m -> "• " + m).toList()));
            }
        }

        return aiProvider.generateResponse(
                "You are the Intent Agent of VoyagePilot AI. You assist travelers in planning trips across India (Goa, Manali, Kerala, Jaipur, Hyderabad, Bangalore, Delhi, Tamil Nadu) and international destinations.",
                input, prefs);
    }

    private String handleBudgetAgent(String input, Map<String, Object> prefs) {
        String dest = (String) prefs.getOrDefault("destination", "Goa");

        if (dest.equalsIgnoreCase("Hyderabad")) {
            return "💎 **Budget Agent Replanning (Hyderabad):**\n\n" +
                    "• Swapped hotel to **Charminar Heritage Comfort** (₹2,100/night vs ₹6,800 at ITC Kohenur).\n" +
                    "• Flight: IndiGo direct from Bangalore (₹2,900/pax).\n" +
                    "• **Updated 3-Day Trip Total:** **₹16,500** for 2 travelers *(Saved ₹8,000)*.\n" +
                    "• Remaining under budget: **₹8,500 surplus**.\n\n" +
                    "[SIMULATED DATA] The budget breakdown is updated.";
        }

        if (dest.equalsIgnoreCase("Bangalore")) {
            return "🌳 **Budget Agent Replanning (Bangalore):**\n\n" +
                    "• Swapped hotel to **Bloomrooms @ Indiranagar** (₹2,400/night vs ₹11,500 at Leela Palace).\n" +
                    "• Flight: Akasa Air direct (₹2,400/pax).\n" +
                    "• **Updated 3-Day Trip Total:** **₹17,800** for 2 travelers *(Saved ₹12,000)*.\n" +
                    "[SIMULATED DATA] Budget Optimizer has updated the cost matrix.";
        }

        return "🏨 **Budget Agent Replanning Result:**\n\n" +
                "I analyzed alternative supplier rates for **" + dest + "** to reduce costs:\n\n" +
                "• **Alternative Hotel Selected:** Budget verified property with free cancellation.\n" +
                "• **Original Trip Cost:** ₹27,500\n" +
                "• **Immediate Surcharge Savings:** ₹2,000\n" +
                "• **Recalculated Grand Total:** **₹25,500**\n" +
                "• **Remaining Budget:** ₹4,500 safely remaining under your budget cap.\n\n" +
                "⚠️ [SIMULATED DATA] The Budget Optimizer has been refreshed with this breakdown.";
    }

    private String handleSupplierAgent(String input, Map<String, Object> prefs) {
        String dest = (String) prefs.getOrDefault("destination", "Goa");

        List<FlightOffer> flights = flightRepo.findAll();
        List<HotelOffer> hotels = hotelRepo.findAll();

        StringBuilder sb = new StringBuilder();
        sb.append("🔍 **Supplier Agent Offer Retrieval for ").append(dest).append(" [SIMULATED DATA]:**\n\n");

        sb.append("✈️ **Seeded Flight Matches:**\n");
        int countF = 0;
        for (FlightOffer f : flights) {
            if (f.getDestination().toLowerCase().contains(dest.toLowerCase()) || countF < 2) {
                sb.append(String.format("• **%s %s** — %s → %s | **₹%,.0f/pax** | %s\n",
                        f.getAirline(), f.getFlightNo(), f.getOrigin(), f.getDestination(), f.getPrice(), f.getBaggage()));
                countF++;
                if (countF >= 3) break;
            }
        }

        sb.append("\n🏨 **Seeded Hotel Matches in ").append(dest).append(":**\n");
        int countH = 0;
        for (HotelOffer h : hotels) {
            if (h.getLocation().toLowerCase().contains(dest.toLowerCase()) ||
                (h.getDestination() != null && h.getDestination().toLowerCase().contains(dest.toLowerCase())) ||
                countH < 2) {
                sb.append(String.format("• **%s** — ★%.1f | %s | **₹%,.0f/night**\n",
                        h.getName(), h.getRating(), h.getLocation(), h.getPricePerNight()));
                countH++;
                if (countH >= 3) break;
            }
        }

        sb.append("\nWould you like to review the complete budget breakdown or generate an itinerary?");
        return sb.toString();
    }

    private String handleItineraryAgent(String input, Map<String, Object> prefs) {
        String dest = (String) prefs.getOrDefault("destination", "Goa");
        int travelers = (int) prefs.getOrDefault("travelers", 2);

        if (dest.equalsIgnoreCase("Hyderabad")) {
            return "💎 **Itinerary Agent Generated 3-Day Hyderabad Plan:**\n\n" +
                    "• **Day 1: Charminar & Pearls:** Morning flight. Check-in at Charminar Heritage Stay. Kacchi Dum Mutton Biryani at Paradise/Shadab, Charminar minaret climb, Laad Bazaar pearls, and Chowmahalla Palace.\n" +
                    "• **Day 2: Forts & Lakes:** Golconda Fort acoustic clapping tour, Qutb Shahi Tombs, Hussain Sagar lake boat ride to Buddha Statue, and Irani Chai at Nimrah Cafe.\n" +
                    "• **Day 3: Cyber Heritage:** Durgam Cheruvu cable bridge walk, Ramoji Film City or Salar Jung Museum, and return flight.\n\n" +
                    "💰 **Estimated Total:** **₹21,500** for " + travelers + " travelers.\n" +
                    "[SIMULATED DATA] Switch to **Smart Itinerary** to inspect or modify activities.";
        }

        if (dest.equalsIgnoreCase("Bangalore")) {
            return "🌳 **Itinerary Agent Generated 3-Day Bangalore Plan:**\n\n" +
                    "• **Day 1: Gardens & Pubs:** Morning flight. Check in at Bloomrooms Indiranagar. MTR 1924 breakfast, Lalbagh botanical glasshouse, Cubbon Park, and craft beer dinner at Toit.\n" +
                    "• **Day 2: Sunrise & Palaces:** Early morning drive to Nandi Hills cloud mist sunrise. Tudor-style Bangalore Palace audio tour, Church Street bookstores, and Whitefield dining.\n" +
                    "• **Day 3: Tech & Heritage:** Bannerghatta biological safari or Tipu Sultan's summer palace, shopping at Commercial Street, and departure.\n\n" +
                    "💰 **Estimated Total:** **₹24,000** for " + travelers + " travelers.\n" +
                    "[SIMULATED DATA] Available in **Smart Itinerary**.";
        }

        if (dest.equalsIgnoreCase("Delhi")) {
            return "🏛️ **Itinerary Agent Generated 3-Day Delhi Plan:**\n\n" +
                    "• **Day 1: Imperial Monuments:** IndiGo morning flight. Check in at Connaught Place / Haveli Dharampura. UNESCO Qutub Minar, Humayun's Tomb, and sunset at India Gate Kartavya Path.\n" +
                    "• **Day 2: Walled City Heritage:** Old Delhi rickshaw tour of Chandni Chowk, Paranthe Wali Gali breakfast, Red Fort, Karim's korma lunch, and Khari Baoli spice bazaar.\n" +
                    "• **Day 3: Arts & Crafts:** Dilli Haat artisan crafts shopping, Lotus Temple, National Museum, and departure.\n\n" +
                    "💰 **Estimated Total:** **₹26,500** for " + travelers + " travelers.\n" +
                    "[SIMULATED DATA] Detailed in **Smart Itinerary**.";
        }

        if (dest.equalsIgnoreCase("Tamil Nadu") || dest.equalsIgnoreCase("Chennai")) {
            return "🛕 **Itinerary Agent Generated 3-Day Tamil Nadu Plan:**\n\n" +
                    "• **Day 1: Coastal Temples:** Flight into Chennai. East Coast Road drive to Mahabalipuram. Check-in at Radisson Blu Temple Bay. UNESCO Shore Temples, Pancha Rathas, and fresh seafood dinner at Moonrakers.\n" +
                    "• **Day 2: Silk & French Quarters:** Kanchipuram silk weavers loom tour, Ekambareswarar 1000-pillar temple, banana leaf lunch, and evening Promenade beach stroll in Pondicherry.\n" +
                    "• **Day 3: Chennai Culture:** DakshinaChitra heritage museum, Marina Beach sunrise walk, Kapaleeshwarar Temple Mylapore, and return flight.\n\n" +
                    "💰 **Estimated Total:** **₹22,000** for " + travelers + " travelers.\n" +
                    "[SIMULATED DATA] Detailed in **Smart Itinerary**.";
        }

        if (dest.equalsIgnoreCase("Manali")) {
            return "🏔️ **Itinerary Agent Generated 4-Day Manali Plan:**\n\n" +
                    "• **Day 1:** Delhi → Kullu flight. Solang Valley Resort check-in, cedar forest walk, Hadimba Temple, Old Manali cafes.\n" +
                    "• **Day 2:** Solang Valley cable car ropeway, snow quad biking, zorbing, Vashisht hot springs.\n" +
                    "• **Day 3:** 9km Atal Tunnel crossing to Sissu Waterfall & Lahaul Valley. Evening Mall Road shopping.\n" +
                    "• **Day 4:** Jogini Waterfall morning trek, cafe breakfast, and return flight.\n\n" +
                    "💰 **Estimated Total:** **₹65,000** for 4 travelers.\n" +
                    "[SIMULATED DATA] Available in **Smart Itinerary**.";
        }

        return "🌴 **Itinerary Agent Generated 3-Day Plan for " + dest + ":**\n\n" +
                "• Chronological Day 1 arrival, check-in, top attractions, and local dining.\n" +
                "• Day 2 curated full-day sightseeing and cultural experiences.\n" +
                "• Day 3 souvenir shopping and evening return departure.\n\n" +
                "💰 **Estimated Total:** **₹27,500** for " + travelers + " travelers.\n" +
                "⚠️ [SIMULATED DATA] Inspect, edit, and add activities on the **Smart Itinerary Builder** page.";
    }

    private String handleBookingAgent(String input, Map<String, Object> prefs) {
        String dest = (String) prefs.getOrDefault("destination", "Goa");
        int travelers = (int) prefs.getOrDefault("travelers", 2);

        return "📑 **Booking Agent Reservation Summary (" + dest + "):**\n\n" +
                "• **Travelers:** " + travelers + " Adults\n" +
                "• **Destination:** " + dest + "\n" +
                "• **Flight & Hotel Offer Match:** Verified in repository\n" +
                "• **Status:** Pending Explicit Confirmation\n\n" +
                "⚠️ **SIMULATED BOOKING CONFIRMATION REQUIREMENT:**\n" +
                "To issue your simulated booking ID and travel voucher, please click **'Confirm Booking'** in the My Trips portal or reply **'I Confirm'**.";
    }

    private String handleDisruptionAgent(String input, Map<String, Object> prefs) {
        return "⚠️ **Disruption Agent Diagnostic:**\n\n" +
                "Active simulation monitored. When a disruption occurs, the Disruption Agent:\n" +
                "1. Detects schedule discrepancies.\n" +
                "2. Adjusts airport cab pickup and pre-notifies hotels.\n" +
                "3. Rebalances sightseeing without missing key attractions.\n" +
                "4. Enforces human approval in the **Disruption Center** with **₹0 traveler surcharge**.";
    }

    private String handleSupportAgent(String input, Map<String, Object> prefs) {
        return "🛡️ **Support Agent Assistance Center:**\n\n" +
                "• **Cancellation Terms:** Free cancellation on domestic flights up to 24h before departure. Hotels offer free cancellation up to 24h–48h prior.\n" +
                "• **Modifications:** Dates, passenger details, and room categories can be updated anytime in **My Trips**.\n" +
                "• **Multi-State Coverage:** We cover Goa, Manali, Kerala, Jaipur, Hyderabad, Bangalore, Delhi, Tamil Nadu, and international gateways.";
    }

    private void logDecision(String agentType, String action, String convId, Map<String, Object> in, Map<String, Object> out, String decision, long duration) {
        try {
            AgentLog logEntry = new AgentLog(agentType, action, convId, in, out, decision, duration);
            agentLogRepo.save(logEntry);
        } catch (Exception e) {
            log.warn("Failed to write agent log: {}", e.getMessage());
        }
    }
}
