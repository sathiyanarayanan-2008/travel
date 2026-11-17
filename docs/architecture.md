# VoyagePilot AI — System Architecture

VoyagePilot AI is an enterprise-grade Virtual Travel Agent Copilot built for **TBO VOYAGEHACK 4.0**.

## 1. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph Client["Presentation Tier: React + Vite (Port 5173)"]
        UI["Modern B2B Dark Glass UI<br/>(Tailwind v4 + Framer Motion)"]
        Pages["9 Production Pages<br/>Dashboard | Copilot | Itinerary | Flights | Hotels | Budget | Trips | Disruptions | Admin"]
        Router["React Router v7"]
        State["AppContext + Axios Client"]
    end

    subgraph Server["Application Tier: Spring Boot 3.4 (Port 8080)"]
        Controllers["REST Controllers<br/>(/api/chat, /api/trips, /api/offers, /api/bookings, /api/disruptions)"]
        Orchestrator["Agent Orchestrator Service<br/>(Deterministic State Transitions)"]

        subgraph Agents["Autonomous AI Agent Collective"]
            Intent["Intent Agent<br/>(Entity Extraction)"]
            Itin["Itinerary Agent<br/>(Timeline Generation)"]
            Supplier["Supplier Agent<br/>(Mock Feed Aggregation)"]
            Budget["Budget Agent<br/>(Deterministic Optimization)"]
            Booking["Booking Agent<br/>(Explicit Confirmation)"]
            Disruption["Disruption Agent<br/>(Delay Detection & Mitigation)"]
            Support["Support Agent<br/>(Policies & Modification)"]
        end

        subgraph AIAdapter["AI Provider Layer"]
            Gemini["GeminiAiProvider<br/>(Gemini 2.0 Flash)"]
            Fallback["DeterministicFallbackAiProvider<br/>(Offline / No-Key Safety)"]
        end

        Services["Domain Services & Data Seeder"]
    end

    subgraph Data["Persistence Tier: MongoDB (Port 27017)"]
        Collections[("users | trips | itineraries<br/>flight_offers | hotel_offers<br/>bookings | conversations<br/>disruptions | agent_logs")]
    end

    UI --> Router --> State
    State -->|HTTP / JSON with CORS| Controllers
    Controllers --> Services
    Services --> Orchestrator
    Orchestrator --> Agents
    Agents --> Gemini
    Gemini -.->|Failover / No-Key| Fallback
    Services --> Collections
```

---

## 2. Multi-Agent Orchestration Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Travel Agent
    participant Web as React UI
    participant Orch as Agent Orchestrator
    participant Intent as Intent Agent
    participant Supp as Supplier Agent
    participant Budg as Budget Agent
    participant DB as MongoDB

    User->>Web: "Plan a 3-day Goa trip from Chennai for 2 people under INR 30,000"
    Web->>Orch: POST /api/chat
    Orch->>Intent: Extract origin, destination, pax, budget, tags
    Intent-->>Orch: Origin=MAA, Dest=GOI, Pax=2, Budget=30000
    Orch->>Supp: Query mock flights & hotels
    Supp->>DB: Fetch IndiGo, Air India, Seaside Inn, Budget Stay
    DB-->>Supp: Flight & Hotel offers
    Supp-->>Orch: Normalized options
    Orch->>Budg: Compute itemized budget matrix
    Budg-->>Orch: Total = ₹27,500 (Under ₹30,000 cap by ₹2,500)
    Orch->>DB: Log agent decision to agent_logs
    Orch-->>Web: Structured response + UI preference cards
    Web-->>User: Displays Copilot reply & suggests Itinerary inspection
```
