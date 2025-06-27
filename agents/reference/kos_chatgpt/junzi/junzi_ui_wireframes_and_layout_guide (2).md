# JUNZI UI Wireframes and Layout Guide

**Node Class:** JunziNode  
**System:** kOS Ecosystem  
**Document Type:** Frontend Design and UX Layout Specification

---

## 🎯 Design Goals:
- Clear, fact-based interface
- Accessible to journalists, citizens, researchers
- Mobile-responsive
- High visual trustworthiness (neutral colors, clean typography)
- Fast, low-latency frontend performance

---

## 📑 Core UI Screens:

### 1. **Home Dashboard**
| Section | Elements |
|---|---|
| Header | JUNZI logo, navigation menu, login/profile icon |
| Main Content | Welcome message, Quick Search Bar, "Top Trending Entities" leaderboard |
| Sidebar | Quick filters: Jurisdiction, Risk Level, Latest Alerts |
| Footer | About, Terms, API Access, Transparency Reports |

---

### 2. **Entity Profile Page**
| Section | Elements |
|---|---|
| Header | Entity Name, Jurisdiction, Role |
| Risk Score Widget | Large numeric + color-coded indicator (Low / Moderate / High / Critical) |
| Contradiction Timeline | Scrollable list of detected contradictions with source links and confidence scores |
| Promise Tracker | Table of promises: Status, Date Given, Fulfillment Status |
| Action History | Log of recent public actions and decisions |
| Source Attribution | Expandable list of data sources |

---

### 3. **Contradictions Feed**
| Section | Elements |
|---|---|
| Filter Bar | Filter by Entity, Jurisdiction, Confidence Score, Date Range |
| Feed | Paginated contradiction entries with quick preview and expand option for full details |
| Graph | Contradiction trends over time (line graph or heatmap) |

---

### 4. **Risk Leaderboard Page**
| Section | Elements |
|---|---|
| Filters | Jurisdiction, Risk Level, Entity Type |
| Table | Entity Name, Current Risk Score, Change from Last Period |
| Graph | Risk Score Distribution Histogram |
| Export Option | Download CSV / JSON |

---

### 5. **Promise Tracker Summary Page**
| Section | Elements |
|---|---|
| Filter | Entity, Promise Status (Fulfilled / Broken / Pending) |
| Table | Entity, Promise, Date, Status, Source |
| Graph | Promise fulfillment rates over time |

---

### 6. **User Submission Portal**
| Section | Elements |
|---|---|
| Submission Form | Entity ID, Report Type, Description, Upload Evidence |
| Status Tracker | Track status of submitted reports |
| Help Links | Dispute Resolution Policy, Data Submission Guidelines |

---

### 7. **Public Alerts Dashboard**
| Section | Elements |
|---|---|
| Live Feed | Most recent high-confidence risk alerts |
| Filter | Severity Level, Jurisdiction, Entity Type |
| Alert Detail View | Full context, source data, and risk calculation metadata |

---

## 🧭 Navigation Structure:
- Home
- Entities
- Contradictions
- Risk Leaderboard
- Promises
- Alerts
- Submit Report
- API Access
- About / Transparency

---

## ✅ UX Flow Notes:
- **Mobile First Design**: All elements should scale down for mobile with collapsible sidebars
- **Accessibility Standards:** WCAG 2.1 compliance, keyboard navigability, ARIA labeling for screen readers
- **Color Themes:** Neutral color palette with risk level highlights (e.g., green/yellow/orange/red for risk scores)
- **Performance Optimizations:** Lazy loading for long lists, caching of non-realtime data pages

---

**This document now serves as the official JUNZI UI Wireframes and Layout Guide for frontend teams working within the kOS ecosystem until formally revised.**

