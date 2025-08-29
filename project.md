# Multi-Agent Travel Planning System — Project Design

Date: 2025-08-27

This document describes a multi-agent approach to simplifying travel planning by handling research, bookings, budget optimization, and contextual recommendations.

---

## Checklist
- [ ] Problem distilled into goals and constraints
- [ ] Agent roster (roles + responsibilities)
- [ ] System architecture and communication pattern
- [ ] Data sources, models & caching
- [ ] Booking transaction pattern & failure compensation
- [ ] Budget optimization method & interfaces
- [ ] Contextual recommendation approach
- [ ] API / message schemas (examples)
- [ ] MVP scope and 8–12 week project plan
- [ ] Metrics, risks, mitigations


## Problem restatement
Users spend too much time searching across sites, manually comparing costs/availability, and juggling preferences/constraints. The goal is to let a multi-agent system automatically research options, optimize tradeoffs (cost/time/experience), make and manage bookings while providing contextual, trustable recommendations.


## High-level approach
Build a small network of specialized agents that cooperate under a lightweight orchestrator. Core agents:
- Research Agent: gather POIs, prices, travel times, hours, reviews, local events, weather.
- Planner Agent (Orchestrator): composes day-by-day itineraries and enforces constraints.
- Budget Agent: computes cost-optimized plans and trade-off frontiers.
- Booking Agent: performs reservations/holds and confirmations using transactional patterns.
- Recommendation Agent: generates contextual tips, alternatives, and justifications (RAG + LLM).
- User Agent: collects preferences and clarifies constraints via dialogue.
- Data Agent / Cache: manages vector DB + object storage + freshness.
- Monitor Agent: observes bookings / alerts / retries / refunds.

Agents communicate via an event bus (pub/sub) and share a canonical itinerary JSON. LLMs are used for flexible reasoning, re-ranking, and natural language explanations; deterministic modules handle numeric optimization, caching, and API integrations.


## Architecture (text diagram)

UI <-> API Gateway -> Orchestrator (Planner Agent)
  - Event Bus (Kafka / Redis Streams / SQS) connects:
    - Research Agent (POIs, flights, hotels)
    - Budget Agent (optimizer / solver)
    - Recommendation Agent (RAG + LLM)
    - Booking Agent (third‑party APIs)
    - Payment Agent (PCI compliant)
    - Data Agent (vector DB, cache, logs)
    - Monitor Agent (health / alerts)
  - Persistent store: relational DB for users/bookings, vector DB for embeddings, object store for artifacts.


## Agent responsibilities & interactions
- User Agent
  - Input: preferences, constraints, risk tolerance, dates.
  - Output: normalized user profile and clarification questions.
- Research Agent
  - Input: normalized request from Planner.
  - Actions: call Places APIs, aggregator APIs, weather, events, transit travel times.
  - Output: scored candidate items (POI, hotel, flight) with metadata and TTL.
- Budget Agent
  - Input: candidates + constraints (max cost, priorities).
  - Actions: run optimization (knapsack/ILP / greedy + local search) to propose Pareto-optimal itineraries.
  - Output: ranked plan options with cost breakdown.
- Planner Agent (Orchestrator)
  - Orchestrates Research + Budget + Recommendation; produces candidate itineraries and coordinates booking.
- Recommendation Agent (LLM+RAG)
  - Input: plan + local context.
  - Actions: generate human-readable suggestions, highlight tradeoffs, provide alternatives, explain why.
- Booking Agent
  - Input: chosen bookings from user.
  - Actions: perform holds, confirm after payment, manage cancellations, use idempotency keys and compensating transactions.
  - Output: booking confirmations, receipts, status updates.
- Monitor Agent
  - Watches for status changes (flight delays), triggers recommendations/changes.


## Data & models
- Retrieval layer: vector DB (Milvus/Weaviate/RedisVector) storing POI embeddings and cached LLM responses.
- Knowledge sources: Google Places, OpenTripMap, Skyscanner/Amadeus/Affiliates, local events APIs, weather APIs.
- LLM usage:
  - Short-form generation & explanation (OpenAI/Anthropic/etc.)
  - Prompt templates + RAG for facts about businesses and reviews.
  - Use cheaper models for routine summarization; stronger models for complex planning.
- Budget solver: integer linear programming (PuLP / OR-Tools) or heuristic knapsack with constraints for speed.


## Booking transaction pattern (safe booking)
1. Booking Agent requests a hold if API supports it (hotel hold, flight hold).
2. System creates a provisional record with TTL and idempotency token.
3. User confirms and Payment Agent authorizes.
4. Booking Agent confirms booking. If confirmation fails:
   - Retry with exponential backoff (if transient).
   - If permanent failure, run compensating actions (cancel holds) and propose alternatives via Recommendation Agent.
5. Monitor Agent watches provider webhooks and updates status.

Design notes:
- Always surface “confidence & source” to user for each booking candidate.
- Maintain an audit trail for every API call and booking state.


## Budget optimization approach
- Inputs: user budget, preferences (luxury vs economy), must-do items, travel times, booking fees.
- Objectives: minimize cost subject to constraints, or maximize utility (experience score) for a cost cap.
- Technique:
  - Stage 1: filter feasible options with time-window feasibility checks.
  - Stage 2: solve multi-objective optimization:
    - scalarize utility = α * experience_score - β * cost
    - or compute Pareto frontier using repeated runs
  - Use OR-Tools ILP for small problems, fallback to greedy heuristics for speed.
- Output: ranked itinerary alternatives with clear cost/time tradeoffs and sensitivity.


## Contextual recommendations
- Context signals: weather, local events, accessibility requirements, time-of-day, transit strikes, user history, real‑time closures.
- Method:
  - Combine rule-based filters (open hours, travel time) with an LLM re-ranker that ingests RAG context (reviews, latest event data).
  - Provide justifications and sources.


## Canonical itinerary JSON (example)

```json
{
  "tripId":"trip_123",
  "userId":"user_abc",
  "days":[
    {
      "date":"2025-10-21",
      "items":[
        {"type":"activity","id":"poi_92","start":"09:00","end":"11:30","cost":0,"notes":"open 08:00-18:00"},
        {"type":"meal","id":"rest_14","start":"12:00","end":"13:00","cost":25}
      ],
      "dailyCost":25
    }
  ],
  "totalCost":1200,
  "bookings":[
    {"type":"hotel","provider":"providerX","status":"confirmed","providerRef":"ABC123"}
  ],
  "metadata":{"confidence":0.84,"sources":["google_places","providerX"]}
}
```


## Example agent message / prompt patterns
- Research Agent -> Planner (structured)
  - `{ "requestId": "...", "query":"POIs near Tokyo Shibuya", "filters":{...} }`
- LLM prompt (Recommendation Agent)
  - `"Given this itinerary JSON and these user preferences, summarize in 3 bullets why this is a good fit and list 2 lower-cost alternatives. Use sources: [list]."`
- Budget Agent interface
  - Input: candidate list + constraints
  - Output: ranked itineraries + solver diagnostics


## APIs and contracts (example)
- POST /api/plan
  - body: { userId, dates, destination, preferences }
  - returns: { planOptions: [itinerary], requestId }
- POST /api/book
  - body: { requestId, selections, paymentMethod }
  - returns: { bookingStatus, receipts }


## Failure modes & mitigations
- Missing / stale provider data -> caching + TTL; fallback to alternatives.
- Booking partial failure -> compensating transactions + immediate user notification + automatic retry / alternative suggestion.
- LLM hallucinations -> attach source / RAG evidence; rule-validate factual fields.
- Cost spikes -> surface estimated fees and require explicit user confirmation.


## Privacy & compliance
- Payment handling must be PCI compliant (or use third-party processors).
- Personal data minimalization; store only necessary data; allow deletion.
- Provide clear consent for data usage and third-party bookings.


## Evaluation metrics (success)
- Time-to-first-itinerary (target < 30s)
- Booking success rate (target > 95% for supported partners)
- Cost vs baseline (avg % saving vs naive booking)
- User satisfaction / NPS after first trip
- Retention (30/90 day)
- Recovery time and user-visible failures (MTTR)


## MVP scope
- Input form (destination + dates + simple prefs)
- Research Agent: POI + hotels + simple flight quotes (cached)
- Planner Agent: produce 1–3 itinerary options
- Budget Agent: basic cost optimization (greedy)
- Booking Agent: hotel affiliate link + simple hold/confirm with a single provider or redirect
- Recommendation Agent: short LLM summary + 2 alternatives
- Monitoring: basic booking state tracking


## 8‑week roadmap (MVP)
- Week 0: Design & infra (data sources, provider keys)
- Weeks 1–2: Frontend UI + Planner stub + Research Agent (stubs)
- Weeks 3–4: Budget Agent + produce ranked itineraries; integrate vector cache
- Weeks 5–6: Booking flows (affiliate integration), Payment stub
- Week 7: Recommendation Agent (LLM prompts + RAG)
- Week 8: QA, small user test, deploy demo, measure metrics


## Tech stack suggestions
- Frontend: React (Vite)
- Backend: Node.js/Express or serverless (AWS Lambda / Vercel)
- Message bus: Redis Streams or Kafka
- Solver: OR-Tools or PuLP (Python microservice) or JS heuristic library
- Vector DB: Pinecone / Milvus / RedisVector
- LLM: OpenAI or Anthropic + RAG layer
- Storage: PostgreSQL (bookings), S3 (artifacts)
- Monitoring: Sentry + Prometheus


## Quick prototypes & test ideas
- Single-agent prototype that:
  - Researches POIs via Google Places
  - Runs a simple greedy budget routine
  - Returns plan JSON + LLM explanation
  - This validates end-to-end flow before multi-agent split.


## Risks & mitigations
- Cost of LLMs -> cache, use smaller models, limit tokens
- Integration complexity -> start with one provider & expand
- Trust/accuracy -> RAG, provenance, user editing, explicit confirmations


## Next steps
- Produce an architecture diagram (Mermaid or SVG)
- Generate example prompt templates and starter repo layout (backend + agents)
- Create initial `plan` API and a stubbed Planner Agent integrated with the React frontend


---

*Project design created and saved to `project.md`.*
