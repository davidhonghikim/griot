# JUNZI Frontend Build Plan

**Node Class:** JunziNode  
**System:** kOS Ecosystem  
**Document Type:** Frontend Development Strategy

---

## 🎯 Frontend Technology Stack:

| Layer | Tool/Framework |
|---|---|
| Core Framework | Next.js (React) |
| UI Component Library | Tailwind CSS + Headless UI + Shadcn/ui components |
| State Management | Zustand or Redux Toolkit (lightweight preferred for MVP) |
| API Integration | Axios or native Fetch with React Query |
| Routing | Next.js App Router (v13+ folders) |
| Testing | Jest + React Testing Library + Cypress for E2E |
| Deployment | Vercel, Netlify, or Dockerized self-hosted NGINX |

---

## ✅ Initial Page Build Order (Aligned with Wireframes):

| Page | Priority |
|---|---|
| Home Dashboard | High |
| Entity Profile | High |
| Contradictions Feed | High |
| Risk Leaderboard | Medium |
| Promise Tracker Summary | Medium |
| Alerts Dashboard | Medium |
| User Submission Portal | Low |
| API Access Info / Docs | Low |
| About / Transparency | Low |

---

## ✅ Component Breakdown:

| Component | Purpose |
|---|---|
| NavBar | Site-wide navigation |
| Footer | Legal and meta links |
| RiskScoreWidget | Dynamic score display with color coding |
| ContradictionTimeline | Visual history of contradictions per entity |
| PromiseStatusTable | Promise tracking per entity |
| AlertFeed | Rolling list of latest ethical alerts |
| FilterBar | Reusable filter component for multiple pages |
| EntitySearch | Autocomplete search for entities |

---

## ✅ API Integration Plan:
- Use centralized API service layer (`/services/api.js`)
- Implement pagination, filtering, and error states for all API calls
- Include retry logic for failed requests to critical endpoints

---

## ✅ Accessibility Targets:
- WCAG 2.1 AA Compliance minimum
- ARIA labels for all dynamic and interactive components
- Keyboard navigability for all page flows
- Color contrast checks for risk color indicators

---

## ✅ Deployment Plan:
- Initial deployment to staging environment
- Performance audits using Lighthouse
- Manual QA checklist against Wireframes and UI Language Guide
- Final push to production with full logging and monitoring hooks enabled

---

**This document now serves as the canonical Frontend Build Plan for JUNZI development teams within the kOS ecosystem until formally revised.**

