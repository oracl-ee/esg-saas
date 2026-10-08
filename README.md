# ESG Emissions Reporting Platform

> 🚧 **Work in progress.** The front end is functional. The back end is under active development.

A web app that helps companies estimate their greenhouse-gas emissions and prepare for climate disclosure rules such as **California SB 253** (Climate Corporate Data Accountability Act).

<!-- Add a screenshot of the landing page or dashboard here -->

## Features

**Working now (front end)**
- Landing page with information pages: About SB 253, FAQ, and a Compliance Guide
- Step-by-step data entry: company details, electricity, natural gas, and vehicle fuels
- Real-time form validation, including ZIP code / city verification via the Zippopotam.us API
- Review step and emissions dashboard
- Progress saved in the browser, so users can leave and come back

**Planned (back end)**
- REST API with Express
- Database storage for company profiles and emissions data
- User accounts and authentication
- Server-side emissions calculations using published emission factors
- Exportable reports

## Tech stack

| Layer | Tools |
|---|---|
| Front end | React, Vite, Tailwind CSS, lucide-react icons |
| Back end | Node.js, Express (in progress) |

## Running locally

Requires Node.js 18 or newer.

**Front end**
```bash
cd client
npm install
npm run dev
```
Then open the local URL Vite prints (usually http://localhost:5173).

**Back end**
```bash
cd server
npm install
node src/server.js
```
Health check: http://localhost:3000/api/health

## Project structure

```
esg-saas/
├── client/                 # React front end
│   └── src/
│       ├── pages/          # Landing, dashboard, info pages
│       ├── components/     # Forms (electricity, natural gas, fuels, review)
│       └── context/        # Shared form state
└── server/                 # Express API (in progress)
    └── src/server.js
```
