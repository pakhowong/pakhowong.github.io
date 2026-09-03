# 🌏 Travel Dashboard

A visually rich, Japanese anime-inspired travel dashboard that transforms my
global journeys into an interactive, data-driven experience.

🔗 Live Site: https://pakhowong.github.io/

------------------------------------------------------------------------

## ✨ What is this?

A personal travel history visualisation tool that combines:

-   🌍 A fully interactive world map\
-   📊 Travel analytics and insights\
-   📅 Immigration and absence tracking\
-   🎨 A clean, modern anime-style UI

It is designed to turn raw travel data into something meaningful,
intuitive, and visually engaging.

------------------------------------------------------------------------

## 🚀 Key Features

### 🗺️ Interactive Travel Map

-   Vector-based global map powered by MapLibre
-   Highlight visited countries
-   Plot visited cities and airports
-   Visualise flight routes with colour-coded frequency
-   Smooth hover and interaction effects

------------------------------------------------------------------------

### 📊 Travel Insights

-   Countries, cities, airports visited
-   Flights taken and routes flown
-   Clear visual summaries of travel history

------------------------------------------------------------------------

### 📅 UK Immigration Absence Tracker

-   Track absence days for ILR / citizenship requirements
-   Rolling 12-month calculation
-   Safety buffer and remaining quota indicators

------------------------------------------------------------------------

### 🎨 Custom Design System

-   Fully themeable via JSON configuration
-   Soft, sky-themed aesthetic
-   Clean glass-style UI components

------------------------------------------------------------------------

### 📱 Fully Responsive

-   Works across desktop, tablet, and mobile
-   Optimised layout for different screen sizes

------------------------------------------------------------------------

## 🏗️ How it works (high level)

``` text
Travel Data → Processing → Map + UI Rendering
```

-   Map rendering: MapLibre GL JS\
-   Styling: JSON-based theme system\
-   UI: Lightweight HTML + CSS + JS

------------------------------------------------------------------------

## 🎨 Customisation

All map styling is controlled via:

``` text
/styles/travel_map_style.json
```

You can easily change: - Map colours (sea, land, borders) - Country
highlight styles - City and airport markers - Flight route colours and thickness

------------------------------------------------------------------------

## 🔮 Future Ideas

-   Travel insights engine (top countries, longest routes)
-   Timeline view of trips
-   Shareable travel summary cards
-   Dark mode / theme switching

------------------------------------------------------------------------

## 👤 Author

Pakho Wong\
A travel enthusiast
