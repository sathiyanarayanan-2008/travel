# VoyagePilot AI — REST API Documentation

This document describes the complete REST API interface for **VoyagePilot AI**, developed for the **TBO VOYAGEHACK 4.0** hackathon.

Base URL: `http://localhost:8080` (or `http://localhost:5173/api` via Vite dev proxy)

---

## Response Envelope Format

All response payloads (except offer listings) are encapsulated in the standard JSON envelope:

```json
{
  "success": true,
  "message": "Operation status description",
  "data": { ... },
  "timestamp": "2026-11-17T13:30:00Z"
}
```

---

## 1. Conversational Agent Copilot

### `POST /api/chat`
Dispatches the traveler or travel agent prompt to the multi-agent orchestrator.

**Request Body:**
```json
{
  "message": "Plan a 3-day Goa trip from Chennai for 2 people under INR 30,000, with beaches, affordable hotels, and morning flights.",
  "conversationId": "demo-conv-1",
  "context": {}
}
```

**Response (200 OK):**
```json
{
  "reply": "🌴 Itinerary Agent Generated 3-Day Plan (Chennai → Goa): ... [SIMULATED DATA]",
  "agentType": "Itinerary",
  "extractedData": {
    "origin": "Chennai",
    "destination": "Goa",
    "duration": "3 Days",
    "travelers": 2,
    "budget": "₹30,000",
    "interests": ["Beaches", "Affordable Hotels", "Morning Flights"]
  },
  "conversationId": "demo-conv-1"
}
```

---

## 2. Trip Portfolio Management

### `POST /api/trips`
Persists a new planned trip in MongoDB.

### `GET /api/trips`
Retrieves all customer trip portfolios.

### `GET /api/trips/{id}`
Retrieves specific trip portfolio by database ID.

### `POST /api/trips/{id}/replan`
Re-runs budget or constraint optimization on an existing trip.

---

## 3. Supplier Comparison Engine

### `GET /api/offers/flights`
Returns normalized mock flight offers across suppliers (IndiGo, Air India, SpiceJet, Vistara).

**Query Parameters:**
- `origin` (optional, e.g. `MAA`)
- `destination` (optional, e.g. `GOI`)

### `GET /api/offers/hotels`
Returns normalized mock hotel offers across suppliers (Seaside Comfort Inn, Goa Beach Resort, Budget Stay Goa, The Leela).

**Query Parameters:**
- `destination` (optional, e.g. `GOI`)

---

## 4. Booking & Voucher Verification

### `POST /api/bookings`
Generates a simulated booking reference after explicit traveler confirmation.

**Request Body:**
```json
{
  "tripId": "TRIP-GOA-001",
  "flightOfferId": "FL001",
  "hotelOfferId": "HT001",
  "travelers": 2,
  "confirmed": true
}
```

### `GET /api/bookings/{id}`
Retrieves booking voucher data.

### `POST /api/bookings/{id}/cancel`
Simulates booking cancellation with zero penalty under supplier policy.

### `POST /api/bookings/{id}/modify`
Modifies traveler count or travel dates.

---

## 5. Disruption Management Engine

### `POST /api/disruptions/simulate`
Injects an operational supplier anomaly (flight delay, cancellation, hotel overbooking).

**Request Body:**
```json
{
  "type": "FLIGHT_DELAY",
  "bookingId": "BK-VP-2024-9428",
  "description": "IndiGo 6E-2041 delayed by 3 hours due to coastal monsoon weather.",
  "severity": "high"
}
```

### `POST /api/disruptions/{id}/approve`
Formally approves the Disruption Agent's proposed itinerary adjustment.

### `GET /api/disruptions`
Lists all active, pending, and resolved disruptions.
