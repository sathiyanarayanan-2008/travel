# VoyagePilot AI — Live Demo Walkthrough & Speaking Script

**Event:** TBO VOYAGEHACK 4.0  
**Project:** VoyagePilot AI – Virtual Travel Agent Copilot  
**Presenter Duration:** ~5–7 Minutes  

---

## Benchmark Scenario Script

### Scene 1: Introduction & Dashboard Overview (0:00 – 1:00)
- **Action:** Open browser at `http://localhost:5173`.
- **Speaking Script:**
  > *"Respected judges and mentors, welcome to VoyagePilot AI — an autonomous Virtual Travel Agent Copilot built for TBO VoyageHack 4.0.*  
  > *Traditional travel agents spend hours cross-referencing GDS screens, hotel bedbanks, budgeting spreadsheets, and handling panicked calls during delays. VoyagePilot AI coordinates 7 specialized AI agents — Intent, Itinerary, Supplier, Budget, Booking, Disruption, and Support — into a seamless agentic co-pilot."*
- **Action:** Point out the dark navy B2B dashboard, live metrics, travel spend chart, and active portfolios.

---

### Scene 2: Natural Language Request & Intent Extraction (1:00 – 2:15)
- **Action:** Navigate to **AI Copilot** (`/copilot`). Click the suggested benchmark prompt:
  `"Plan a 3-day Goa trip from Chennai for 2 people under INR 30,000, with beaches, affordable hotels, and morning flights."`
- **Speaking Script:**
  > *"Let's test our primary benchmark scenario. Notice how the Intent Agent parses the unstructured natural language prompt and extracts the core entity graph on the right panel: Origin (Chennai), Destination (Goa), Duration (3 Days), Travelers (2 Pax), and Budget Cap (₹30,000). The Supplier Agent immediately matches verified mock inventory across IndiGo, Air India, and local hotel suppliers."*

---

### Scene 3: Day-by-Day Smart Itinerary & Offer Verification (2:15 – 3:15)
- **Action:** Navigate to **Itinerary Builder** (`/itinerary`) and **Flight Comparison** (`/flights`).
- **Speaking Script:**
  > *"The Itinerary Agent constructs a realistic, chronologically verified timeline for Days 1, 2, and 3. Notice that morning flight IndiGo 6E-2041 arrives at 08:00 AM, matching our 10:30 AM check-in at Seaside Comfort Inn and afternoon activities at Baga Beach.*  
  > *All items are editable — an agent can add or remove experiences with instant cost recalibration. Furthermore, our Flight and Hotel comparison matrices show verified normalized offers with transparent baggage, meals, and cancellation rules."*

---

### Scene 4: What-If Replanning & Budget Optimization (3:15 – 4:00)
- **Action:** Navigate to **Budget Optimizer** (`/budget`).
- **Speaking Script:**
  > *"Now, imagine the traveler asks: 'Can we make the hotel cheaper?'.*  
  > *With one click, our Budget Agent swaps Seaside Comfort Inn (₹2,200/night) for Budget Stay Goa (₹1,200/night). Notice the instant recalculation: the trip total drops from ₹27,500 down to ₹25,500, creating an expanded savings cushion of ₹4,500 under our ₹30,000 ceiling. All budget calculations are deterministic and backed by our automated test suite."*

---

### Scene 5: Booking Confirmation & Simulated Voucher (4:00 – 5:00)
- **Action:** Navigate to **My Trips** (`/trips`). Open the voucher modal.
- **Speaking Script:**
  > *"VoyagePilot strictly adheres to ethical hackathon guidelines: reservations require explicit user confirmation. Once approved, the system generates a simulated booking reference like `BK-VP-2024-9428` and an itemized travel voucher with prominent SIMULATED BOOKING disclosures. Travelers and agents can print or save this voucher directly."*

---

### Scene 6: Disruption Simulation & Autonomous Mitigation (5:00 – 6:15)
- **Action:** Open **Demo Admin** (`/admin`), trigger **"Inject Flight Delay Scenario"**, then switch to **Disruption Center** (`/disruptions`).
- **Speaking Script:**
  > *"Now for the ultimate differentiator: disruption handling. The judge or admin triggers a 3-hour flight delay on IndiGo 6E-2041 due to coastal weather.*  
  > *Instead of leaving the traveler stranded, the Disruption Agent immediately activates: it detects the delay, reschedules the Goa airport cab to 12:00 PM, notifies the hotel of late check-in, and shifts lunch to 1:30 PM — all with zero financial surcharge.*  
  > *Critically, the booking is never silently mutated: human-in-the-loop approval is mandatory. When we click 'Approve & Update Itinerary', the saved itinerary is refreshed with the revised timeline."*

---

### Scene 7: Wrap-up & Technical Credibility (6:15 – 7:00)
- **Speaking Script:**
  > *"To summarize: VoyagePilot AI delivers a production-grade full-stack architecture — React 19 with Tailwind v4 on the frontend, Java 21 Spring Boot 3.4 on the backend, MongoDB for persistence, and Gemini 2.0 with a deterministic offline failover. Thank you!"*
