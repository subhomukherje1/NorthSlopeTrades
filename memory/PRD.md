# North Slope Trades - Product Requirements Document

## Overview
NorthSlopeTrades.com - High-performance, mobile-first, single-page recruitment website for rapid labor deployment agency serving Alaska's North Slope energy sector.

## User Personas
1. **Certified Tradesmen** - Pipefitters, welders, operators seeking FIFO rotations on North Slope
2. **Operations Managers** - Energy sector employers needing rapid crew deployment

## Core Requirements (Static)
- Dark mode only website
- Color palette: Navy/Black (#0A0F1E, #0F172A), Ice Blue (#38BDF8), Safety Orange (#F97316)
- Typography: Barlow Condensed (headers) + Barlow (body)
- Mobile-first responsive design (375px, 768px, 1280px breakpoints)
- 44x44px minimum tap targets
- Load time under 2 seconds on 4G

## What's Been Implemented (December 2025)

### Frontend Features
- [x] Hero section with Arctic oil rig background imagery
- [x] Dual CTAs: "Join the Deployment Roster" + "Request Workers"
- [x] Trade specializations grid (6 trades: Pipefitters, Welders, Heavy Equipment Operators, Instrumentation Techs, Roustabouts, Heavy Duty Mechanics)
- [x] "How It Works" 3-step process section
- [x] Worker intake form with knockout logic (NSTC card + Anchorage travel validation)
- [x] Client/operator request form
- [x] Blog placeholder section (3 article cards)
- [x] Sticky mobile CTA bar (auto-hides when forms in view)
- [x] Footer with contact information

### Backend Features
- [x] FastAPI backend with MongoDB
- [x] Worker submission API (`POST /api/worker-submission`)
- [x] Client submission API (`POST /api/client-submission`)
- [x] UTM parameter capture
- [x] Webhook integration placeholders

### Analytics & SEO
- [x] GA4 tracking placeholder
- [x] Facebook Pixel placeholder
- [x] UTM parameter capture
- [x] Full meta tags (SEO, OG, Twitter Cards)
- [x] JSON-LD structured data
- [x] robots.txt and sitemap.xml

## Prioritized Backlog

### P0 (Critical)
- All implemented ✅

### P1 (High)
- Replace placeholder phone number with real number
- Configure webhook URLs (Make.com/Zapier)
- Replace GA4 and Facebook Pixel IDs with production values

### P2 (Medium)
- Add actual blog content/CMS integration
- Email notification system for form submissions
- Admin dashboard for managing submissions

## Next Tasks
1. Configure production webhook URLs in backend/.env
2. Update phone number in header
3. Add GA4 and Facebook Pixel production IDs
4. Consider adding admin panel for submission management
