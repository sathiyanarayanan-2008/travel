# VoyagePilot AI — Technical Documentation

## 1. Multi-Agent System Design

VoyagePilot AI employs an orchestrated multi-agent pattern rather than an unconstrained autonomous loop. This architectural decision ensures strict determinism in pricing, reliable supplier availability, and transparent state transitions.

### Agent Collective

| Agent | Responsibility | Ingestion / Input | Output / State Transition |
| :--- | :--- | :--- | :--- |
| **Intent Agent** | Extracts core trip parameters (origin, destination, dates, headcount, budget, interests) | Natural language queries | Entity graph in `Conversation.extractedPreferences` |
| **Supplier Agent** | Queries and normalizes offers from simulated supplier endpoints | Entity filter params | Normalized `FlightOffer` and `HotelOffer` collections |
| **Itinerary Agent** | Generates chronological day-by-day activities matching flight arrival and hotel check-in | User constraints + Supplier offers | Structured `Itinerary` with time slots and categories |
| **Budget Agent** | Computes itemized expense breakdown, tests what-if alternatives, and ranks tiers | Itinerary activities + budget cap | Deterministic cost matrix and savings suggestions |
| **Booking Agent** | Validates selections, enforces explicit approval, and generates simulated records | `BookingRequest` with `confirmed=true` | Simulated `Booking` document with unique voucher ID |
| **Disruption Agent** | Detects simulated delays/overbookings and calculates compensatory arrangements | Injected disruption telemetry | Disruption proposal awaiting approval |
| **Support Agent** | Answers policy queries and processes simulated cancellations/modifications | Booking reference + user intent | Updated booking status and policy guidance |

---

## 2. Orchestration & State Transition Safeguards

- **No Hallucinated Pricing:** Prices and room/seat availability are strictly fetched from MongoDB supplier collections (`flight_offers`, `hotel_offers`), never hallucinated by LLM generation.
- **Explicit Confirmation Barrier:** `BookingService` rejects requests where `confirmed != true`.
- **Protected Disruption Mutability:** Active bookings and itineraries are **never** mutated silently when disruptions occur; changes remain in `pending` status until an authorized agent or user clicks **Approve**.
- **Audit Logging:** Every orchestration dispatch is recorded in the `agent_logs` collection with execution latency, decision summary, and input/output payloads.

---

## 3. Data Model & Collections Schema

### `users`
- `_id`: String (e.g. `demo-traveler-01`)
- `name`: String
- `email`: String
- `role`: String (`TRAVELER`, `TRAVEL_AGENT`, `ADMIN`)
- `createdAt`: ISODate

### `trips`
- `_id`: String (e.g. `TRIP-GOA-001`)
- `userId`: String
- `origin`, `destination`: String
- `startDate`, `endDate`: String
- `durationDays`, `travelers`: Integer
- `budget`, `totalCost`: Double
- `status`: String (`PLANNING`, `BOOKED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`)
- `bookingId`: String
- `interests`: Array of Strings

### `flight_offers`
- `_id`: String (e.g. `FL001`)
- `airline`, `flightNo`, `origin`, `destination`: String
- `departure`, `arrival`, `duration`: String
- `stops`: Integer
- `price`, `originalPrice`: Double
- `baggage`, `supplier`, `cancellation`, `meals`, `flightClass`: String
- `availability`: Integer

### `hotel_offers`
- `_id`: String (e.g. `HT001`)
- `name`, `location`, `roomType`, `supplier`, `destination`: String
- `rating`, `pricePerNight`, `originalPrice`: Double
- `amenities`: Array of Strings
- `availability`: Integer
- `cancellation`, `description`: String

### `bookings`
- `_id`: String (e.g. `BK-VP-2024-9428`)
- `bookingReference`: String
- `tripId`, `userId`: String
- `totalAmount`: Double
- `status`: String (`PENDING`, `CONFIRMED`, `CANCELLED`, `MODIFIED`)
- `simulated`: Boolean (`true`)

### `disruptions`
- `_id`: String
- `type`, `severity`, `title`, `description`, `affectedBookingId`: String
- `status`: String (`pending`, `approved`, `rejected`, `resolved`)
- `proposal`: Object (`summary`, `changes`, `costImpact`)

---

## 4. Security & Compliance Architecture

1. **Zero Secret Leakage:** `GEMINI_API_KEY` is loaded exclusively on the Spring Boot backend via server environment variables. It is never exposed in client bundles or network responses.
2. **Deterministic Offline Safeguard:** In the absence of an API key or during network isolation, the application automatically switches to `DeterministicFallbackAiProvider`.
3. **Safe CORS Policy:** Restricts allowed origins to local development servers (`http://localhost:5173`, `http://127.0.0.1:5173`).
4. **Input Sanitization & Validation:** All incoming REST payloads undergo Jakarta Bean Validation (`@Valid`, `@NotBlank`).

---

## 5. Known Limitations & Roadmap

- **Simulated Supplier Integration:** Real-world deployments require replacing mock supplier repositories with TBO GDS XML/JSON web services and live OAuth credentials.
- **Payment Processing:** Real payment gateways (e.g., Stripe, Razorpay) are omitted by design in this hackathon prototype to adhere to fair demonstration criteria.
