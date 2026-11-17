package com.voyagepilot.service.ai;

import org.springframework.stereotype.Component;
import java.util.Map;

@Component("fallbackAiProvider")
public class DeterministicFallbackAiProvider implements AiProvider {

    @Override
    public String generateResponse(String systemPrompt, String userMessage, Map<String, Object> context) {
        String query = userMessage.toLowerCase();

        if (query.contains("cheaper hotel") || query.contains("cheap hotel") || query.contains("lower budget")) {
            return "🏨 **Budget Agent Suggestion:**\n\n" +
                    "I analyzed alternative supplier feeds and found **Budget Stay Goa** in Anjuna for **₹1,200/night** (vs Seaside Comfort Inn at ₹2,200/night).\n\n" +
                    "• **Previous Trip Total:** ₹27,500\n" +
                    "• **Updated 2-Night Hotel Total:** ₹2,400 *(Savings: ₹2,000)*\n" +
                    "• **Recalculated Trip Total:** **₹25,500**\n" +
                    "• **Remaining Budget:** ₹4,500 under your ₹30,000 cap.\n\n" +
                    "⚠️ [SIMULATED DATA] The itinerary and budget matrix have been adjusted accordingly.";
        }

        if (query.contains("flight") || query.contains("morning flight")) {
            return "✈️ **Supplier Agent Flight Match:**\n\n" +
                    "Retrieved normalized domestic flight offers for **Chennai (MAA) → Goa (GOI)**:\n\n" +
                    "1. **IndiGo 6E-2041** | 06:15 – 08:00 (1h 45m) | Non-Stop | **₹4,500/pax** *(Recommended Morning)*\n" +
                    "2. **Air India AI-671** | 07:30 – 09:30 (2h 00m) | Non-Stop | **₹5,200/pax** *(25kg Baggage)*\n" +
                    "3. **SpiceJet SG-514** | 09:00 – 11:15 (2h 15m) | 1-Stop | **₹3,200/pax** *(Budget Option)*\n" +
                    "4. **Vistara UK-882** | 11:45 – 13:30 (1h 45m) | Non-Stop | **₹6,800/pax**\n\n" +
                    "All fares include mock airport taxes. [SIMULATED DATA]";
        }

        if (query.contains("cancel") || query.contains("policy") || query.contains("refund")) {
            return "🛡️ **Support Agent Policy Summary:**\n\n" +
                    "• **IndiGo 6E-2041:** 100% free cancellation up to 24h prior to departure.\n" +
                    "• **Seaside Comfort Inn:** Free cancellation until 48h prior to check-in.\n" +
                    "• **Budget Stay Goa:** Free cancellation until 24h prior to check-in.\n\n" +
                    "⚠️ [SIMULATED DATA] All cancellations require explicit traveler confirmation.";
        }

        if (query.contains("delay") || query.contains("disrupt")) {
            return "⚠️ **Disruption Agent Alert:**\n\n" +
                    "A 3-hour delay has been detected on IndiGo 6E-2041 (MAA → GOI). New departure: 09:30 AM.\n\n" +
                    "**Proposed Resolution:**\n" +
                    "• Reschedule airport cab pickup to 12:00 PM\n" +
                    "• Delayed hotel check-in at 12:30 PM (pre-notified)\n" +
                    "• Lunch shifted to 1:30 PM at Britto's\n" +
                    "• No financial impact (Cost delta: ₹0)\n\n" +
                    "Approval required in the Disruption Center before changes are applied.";
        }

        // Default itinerary planning response
        return "🌴 **VoyagePilot Orchestrator — 3-Day Goa Plan:**\n\n" +
                "• **Route:** Chennai (MAA) → Goa (GOI) for 2 Travelers\n" +
                "• **Flight:** IndiGo 6E-2041 morning non-stop (06:15 – 08:00 AM)\n" +
                "• **Hotel:** Seaside Comfort Inn, Calangute (Deluxe Balcony Room)\n" +
                "• **Key Highlights:** Baga beach water sports, Old Goa UNESCO heritage tour, Martin's Corner dining, and Sahakari Spice Plantation tour.\n\n" +
                "💰 **Estimated Grand Total:** **₹27,500** *(Under your ₹30,000 budget cap with ₹2,500 buffer)*\n\n" +
                "⚠️ [SIMULATED DATA] You can inspect the full day-by-day plan in the **Smart Itinerary Builder** or compare alternate hotels in the **Budget Optimizer**.";
    }

    @Override
    public String getProviderName() {
        return "deterministic-fallback";
    }

    @Override
    public boolean isAvailable() {
        return true;
    }
}
