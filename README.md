# AstroTab

AstroTab is a space-themed productivity dashboard I built around astronomy, with a few tools that I actually wanted to use while studying.

[![AstroTab Screenshot](./assets/Main.png)](https://github.com/Tan5Dev/AstroTab)

The main idea was to make a dashboard that feels like a small space command center while still being useful for everyday tasks.

It includes a real-time clock, NASA's Astronomy Picture of the Day, weather and orbital telemetry, quick notes, bookmarks, a Google search bar, ambient soundscapes, and a focus timer.

The focus timer supports both Pomodoro countdown and stopwatch modes, with custom session durations. I also added settings for things like starfield density, glass blur, sound volume, and location.

AstroTab uses NASA's APOD API for the astronomy content and Open-Meteo for weather and geocoding data. Some preferences and data are stored using localStorage so the dashboard can remember things between sessions.

I started building AstroTab as a simple HTML, CSS and JavaScript project, but as it grew I moved it to Vite to make development and organization easier.

Most of the project was built from scratch while experimenting with UI design, APIs, browser features, localStorage, Canvas, Web Audio API and responsive layouts.

## AstroTab Dashboard Features

* **Digital Clock & Greeting Engine**

  * Real-time clock with dynamic AM/PM tracking.     ![AstroTab Screenshot](./assets/Time.png)
  * 12-Hour and 24-Hour format toggling.                
  * Time-based greetings that change between Morning, Afternoon, and Evening.

  
* **NASA APOD (Astronomy Picture of the Day)**

  * Daily astronomy images and video content fetched from NASA's APOD API.
  * HD image viewing with an expanded modal containing the title, date, and description.
  * Support for both image and video APOD content.
  * Cached APOD data using `localStorage` to reduce unnecessary API requests.
  * Fallback content and error handling for API failures and rate limits.

* **Quick Notes & Task Management**

  * Add and remove notes directly from the dashboard.
  * Persistent storage using `localStorage`.
  * Pending and completed task states with interactive checkboxes.
  * Completed tasks receive visual cross-out styling.

* **Focus Timer & Stopwatch**

  * Pomodoro countdown mode for focused sessions.
  * Stopwatch mode for tracking elapsed time.
  * Custom session durations from 1 to 180 minutes.
  * Adaptive time display for both short and long sessions.
  * Timer preferences saved using `localStorage`.
  * Start, pause, reset, and mode switching controls.

* **Weather & Orbital Telemetry**

  * Live weather information using the Open-Meteo API.
  * Current temperature and wind speed display.
  * Latitude and longitude orbital/location telemetry.
  * City search and geocoding modal for manually selecting locations.
  * Automatic location detection with fallback handling.

* **Cosmic Soundscapes**

  * Browser-based ambient sound generation using the Web Audio API.
  * Cosmic and Rain sound profiles.
  * Start and pause controls.
  * Real-time volume adjustment with an inline slider.

* **Bookmark Shortcuts**

  * Add custom website bookmarks through a glassmorphic modal.
  * Automatic `https://` formatting for links.
  * Website favicons for visual shortcuts.
  * Remove bookmarks instantly.
  * Persistent bookmark storage using `localStorage`.

* **Google Search & URL Launcher**

  * Integrated Google search directly from the dashboard.
  * Supports entering URLs for quick website access.
  * Centered search interface integrated into the main dashboard layout.

* **Interactive Canvas Starfield**

  * Animated HTML5 Canvas starfield background.
  * Twinkling and pulsing star particles.
  * Adjustable star density using a live slider.
  * Real-time canvas updates when changing the density.

* **Glassmorphism & Interface Customization**

  * Adjustable backdrop blur across dashboard cards.
  * Live blur control for customizing the glassmorphism effect.
  * Space-themed interface with responsive dashboard layout.
  * Fixed navigation header for easier access while scrolling.

* **API Resiliency & Error Handling**

  * Protected initialization for major dashboard modules.
  * Handles NASA API rate limits and authentication errors.
  * Fallback states when external APIs are unavailable.
  * APOD support for different media types.
  * Environment variables used for API configuration.

## AI Usage

I mainly built the project myself. I used GitHub Copilot only for minor assistance, mostly for code autocomplete and small suggestions while writing the project.

I also used AI for a little bit of help while connecting and working with APIs and understanding some implementation details. The overall design, features, structure and development of AstroTab were done by me.

This is the first shipped version of AstroTab. I have more ideas for it, but I'll be working on those in future development.

## Live Site

https://astrotab.vercel.app/

Built by Tanmay Pathe
