# BaHam: Secure & Compassionate Companion Matching System
### Enterprise-grade platform connecting vulnerable individuals with vetted companionship services.

---

## 1. System Overview

**BaHam** (Persian: *Together*) is a professional, high-affinity secure matching platform designed to connect seekers of non-medical, non-romantic companionship (e.g., senior citizen social assistance, walk-along guides, and hobby partners) with verified and background-checked companions. 

Our mission is to fight social isolation while ensuring full legislative compliance, rigorous trust boundaries, and precise localized matching algorithms.

---

## 2. Technical Architecture

BaHam is implemented using a decoupled, full-stack architecture optimized for low-latency retrieval, high-security data isolation, and real-time messaging synchronization.

```
                  ┌─────────────────────────────────────────┐
                  │          Vite + React Frontend          │
                  │   Interactions, Booking & Messaging     │
                  └────────────┬──────────────┬─────────────┘
                               │              │
                    (REST API) │              │ (Real-Time Subscriptions)
                               ▼              ▼
     ┌───────────────────────────┐          ┌───────────────────────────┐
     │      FastAPI Backend      │          │     Firebase Firestore    │
     │   Ingestion, Compliance,  │          │   Real-time Chat State,   │
     │  Vector Index & Scoring   │          │  Bookings & Interactions  │
     └─────┬───────────────┬─────┘          └───────────────────────────┘
           │               │
           ▼               ▼
     ┌───────────┐   ┌───────────────────────────┐
     │ SQLite DB │   │        LangChain          │
     │ Relational│   │   FAISS Vector Index +    │
     │ Metadata  │   │  Gemini Embeddings & LLM  │
     └───────────┘   └───────────────────────────┘
```

### Core Technologies
*   **Frontend (Single-Page Application)**: Built with **React 18** and **Vite**, utilizing **Tailwind CSS** for responsive desktop-first layout styling. Transitions are powered with fluid layout interactions via **motion**.
*   **Primary Backend Core**: Powered by **FastAPI** (Python), executing synchronous metadata persistence, hosting the compliance framework, and executing real-time matching pipelines.
*   **Vector Engine & LLM Alignment**: Powered by **LangChain** and **FAISS** (Facebook AI Similarity Search). Text profiles are serialized into low-dimensional semantic vectors via standard embeddings (`models/embedding-001` or OpenAI embeddings).
*   **Real-Time Subscriptions & Auth**: Integrated with **Firebase Authentication** and **Cloud Firestore** to enable instant state change callbacks for bookings and chat rooms, keeping UI states reactive and secure.
*   **Metadata Storage**: A lightweight, thread-safe localized **SQLite** database handles transactional companion profile listings and history indexes.

---

## 3. High-Affinity Hybrid Matching Algorithm

To deliver accurate companion suggestions, the FastAPI backend applies a three-tiered algorithmic filtering pipeline:

1.  **Hard Constraint Exclusion (Tier 1)**: Filters candidates by availability overlap and strictly excludes matches exceeding **50 kilometers** using the *Haversine* spherical distance formula.
2.  **Semantic Similarity Analysis (Tier 2)**: Translates seeker conversational requirements and interests into a query vector using Gemini/OpenAI embeddings, and runs an L2-distance nearest-neighbor search through FAISS.
3.  **Composite Index Scoring (Tier 3)**: Computes a final ranking score based on a weighted sum:
    $$\text{Score} = (\text{Semantic Score} \times 0.4) + (\text{Normalized Closeness} \times 0.3) + (\text{Historical Rating} \times 0.3)$$
    The top-ranked, checked candidates are surfaced instantly.

---

## 4. Legislative Compliance (Finnish Act 741/2023)

In accordance with the **Finnish Act on the Supervision of Social Welfare and Health Care Services (741/2023)**, organizers providing auxiliary social care elements must verify the background check status of individuals operating with vulnerable demographics.

### Data Privacy & Storage Principle:
*   **Raw Certificate Isolation**: The platform is strictly prohibited from uploading, scanning, parsing, or saving raw physical or digital criminal record certificates (*rikostaustaote*).
*   **Ephemeral Audit Log Schema**: Only binary check states (`is_background_checked: True/False`) and structural audit verification timestamps (`record_checked_date: UTC datetime`) are recorded. Once marked by an admin, database status reflects verification without compromising GDPR data leakage vectors.

---

## 5. Local Setup & Execution Guide

### Prerequisites
*   Node.js (v18 or higher)
*   Python (v3.10 of higher)

### Step 1: Clone the Repository & Configure Environment Variables
Copy and modify key variables as outlined in `.env.example`:

**For the Root & Frontend**:
Create a `.env` in the root containing:
```env
# Gemini Config
GEMINI_API_KEY="your-gemini-key"

# App URL
APP_URL="http://localhost:3000"

# Firebase Client configuration variables
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="baham-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="baham-app"
VITE_FIREBASE_STORAGE_BUCKET="baham-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:1234:web:abcd"
VITE_FIREBASE_MEASUREMENT_ID="G-ABC"
VITE_FIREBASE_FIRESTORE_DB_ID="default"
```

**For the Backend**:
Create a `.env` file under `/backend` folder:
```env
GEMINI_API_KEY="your-gemini-key"
DATABASE_URL="sqlite:///./baham.db"
```

### Step 2: Install Node Dependencies & Build Frontend
```bash
# From workspace root
npm install
npm run build
```

### Step 3: Run the Development Servers
You can boot up the integrated environment locally.
```bash
# In Terminal 1 - Start the Frontend dev server
npm run dev

# In Terminal 2 - Start the Python Backend server
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Signals\activate
pip install -r requirements.txt
python main.py
```

---

## 6. Execution of Backend Test Suites

We enforce high test coverage (>70%) on critical user flows to guarantee regression immunity and facilitate frictionless transactional due diligence.

The test suite covers:
*   **User Onboarding & Profile Upsert** (`/api/profiles`)
*   **Compliance Timestamp Enforcement** (`/api/admin/verify-background`)
*   **AI Match Pipelines & Similarity Weights** (`/api/match`)

To run the localized unit and integration tests:

```bash
cd backend
pip install pytest pytest-mock httpx
pytest -v test_main.py
```

---

## 7. Security & Input Constraints

To maintain top-tier clinical and regulatory safety boundaries, BaHam implements real-time AI safety moderation.
*   **Scope Compliance**: Inbound messages are processed via the semantic router `/api/safety/analyze-message` using a zero-shot LLM classifier.
*   **Prohibited Requests**: Messages containing dating/romantic solicitation, clinical medication administration, or emergency diagnostic queries are instantly quarantined. The sender and recipient are notified of boundaries with appropriate guidance to emergency social lines.
