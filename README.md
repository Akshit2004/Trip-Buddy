<div align="center">

  <h1>🌍 Trip Buddy ✈️</h1>

  <h3>Your Ultimate AI-Powered Travel Companion</h3>

  <p>
    Plan your dream trip in seconds. Discover hidden gems. Seamless hotel & flight booking.
  </p>

  <!-- Badges -->
  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    </a>
    <a href="https://react.dev">
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    </a>
    <a href="https://firebase.google.com">
      <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
    </a>
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>

  <img src="https://img.shields.io/github/repo-size/Akshit2004/Trip-Buddy?style=flat-square&color=3B82F6" alt="Repo Size" />
  <img src="https://img.shields.io/github/issues/Akshit2004/Trip-Buddy?style=flat-square&color=3B82F6" alt="Issues" />
  <img src="https://img.shields.io/github/license/Akshit2004/Trip-Buddy?style=flat-square&color=3B82F6" alt="License" />

</div>

<br />

## 🚀 Overview

**Trip Buddy** is your personal AI travel agent. Built with the latest web technologies, it seamlessly blends flight and hotel booking with intelligent trip planning. Whether you're a solo backpacker or planning a family vacation, Trip Buddy curates the perfect itinerary for you.

> 💭 *"The world is a book and those who do not travel read only one page."* - St. Augustine

---

## ✨ Key Features

<table>
  <tr>
    <td width="50%">
      <h3>🤖 AI Trip Planner</h3>
      <p>Stop spending hours researching. Let our AI generate a personalized day-by-day itinerary based on your interests and budget.</p>
    </td>
    <td width="50%">
      <h3>🏨 Seamless Booking</h3>
      <p>Integrated search for the best deals on hotels and flights with real-time availability.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔐 Secure & Personalized</h3>
      <p>Powered by Firebase for secure login/signup and profile management to keep track of your bookings.</p>
    </td>
    <td width="50%">
      <h3>📱 Responsive Design</h3>
      <p>Mobile-first design optimized for on-the-go usage, crafted with Tailwind CSS and Framer Motion.</p>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend & Services | Tools |
| :--- | :--- | :--- |
| ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js&logoColor=white) | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black) | ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) |
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | ![Firestore](https://img.shields.io/badge/Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black) | ![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white) |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | ![OpenAI API](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white) | ![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white) |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | ![Zustand](https://img.shields.io/badge/Zustand-orange?style=flat-square) | ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | | |

</div>

---

## 🗺️ User Journey

```mermaid
graph TB
    Start([User Visits Trip Buddy]) --> HasAccount{Has Account?}
    
    HasAccount -->|Yes| Login[Login with Firebase]
    HasAccount -->|No| Signup[Create Account]
    
    Signup --> Onboarding[Onboarding Flow]
    Onboarding --> Dashboard
    Login --> Dashboard[User Dashboard]
    
    Dashboard --> Choice{What to do?}
    
    Choice -->|Plan Trip| AIPlanner[AI Trip Planner]
    Choice -->|Book Direct| Search[Search Hotels/Flights]
    Choice -->|View Saved| ViewTrips[My Trips]
    
    AIPlanner --> Preferences[Set Preferences]
    Preferences --> Generate[AI Generates Itinerary]
    Generate --> Review[Review & Customize]
    Review --> Save[Save Trip]
    
    Search --> Filters[Apply Filters]
    Filters --> Results[View Results]
    Results --> Details[View Details]
    Details --> Book[Book & Pay]
    
    Save --> Confirmation
    Book --> Confirmation[Booking Confirmed]
    ViewTrips --> Confirmation
    
    Confirmation --> Enjoy([Enjoy Your Trip!])
    
    style Start fill:#3B82F6,stroke:#1E40AF,color:#fff
    style Enjoy fill:#10B981,stroke:#059669,color:#fff
    style AIPlanner fill:#8B5CF6,stroke:#6D28D9,color:#fff
    style Generate fill:#F59E0B,stroke:#D97706,color:#fff
    style Dashboard fill:#06B6D4,stroke:#0891B2,color:#fff
```

---

## 🏗️ System Architecture

```mermaid
graph LR
    subgraph Client["Client Layer"]
        Browser[Web Browser]
        UI[React UI Components]
        State[Zustand State]
    end
    
    subgraph Presentation["Presentation Layer"]
        NextJS[Next.js App Router]
        SSR[Server Components]
        CSR[Client Components]
    end
    
    subgraph Business["Business Logic"]
        ServerActions[Server Actions]
        TripPlanner[AI Trip Planner]
        BookingEngine[Booking Engine]
        UserService[User Service]
    end
    
    subgraph Data["Data Layer"]
        Firebase[(Firebase Auth)]
        Firestore[(Firestore DB)]
    end
    
    Browser --> UI
    UI --> State
    UI --> NextJS
    
    NextJS --> SSR
    NextJS --> CSR
    
    SSR --> ServerActions
    CSR --> ServerActions
    
    ServerActions --> TripPlanner
    ServerActions --> BookingEngine
    ServerActions --> UserService
    
    TripPlanner --> Firestore
    BookingEngine --> Firestore
    UserService --> Firebase
    UserService --> Firestore
    
    style Client fill:#E0E7FF,stroke:#4F46E5,stroke-width:2px
    style Presentation fill:#DBEAFE,stroke:#3B82F6,stroke-width:2px
    style Business fill:#FEF3C7,stroke:#F59E0B,stroke-width:2px
    style Data fill:#D1FAE5,stroke:#10B981,stroke-width:2px
```

---

## 📂 Repository Structure

```tree
Trip-Buddy/
├── 📁 app/                     # Next.js App Router pages
│   ├── 🤖 ai-trip/             # AI Trip Generation pages
│   ├── 🔌 api/                 # API Routes
│   ├── 💳 checkout/            # Checkout process
│   ├── 📄 details/             # Hotel/Flight details
│   ├── 🔑 login/               # Login page
│   ├── 🚀 onboarding/          # User onboarding flow
│   ├── 👤 profile/             # User profile & bookings
│   ├── 🔍 search/              # Search results page
│   ├── ✍️  signup/              # Signup page
│   ├── 🗺️  trip/                # Trip details page
│   ├── 📐 layout.tsx           # Root layout with providers
│   ├── 🏠 page.tsx             # Landing page
│   └── 🎨 globals.css          # Global styles
├── 📁 components/              # Reusable UI components
├── 📁 lib/                     # Utilities & Config
├── 📁 types/                   # TypeScript Definitions
├── 📁 public/                  # Static assets
├── 🔐 .env                     # Environment variables
└── 📦 package.json             # Dependencies
```

---

## 🏁 Getting Started

### Prerequisites

*   **Node.js**: v18 or higher
*   **npm**: Latest version

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Akshit2004/Trip-Buddy.git
    cd Trip-Buddy
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env` file in the root directory:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🛣️ Roadmap

- [x] **Phase 1: Foundation** (Setup, Auth, Basic UI)
- [x] **Phase 2: Core Features** (AI Trip Logic, Search UI, Dashboard)
- [ ] **Phase 3: Advanced Features**
    - [ ] Real-time Collaboration
    - [ ] Offline Mode (PWA)
    - [ ] Multi-language Support
    - [ ] Payment Gateway Integration

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

<div align="center">

Made with ❤️ by [Akshit](https://github.com/Akshit2004)

[![GitHub followers](https://img.shields.io/github/followers/Akshit2004?style=social)](https://github.com/Akshit2004)
[![GitHub stars](https://img.shields.io/github/stars/Akshit2004/Trip-Buddy?style=social)](https://github.com/Akshit2004/Trip-Buddy)

</div>
