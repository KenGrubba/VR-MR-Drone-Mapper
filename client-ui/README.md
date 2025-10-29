# Client UI

A lightweight Vite + Mapbox GL JS interface for exploring locations.

## Prerequisites

- Node.js 18+
- An active [Mapbox access token](https://account.mapbox.com/)

## Setup

1. Copy `.env.example` to `.env` and replace `YOUR_TOKEN_HERE` with your token.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build the production bundle:
   ```bash
   npm run build
   ```
5. Preview the built app:
   ```bash
   npm run preview
   ```

The interface exposes buttons for typing an address, using the current location, and resetting to the default view. The status log in the bottom-left shows recent actions and any issues encountered. If the Mapbox token is missing the app displays a banner prompting you to configure it.

## Build Identifier

This scaffold corresponds to build **B1**, which centers the map via address lookup or GPS.
