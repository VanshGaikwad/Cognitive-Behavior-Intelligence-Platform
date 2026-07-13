# 🧠 Cognitive Behavior Intelligence Platform – Focus & Habit Tracker

**A React + Tailwind + Firebase web application** that helps users log daily activities, review history, track streaks with a heatmap, and visualise weekly focus distribution with a 3D bar chart built using Three.js.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Design Reference](#design-reference)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Firebase Data Model](#firebase-data-model)
- [Database Details (Realtime Database)](#database-details-realtime-database)
  - [Access Patterns](#access-patterns)
  - [Security Rules](#security-rules)
  - [Indexing Guidance](#indexing-guidance)
  - [Data Validation Notes](#data-validation-notes)
  - [Query Notes (for Firestore migration)](#query-notes-for-firestore-migration)
- [Authentication Flow Explanation](#authentication-flow-explanation)
- [Analytics Logic](#analytics-logic)
  - [Weekly Aggregation](#weekly-aggregation)
  - [Three.js Visualisation Logic](#threejs-visualisation-logic)
- [Assumptions & Engineering Decisions](#assumptions--engineering-decisions)
- [Future Improvements](#future-improvements)
- [Author](#author)
- [License](#license)

---

## 🔍 Overview

The **Cognitive Behavior Intelligence Platform** (internally named *Niyam*) is a focus and habit tracker that enables users to:

- Register and sign in with email/password.
- Log daily activities with a name, duration (minutes), and category.
- Review past activities grouped by date with inline edit/delete.
- Track daily consistency with a LeetCode‑style yearly heatmap and streak counter.
- View weekly analytics — total hours, deep work sessions, and category breakdown.
- Visualise weekly focus distribution using an interactive **3D bar chart** powered by Three.js.

The platform promotes self‑awareness by helping users understand *how* they spend their time.

---

## 🌐 Live Demo

**Deployed URL:** [https://niyam-d25w.vercel.app/](https://niyam-d25w.vercel.app/)

---

## 🎨 Design Reference

Figma: [https://www.figma.com/design/4i4ARHVVtp5uarjmAjJRN0/Kalvig-Technology?node-id=0-1&t=mm39i8sbKwhtVNKI-1](https://www.figma.com/design/4i4ARHVVtp5uarjmAjJRN0/Kalvig-Technology?node-id=0-1&t=mm39i8sbKwhtVNKI-1)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🔐 Authentication** | Email/password sign‑up and login with Firebase Auth. Protected routes redirect unauthenticated users. |
| **📝 Activity Logging** | Add daily activities with a name, duration (minutes), and category. |
| **📅 History View** | Activities grouped by date with inline edit and delete functionality. |
| **🔥 Streak Heatmap** | LeetCode‑style yearly activity heatmap showing daily consistency and consecutive streaks. |
| **📊 Weekly Analytics** | Summary of total focus hours, deep work sessions, and category breakdown. |
| **📈 3D Bar Chart** | Interactive Three.js visualisation of weekly focus distribution (deep + light segments). |
| **🛡️ Data Isolation** | Each user sees only their own data — enforced by Firebase security rules. |

---

## 🛠️ Tech Stack

| Area | Technologies |
|------|--------------|
| **Frontend** | React 18 · Vite · Tailwind CSS |
| **Backend** | Firebase Authentication · Firebase Realtime Database |
| **Visualisation** | Three.js (3D bar chart) |
| **State Management** | React Context API (Auth + Theme) |
| **Build Tool** | Vite |

---

## 📁 Folder Structure

```
Niyam/
├── public/                      # Static assets
├── src/
│   ├── components/              # Reusable UI components
│   ├── context/                 # Auth and theme context providers
│   ├── pages/                   # Route-level pages (Auth, Dashboard, etc.)
│   ├── services/                # Firebase data access and data shaping logic
│   ├── firebaseConfig.js        # Firebase SDK initialisation
│   ├── index.css                # Tailwind entry point
│   └── main.jsx                 # App entry point
├── .env                          # Firebase environment variables (not committed)
├── index.html
├── package.json
└── README.md
```

---

## 🚀 Setup Instructions (local development)

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- A Firebase project (free tier is sufficient)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/VanshGaikwad/Cognitive-Behavior-Intelligence-Platform.git
cd Cognitive-Behavior-Intelligence-Platform/Niyam

# Install dependencies
npm install

# Create a .env file (see Environment Variables section below)
# Start the development server
npm run dev
```

Open the app at `http://localhost:5173` — you're ready to go!

---

## 🔒 Environment Variables

Create `Niyam/.env` with the following Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> ⚠️ **Never commit your `.env` file to version control.** Add it to `.gitignore`.

---

## 📊 Firebase Data Model

The app uses **Firebase Realtime Database (RTDB)** with data scoped by `userId`.

### Realtime Database Structure

```
activities/
  └── {userId}/
        └── {activityId}/
              ├── activityName: string
              ├── duration: number       # minutes
              ├── category: string
              ├── createdAt: number      # epoch milliseconds
              └── updatedAt?: number     # epoch milliseconds (optional)
```

### Firestore Schema (for future migration)

If migrated to **Firestore**, a comparable schema would be:

```
activities (collection)
  └── {activityId} (document)
        ├── userId: string
        ├── activityName: string
        ├── duration: number
        ├── category: string
        ├── createdAt: timestamp
        └── updatedAt?: timestamp
```

Queries should always include `where("userId", "==", auth.uid)` to enforce isolation.

---

## 🗄️ Database Details (Realtime Database)

### Access Patterns
- **Write:** `activities/{userId}` with `push()` to create a new activity.
- **Update:** `activities/{userId}/{activityId}` with `update()` for inline edits.
- **Delete:** `activities/{userId}/{activityId}` with `remove()`.
- **Read:** `activities/{userId}` and client‑side sorting by `createdAt` for recent logs and history grouping.

### Security Rules

These rules restrict access to authenticated users and scope read/write to their own `userId`.

```json
{
  "rules": {
    "activities": {
      "$userId": {
        ".read": "auth != null && auth.uid == $userId",
        ".write": "auth != null && auth.uid == $userId"
      }
    }
  }
}
```

### Indexing Guidance

If the dataset grows, add an index for `createdAt` to improve ordering queries.

```json
{
  "rules": {
    "activities": {
      "$userId": {
        ".indexOn": ["createdAt"]
      }
    }
  }
}
```

### Data Validation Notes
- `duration` is stored as minutes (number).
- `createdAt` and `updatedAt` are stored as epoch milliseconds.
- Category values are treated as a fixed set in the UI but can be extended.

### Query Notes (for Firestore migration)
- The current implementation reads all activities for a user and performs filtering and grouping on the client.
- For a Firestore migration, queries should always include `where("userId", "==", auth.uid)` to enforce isolation.
- For large data volumes, consider pagination (limit + cursor) and range‑based reads.

---

## 🔐 Authentication Flow Explanation

- The app uses **Firebase Authentication** with email/password.
- `AuthContext` exposes `user` and `loading` state across the app.
- `ProtectedRoute` checks `loading` first, then redirects unauthenticated users to `/auth`.
- On logout, a session flag is used to prevent redirect loops and return users to the landing page.

---

## 📈 Analytics Logic

### Weekly Aggregation
- Activity records are converted into a weekly bucketed series (Mon–Sun).
- Each activity is mapped to a day index using `getDay()` with a Monday‑based offset.
- Daily totals are summed in minutes; weekly total is the sum of all seven buckets.
- Weekly hours are calculated as `totalWeekMinutes / 60`.
- **Deep work sessions** are counted by filtering activities with `duration >= 90` minutes.

### Three.js Visualisation Logic
- Each day's total is represented as a **stacked bar** (deep + light segments).
- A normalized height is derived from the maximum daily total for the selected range.
- In **2D mode**, Tailwind height classes are selected using a ratio of `minutes / maxMinutes`.
- In **3D mode**, Three.js bar heights are computed with the same normalisation so the tallest bar fits a fixed visual maximum. This keeps the chart readable regardless of absolute values.

---

## 🧠 Assumptions & Engineering Decisions

- User activity data is scoped by `userId` to guarantee separation of data.
- Weekly analytics are computed client‑side to keep Firebase rules and queries simple.
- The 3D chart uses a capped visual height to avoid extreme values distorting the layout.
- The app is built with Vite for fast development and modern build output.

---

## 🚀 Future Improvements

- [ ] Add Firestore support with server‑side aggregation for analytics.
- [ ] Add unit tests for analytics calculations and data transforms.
- [ ] Implement activity tags and advanced filters.
- [ ] Add export options for analytics reports (PDF/CSV).
- [ ] Improve accessibility for charts and interactive controls.

---

## 👤 Author

**Vansh Gaikwad**  
[GitHub](https://github.com/VanshGaikwad)

---

## 📄 License

This project is for demonstration and educational purposes. Contact the author for licensing inquiries.

---

> Built with **React, Firebase, Three.js, and Tailwind** — a complete focus and habit tracking platform from authentication to 3D visualisation.
