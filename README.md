# Niyam – Focus & Habit Tracker

## Project Overview
Niyam is a React + Tailwind + Firebase web application for tracking focus sessions and habits. Users can register and sign in, log daily activities, review history grouped by date, and view weekly analytics with a 3D bar chart built using Three.js.

## Live Preview
Deployed URL: [https://niyam-d25w.vercel.app/](https://niyam-d25w.vercel.app/)

## Design Reference
Figma: https://www.figma.com/design/4i4ARHVVtp5uarjmAjJRN0/Kalvig-Technology?node-id=0-1&t=mm39i8sbKwhtVNKI-1

## Features
- Email/password authentication with Firebase Authentication.
- Add daily activities with duration and category.
- Activity history grouped by date with inline edit and delete.
- LeetCode-style yearly activity heatmap with streak tracking.
- Weekly analytics summary and category breakdown.
- 3D animated bar chart that visualizes weekly focus distribution.

## Tech Stack
- React (Vite)
- Tailwind CSS
- Firebase Authentication
- Firebase Realtime Database
- Three.js

## Setup Instructions (local development)
1. Install dependencies:
	 ```bash
	 npm install
	 ```
2. Create a `.env` file in `Niyam/` (see example below).
3. Start the dev server:
	 ```bash
	 npm run dev
	 ```
4. Open the app at the URL shown in the terminal (typically `http://localhost:5173`).

## Environment Variables
Create `Niyam/.env`:
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

## Firebase Data Model / Schema
The current implementation uses Firebase Realtime Database (RTDB). Data is scoped by `userId` to isolate each user’s activity stream.

RTDB structure:
```
activities/
	{userId}/
		{activityId}/
			activityName: string
			duration: number
			category: string
			createdAt: number (epoch ms)
			updatedAt?: number (epoch ms)
```

If migrated to Firestore, a comparable schema would be:
```
activities (collection)
	{activityId} (document)
		userId: string
		activityName: string
		duration: number
		category: string
		createdAt: timestamp
		updatedAt?: timestamp
```
Firestore queries should filter by `userId` to enforce data isolation.

## Database Details (Realtime Database)
### Access Patterns
- Write: `activities/{userId}` with `push()` to create a new activity.
- Update: `activities/{userId}/{activityId}` with `update()` for inline edits.
- Delete: `activities/{userId}/{activityId}` with `remove()`.
- Read: `activities/{userId}` and client-side sorting by `createdAt` for recent logs and history groups.

### Suggested Security Rules (RTDB)
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

### Query Notes
- The current implementation reads all activities for a user and performs filtering and grouping on the client.
- For a Firestore migration, queries should always include `where("userId", "==", auth.uid)` to enforce isolation.
- For large data volumes, consider pagination (limit + cursor) and range-based reads.

## Authentication Flow Explanation
- The app uses Firebase Authentication with email/password.
- `AuthContext` exposes `user` and `loading` state across the app.
- `ProtectedRoute` checks `loading` first, then redirects unauthenticated users to `/auth`.
- On logout, a session flag is used to prevent redirect loops and return users to the landing page.

## Analytics Logic Explanation (weekly aggregation logic)
- Activity records are converted into a weekly bucketed series (Mon–Sun).
- Each activity is mapped to a day index using `getDay()` with a Monday-based offset.
- Daily totals are summed in minutes; weekly total is the sum of all seven buckets.
- Weekly hours are calculated as `totalWeekMinutes / 60`.
- Deep work sessions are counted by filtering activities with `duration >= 90` minutes.

## Three.js Visualization Logic Explanation
- Each day’s total is represented as a stacked bar (deep + light segments).
- A normalized height is derived from the maximum daily total for the selected range.
- In 2D mode, Tailwind height classes are selected using a ratio of `minutes / maxMinutes`.
- In 3D mode, Three.js bar heights are computed with the same normalization so the tallest bar fits a fixed visual maximum. This keeps the chart readable regardless of absolute values.

## Folder Structure Overview
```
Niyam/
	public/               # Static assets
	src/
		components/         # Reusable UI components
		context/            # Auth and theme context
		pages/              # Route-level pages
		services/           # Firebase data access and data shaping
		firebaseConfig.js   # Firebase initialization
		index.css           # Tailwind entry
		main.jsx            # App entry
```

## Assumptions & Engineering Decisions
- User activity data is scoped by `userId` to guarantee separation of data.
- Weekly analytics are computed client-side to keep Firebase rules and queries simple.
- The 3D chart uses a capped visual height to avoid extreme values distorting the layout.
- The app is built with Vite for fast development and modern build output.

## Future Improvements
- Add Firestore support with server-side aggregation for analytics.
- Add unit tests for analytics calculations and data transforms.
- Implement activity tags and advanced filters.
- Add export options for analytics reports.
- Improve accessibility for charts and interactive controls.


