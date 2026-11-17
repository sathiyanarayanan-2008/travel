# ✈️ VoyagePilot AI — Virtual Travel Agent Copilot
> **TBO VOYAGEHACK 4.0 Hackathon Prototype**  
> An autonomous multi-agent copilot demonstrating the full travel lifecycle: planning, supplier comparison, smart itinerary generation, budgeting, simulated booking, and disruption mitigation.

---

## 🌟 Key Highlights & Engineering Features

- **7 Coordinated AI Agents:**
  - 🧠 **Intent Agent:** Natural language entity extraction (origin, destination, dates, travelers, budget, constraints).
  - 🗺️ **Itinerary Agent:** Realistic day-by-day activity timelines aligned with flights and hotel check-in.
  - 🔍 **Supplier Agent:** Normalizes seeded mock offers across multiple GDS / Bedbank feeds (IndiGo, Air India, SpiceJet, Vistara, Seaside Comfort Inn, Budget Stay Goa, The Leela).
  - 💰 **Budget Agent:** Itemized cost calculations, tier comparisons, and instant replanning when travelers request cheaper alternatives.
  - 📑 **Booking Agent:** Programmatic enforcement of explicit traveler confirmation; generates simulated booking references and printable vouchers.
  - ⚠️ **Disruption Agent:** Detects flight delays / overbookings, proposes compensatory schedule adjustments with ₹0 surcharge, and awaits approval.
  - 🛡️ **Support Agent:** Advises on cancellation policies and handles simulated modifications.
- **Dual-Engine AI System:**
  - Backend adapter for Google Gemini 2.0 Flash via server-side `GEMINI_API_KEY`.
  - Deterministic offline fallback engine guarantees 100% demo availability without an API key or internet access.
- **Enterprise Tech Stack:**
  - **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React, Axios, Recharts.
  - **Backend:** Java 21+ (built & tested on JDK 26), Spring Boot 3.4.1, Apache Maven 3.9.9, Jakarta Validation.
  - **Database:** MongoDB persistence for 9 collections with automated `DataSeeder`.

---

## 🚀 Quick Start Guide (Windows PowerShell)

### Prerequisites
- **Java 21+** (Check via `java --version`)
- **Node.js 20+** (Check via `node --version`)
- **MongoDB** running locally on port 27017 (Default: `mongodb://localhost:27017`)

---

### Step 1: Start the Spring Boot Backend

Open a PowerShell terminal and run:

```powershell
cd "c:\Users\User\OneDrive\Desktop\TBO hackthon\backend"

# Run tests and start Spring Boot on port 8080
.\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run
```

*(Alternatively, run the pre-built standalone executable JAR:)*
```powershell
cd "c:\Users\User\OneDrive\Desktop\TBO hackthon\backend"
java -jar target\voyagepilot-api-1.0.0.jar
```

The backend starts at `http://localhost:8080`. Seed data is loaded automatically into MongoDB on startup!

---

### Step 2: Start the React Frontend

Open a second PowerShell terminal and run:

```powershell
cd "c:\Users\User\OneDrive\Desktop\TBO hackthon\frontend"

# Launch Vite development server
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🧪 Running Automated Unit Tests

In PowerShell, execute:

```powershell
cd "c:\Users\User\OneDrive\Desktop\TBO hackthon\backend"
.\apache-maven-3.9.9\bin\mvn.cmd test
```

**Results:**
- `BudgetCalculationTest`: 3/3 Passed (Verifies Goa budget math & hotel swap savings).
- `BookingValidationTest`: 1/1 Passed (Enforces explicit confirmation before booking creation).

---

## 🎯 8-Step Judge Demonstration Scenario

Follow these steps for the benchmark hackathon evaluation:

1. **Dashboard Overview:** Open `http://localhost:5173`. Inspect travel spend trends and active portfolios.
2. **AI Copilot Planning:** Click **AI Copilot** on the sidebar. Click the suggested prompt:
   > *"Plan a 3-day Goa trip from Chennai for 2 people under INR 30,000, with beaches, affordable hotels, and morning flights."*  
   Notice the **Intent Agent** extract the entity graph into the right panel.
3. **Smart Itinerary Builder:** Navigate to **Itinerary Builder** (`/itinerary`) to inspect the chronological Day 1, 2, and 3 schedule. Test adding or removing activities.
4. **Supplier Feeds Comparison:** Open **Flight Comparison** (`/flights`) and **Hotel Comparison** (`/hotels`) to inspect normalized mock supplier cards with baggage and cancellation policies.
5. **Cheaper Hotel Replanning:** Open **Budget Optimizer** (`/budget`). Click **"Swap Cheaper Hotel (-₹2,000)"**. Total recalculates from ₹27,500 down to ₹25,500.
6. **Simulated Booking & Voucher:** Open **My Trips** (`/trips`). View the itemized travel voucher for booking `BK-VP-2024-9428` with prominent `SIMULATED BOOKING` disclosure. Test the print/PDF option.
7. **Simulate a Flight Delay:** Open **Demo Admin** (`/admin`). Click **"Inject Flight Delay Scenario"** (IndiGo 6E-2041 delayed by 3 hours).
8. **Disruption Center Mitigation:** Open **Disruption Center** (`/disruptions`). Review the Disruption Agent's proposed schedule adjustment (pickup shifted to 12:00 PM, late check-in pre-notified, ₹0 cost impact). Click **"Approve & Update Itinerary"**.

---

## 📁 Project Directory Structure

```text
├── backend/
│   ├── apache-maven-3.9.9/           # Bundled Apache Maven build tool
│   ├── src/main/java/com/voyagepilot/
│   │   ├── config/                   # CORS & Global Exception Handler
│   │   ├── controller/               # REST Endpoints (/chat, /trips, /offers, /bookings, /disruptions)
│   │   ├── dto/                      # Strongly typed Request / Response DTOs
│   │   ├── model/                    # MongoDB Documents (User, Trip, FlightOffer, Booking, etc.)
│   │   ├── repository/               # Spring Data Mongo Repositories
│   │   ├── service/                  # Business Logic & Agent Orchestrator
│   │   │   └── ai/                   # Gemini 2.0 Adapter & Deterministic Fallback
│   ├── src/test/java/                # JUnit Unit Tests
│   ├── pom.xml                       # Maven Configuration (Spring Boot 3.4.1)
│   └── mvnw.cmd                      # Maven Wrapper script
├── frontend/
│   ├── src/
│   │   ├── api/                      # Axios client & endpoints
│   │   ├── components/layout/        # Responsive Sidebar, TopBar, Main Layout
│   │   ├── components/ui/            # GlassCard, Button, LoadingSkeleton, Notifications
│   │   ├── context/                  # AppContext & State Reducer
│   │   ├── pages/                    # 9 Core Hackathon Pages
│   │   ├── App.jsx                   # React Router Configuration
│   │   └── index.css                 # Tailwind CSS v4 Theme
│   ├── package.json
│   └── vite.config.js
├── demo-data/                        # JSON seed files & seed-mongodb.js script
├── docs/                             # Full Hackathon Documentation Suite
│   ├── api.md                        # REST API Specification
│   ├── architecture.md               # Mermaid Architecture & Sequence Diagrams
│   ├── tests.md                      # Automated Test Suite Execution Logs
│   ├── demo-walkthrough.md           # Speaking Script & Live Demo Guide
│   ├── round2-presentation.md        # 10-Slide Presentation Deck Outline
│   ├── technical-documentation.md    # Multi-Agent Orchestration & Security Spec
│   └── demo-readiness-checklist.md   # Final Verification Checklist
├── .env.example                      # Safe Environment Variable Template
├── .gitignore
└── README.md
```

---

## 🛡️ Hackathon Truth-in-Advertising Notice

This project is an advanced, technically credible architectural prototype built for **TBO VOYAGEHACK 4.0**. All mock flight schedules, room rates, and booking records are clearly tagged with `[SIMULATED DATA]` badges. No real credit cards or external bank payments are processed.
