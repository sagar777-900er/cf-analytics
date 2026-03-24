# 🌌 Codeforces Analytics Dashboard

> **A beautifully crafted, "Deep Space" themed competitive programming dashboard.**

![Deep Space Aesthetic](/docs/screenshot-placeholder.png) <!-- Add a screenshot of your dashboard here -->

## ✨ Features

- **🚀 Deep Space Aesthetic**: Glassmorphism cards, glowing neon accents, and a dynamic stardust background specifically designed for a premium dark mode experience.
- **📊 Real-Time Analytics**: Visualizes your rating trajectory, tag mastery, and problem rating distribution using Recharts.
- **⚔️ Head-to-Head Mode**: Fetches and compares two Codeforces handles side-by-side using an interactive Radar intersection chart.
- **🧠 Automated SWOT Analysis**: An intelligent profiling engine that calculates your Strengths, Weaknesses, Opportunities, and Threats based on your contest performance and solved problems volume.
- **🌟 Watchlist Integration**: Hooked up to a persistent backend database (Supabase) to track friends and rivals instantly.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Recharts, Lucide Icons.
- **Architecture**: Custom React Hooks for unified API data aggregation (`useCodeforcesData`, `useH2HData`).
- **Backend / API proxy**: Node.js & Express (used to bypass rate limits and manage the robust caching layer).
- **Database**: Supabase Integration.

## 💻 Running Locally

To get this project running on your local machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sagar777-900er/cf-analytics.git
   cd cf-analytics
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server and backend concurrently:**
   ```bash
   npm run dev:all
   ```

4. **Visit the application** at `http://localhost:5173`.

---

*Designed and developed by [Sagar](https://github.com/sagar777-900er).*
