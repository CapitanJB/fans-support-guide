# AGENT.md: Engineering and Architecture Protocol

This document establishes the standards for any AI agent or developer working on this project.

## 1. Methodology and Role Profile
Development follows industry-standard practices:
- **Task Management**: All development must be linked to a task or issue (e.g., JIRA-101 or GH-1). No code should be generated without an associated Task ID.
- **Version Control**: Strict use of Git following Gitflow or a structured feature-branch workflow (main, develop, feature/*).
- **Traceability**: Every branch name must include the Task ID (e.g., `feature/PROJECT-101-offline-map`).

## 2. Project Context
**Fans Support Guide**: An Offline-First PWA designed for football fans and mass event attendees.
- **Priority**: Logistics, safety, and mobility.
- **Constraint**: €0 execution budget (Low-Cost / No-Cost stack).
- **Environment**: High network congestion (stadiums); requires resilient offline functionality.

## 3. Technology Stack (€0 Budget)
- **Frontend**: Astro (SSG) / HTML5 / ES6+.
- **Maps**: Leaflet.js + OpenStreetMap (Cached tiles).
- **Backend/CMS**: Google Sheets (via CSV API).
- **Alerts**: Firebase Cloud Messaging (FCM) Free Tier.
- **Infrastructure**: Netlify or Vercel (Free Tier).

## 4. Coding Standards and Patterns
- **Service Workers**: Implement Cache-First for static assets and Stale-While-Revalidate for Google Sheets data.
- **Modularity**: Strict separation of concerns (map service, notifications, data fetching).
- **Resilience**: Use `localStorage` as a fallback if the network or API fails.
- **Performance**: 1MB limit for the initial bundle.

## 5. Workflow
1. **Planning**: Identify the need and create a task.
2. **Branching**: `git checkout develop` -> `git checkout -b feature/ID-description`.
3. **Development**: Implement logic following technical requirements.
4. **Local Validation**: Test in a Netlify-like environment before integrating.
5. **Integration**: Merge to `develop` immediately after completion to avoid divergence.
6. **Production Deployment**: Deployment to `main` is done via Pull Request from `develop`.
7. **Documentation**: Clear comments and updated README.md.

## 6. Conversation Instructions
Always present a plan before executing any technical or administrative task.
