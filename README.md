# NexCRM - Customer Relationship Management System Frontend

A modern, responsive, enterprise-grade Customer Relationship Management (CRM) single-page application built with **React**, **Vite**, and **Tailwind CSS**.

![NexCRM Preview](https://img.shields.io/badge/Status-Active-emerald)
![React](https://img.shields.io/badge/React-18-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-cyan)
![Vite](https://img.shields.io/badge/Vite-6-purple)

---

## 🌟 Key Features

1. **👥 Customer Management (Accounts 360°)**
   - Complete directory of customer accounts with financial value, industry, and assigned reps.
   - 360° customer detail modal showing associated pipeline deals, contacts, and relationship notes.
   - Filter by Industry and Account Status (`Active`, `Prospect`, `Inactive`).
   - Grid and Table view toggles.

2. **📊 Sales Pipelines (Interactive Kanban Board)**
   - 6 visual pipeline stages:
     - `New Lead`
     - `Qualified`
     - `Proposal Sent`
     - `Negotiation`
     - `Closed Won`
     - `Closed Lost`
   - Real-time pipeline calculation: Total Pipeline Value, Probability-Weighted Forecast, Closed Won Revenue, and Sales Win Rate.
   - 1-click stage advancement (`Prev` / `Next`) and quick Mark Won / Mark Lost buttons.
   - Drag & Drop deal management across columns.

3. **🎯 Lead Tracking & Scoring**
   - Inbound prospect management with Lead Quality Scoring (0-100).
   - Acquisition channels tracking (Website Form, LinkedIn, Referral, Google Ads, Events).
   - **1-Click Conversion Flow**: Instantly converts qualified leads into an active Customer Account, Primary Contact stakeholder, and Pipeline Deal.

4. **📇 Contact Management**
   - Directory of account stakeholders categorized by department and influence role (`Decision Maker`, `Signatory`, `Influencer`, `Technical Evaluator`, `Billing Contact`).
   - Quick direct communication actions: Email (`mailto`), Phone Call (`tel`), and WhatsApp direct messaging.

5. **⏰ Follow-ups & Reminders**
   - Categorized task tracking: `Overdue`, `Due Today`, `Upcoming`, and `Completed`.
   - Alert notifications badge in the top navigation header with instant preview popup.
   - Activity types: Calls, Meetings, Emails, Follow-ups, and Tasks.

6. **📈 Sales Reports & Analytics**
   - Monthly Revenue chart with historical performance vs targets.
   - Stage Funnel distribution bar meters.
   - Sales Representative Leaderboard (Revenue closed, won deals count, and win rate).
   - Lead acquisition channel efficiency breakdown.
   - **Export to CSV**: 1-click export of pipeline deals into CSV format.

7. **💾 LocalStorage Sync & Reset Tools**
   - Instant client-side persistence: all additions, edits, stage changes, and deletions persist across page reloads.
   - "Reset Sample Data" tool to easily restore rich demo data anytime.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm or yarn

### Installation & Run

```bash
# 1. Clone repository
git clone <your-repo-url>
cd Customer_Realationship_Management

# 2. Install packages
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework**: React 18
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans
