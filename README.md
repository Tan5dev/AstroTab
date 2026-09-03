# AstroTab

AstroTab is my space themed productivity dashboard with some features that I wanted to use while studying.

![AstroTab Screenshot](./assets/Main.png)

The goal was to make a dashboard similar to a small space command while being functional for day to day use.

It features a clock, Astronomy Picture of the Day by NASA, weather and orbital telemetry, quick notes and bookmarks, Google search bar, ambient soundscapes and a focus timer.

AstroTab uses NASA's APOD API for the astronomy part and the Open-Meteo API for the weather and geocoding. I've used `localStorage` to keep certain preferences and data for the dashboard.

It started as a simple project made by HTML, CSS and JavaScript but as the project grew, I transfered it to Vite for easier organisation.

It features most things that I've made myself while experimenting with UI design, APIs, browser tools, localStorage, Canvas, Web Audio API and responsive design.

## Features

### Digital Clock & Greeting Engine

Real-time clock with AM/PM tracking.

Toggle for 12-hour and 24-hour format.

Time-based greetings that changes between Morning, Afternoon and Evening.

![Clock](./assets/Time.png)

### NASA APOD

Daily astronomy content fetched from NASA's APOD API.

Support for both image and video APOD.

HD view for images with an expanded modal.

Cached APOD data using `localStorage`.

Fallback content and error handling for APOD API failures and rate limits.

![NASA APOD](./assets/NASA_APOD.png)

### Quick Notes & Task Management

Adding and removing tasks from the dashboard.

Persistence using `localStorage`.

Task states with checkboxes for pending and completed tasks.

Cross-out styling for completed tasks.

![Quick Notes](./assets/Quick_Notes.png)

### Focus Timer & Stopwatch

Pomodoro countdown mode for focus sessions.

Stopwatch mode for measuring time.

Session duration customisation from 1 to 180 minutes.

Time display that adapts to short and long sessions.

Timer preferences using `localStorage`.

Start, pause, reset and mode buttons.

![Focus Timer](./assets/Promodo_Timer.png)

### Weather & Orbital Telemetry

Live weather information using the Open-Meteo API.

Current temperature and wind speed display.

Latitude and longitude location telemetry.

City search and geocoding modal for manual location choosing.

Automatic location detection fallback.

![Telemetry](./assets/Telemetry.png)

### Cosmic Soundscapes

Browser-based ambient sound generation using the Web Audio API.

Cosmic and Rain sound profiles.

Start and pause controls.

Inline volume control with a slider.

![Soundscapes](./assets/Sound.png)

### Bookmark Shortcuts

Add custom website bookmarks using a glassmorphic modal.

Auto-formatted `https://` links.

Website favicons for shortcuts.

Removing bookmarks instantly.

Bookmark persistence using `localStorage`.

![Bookmarks](./assets/Header.png)

### Google Search & URL Launcher

Integrated Google search system on the dashboard.

Entering URLs for quick website access.

Centred search interface within the dashboard.

![Search Bar](./assets/SearchBar.png)

### Interactive Canvas Starfield

Animated HTML5 Canvas starfield background.

Twinkling and pulsing star particles.

Star density customisation using a live slider.

Live canvas updates when changing density.

![Starfield](./assets/Starfield.png)

### Glassmorphism & Interface Customization

Adjust backdrop blur for all cards.

Live blur customisation for glassmorphism.

Space themed interface and responsive dashboard layout.

Fixed navigation header for easier scrolling access.

![Interface](./assets/Header.png)

### API Resiliency & Error Handling

Protected initialisations for the main dashboard modules.

Handling NASA API rate limits and authentication errors.

Fallback states when external APIs are unreachable.

APOD support for different media types.

Environment variables for API configuration.

## AI Usage

I have used GitHub Copilot for some minor assistance, mostly for code autocomplete and suggestions while developing the project.

I have also used AI occasionally outside of the project when working with APIs and some concepts.

## Development

This is the first shipped version of AstroTab.

I started from the project idea of learning how to build a astronomy-themed dashboard and slowly added on features that I found useful. Some parts of the dashboard have changed significantly as I worked on the prototype and experimented with the APIs, interactions and browser functions.

There are still more things I am planning to add, so this is just the beginning of the AstroTab project.

## Live Site

https://astrotab.vercel.app/

Made by Tanmay Pathe
