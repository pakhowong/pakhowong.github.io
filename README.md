# 🌍 Travel History Tracker

This repository powers my personal website:  
👉 https://pakhowong.github.io/

It combines **UK immigration tracking**, **global travel visualisation**, and **flight history mapping** into a single interactive dashboard.

---

## ✨ Features

### 🇬🇧 UK Immigration Absence Tracker
- Tracks absences under the **BN(O) 5+1 route**
- Calculates:
  - Total days outside the UK
  - Rolling 12-month compliance
  - Maximum accumulated absence days
- Daily breakdown with direct links to supporting records

---

### 🌏 Visited Countries Map
- Interactive world map using **Leaflet**
- Based on **Natural Earth datasets**
- Handles:
  - Overseas territories
  - Countries vs sovereign states
- Includes expansion logic (e.g. Cyprus includes both Southern and Northern Cyprus)

---

### 📍 Visited Cities (Pin Layer)
- Displays visited locations as map pins
- Pins always remain above country layers
- Data stored in:
```
city_pins.js
```

---

### ✈️ Flight History Map
- Visualises all flight routes using great-circle arcs
- Features:
  - Route grouping (including round trips)
  - Colour-coded frequency:
    - Once → Orange
    - Twice → Red
    - Three → Maroon
    - Four → Violet
    - Five+ → Purple
  - Interactive tooltips with date and airline
- Handles antimeridian wrapping for smooth global routes

---

## 🧠 Data Architecture

```
/
├── index.html
├── city_pins.js
├── absence_ranges.js
├── day_links.js
├── flight_history.csv
```

---

## 🛫 Airport Resolution (Hybrid System)

Airport coordinates are resolved using:

1. **Primary**: mwgg/Airports  
2. **Fallback**: OpenFlights  

Lookup logic:
```
ICAO → IATA → (optional override)
```

This improves coverage for:
- Legacy ICAO codes
- Missing dataset entries

---

## 🗺️ Technology Stack

- Leaflet.js
- Natural Earth (Admin-0)
- Carto basemap (English-only)

---

## ⚙️ Design Principles

- Modular data separation (JS + CSV)
- Accurate geographic modelling (countries vs sovereign states)
- Performance-focused (lightweight HTML)

---

## 🚀 Future Improvements

- Preprocessed airport database (JSON)
- Travel analytics dashboard
- Timeline visualisation
- Google Photos integration
- Mobile optimisation

---

## 📌 Notes

This project is for personal travel tracking and visualisation only.

---

## 👤 Author

Pakho Wong
