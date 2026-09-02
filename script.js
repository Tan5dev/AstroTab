import './style.css';
import confetti from 'canvas-confetti';

// --- 1. CLOCK & FORMAT TOGGLE MODULE ---
let is24Hour = localStorage.getItem('astro_clock_format') === '24';

const clockElement = document.getElementById('clock');
const greetingElement = document.getElementById('greeting');
const toggleBtn = document.getElementById('format-toggle');

function updateClock() {
  if (!clockElement) return;

  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  let ampmHTML = '';

  if (!is24Hour) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    ampmHTML = `<span class="ampm-text">${ampm}</span>`;
  }

  const hoursStr = String(hours).padStart(2, '0');
  clockElement.innerHTML = `${hoursStr}:${minutes}:${seconds}${ampmHTML}`;

  if (greetingElement) {
    const hourNum = now.getHours();
    let greetingText = "Good evening, Explorer!";
    if (hourNum < 12) greetingText = "Good morning, Explorer!";
    else if (hourNum < 16) greetingText = "Good afternoon, Explorer!";
    greetingElement.innerText = greetingText;
  }
}

if (toggleBtn) {
  toggleBtn.innerText = is24Hour ? '12H' : '24H';
  toggleBtn.addEventListener('click', () => {
    is24Hour = !is24Hour;
    localStorage.setItem('astro_clock_format', is24Hour ? '24' : '12');
    toggleBtn.innerText = is24Hour ? '12H' : '24H';
    updateClock();
  });
}

updateClock();
setInterval(updateClock, 1000);

// --- 2. NASA APOD FETCH ENGINE ---
async function fetchNASAData() {
  const titleEl = document.getElementById('apod-title');
  const imgEl = document.getElementById('apod-img');
  const descEl = document.getElementById('apod-desc');
  const dateEl = document.getElementById('apod-date');

  if (!titleEl || !imgEl || !descEl) return;

  const apiKey = import.meta.env.VITE_NASA_API_KEY || 'SxQtFNDwSaUDIgtXlff7mSsY7m7wzXRa5zxC58ff';

  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    titleEl.innerText = data.title || 'Astronomy Picture of the Day';
    descEl.innerText = data.explanation || 'Explore the cosmos through NASA astronomy imagery.';
    if (dateEl) dateEl.innerText = data.date || 'Today';

    if (data.media_type === 'image') {
      imgEl.src = data.url;
      imgEl.style.display = 'block';
    } else {
      imgEl.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop';
      imgEl.style.display = 'block';
    }
  } catch (error) {
    console.warn('NASA API Fetch Failed. Loading fallback mirror:', error);
    titleEl.innerText = 'Deep Space Nebula';
    descEl.innerText = 'An extraordinary view of starry space.';
    if (dateEl) dateEl.innerText = 'Offline Mode';
    imgEl.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop';
    imgEl.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', fetchNASAData);
fetchNASAData();

// --- 3. TASK ENGINE WITH CONFETTI ---
const todoInput = document.getElementById('todo-input');
const todoAddBtn = document.getElementById('todo-add');
const todoList = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('astro_tasks')) || [];

function renderTasks() {
  if (!todoList) return;
  todoList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
      <span>${task}</span>
      <button onclick="deleteTask(${index})">✕</button>
    `;
    todoList.appendChild(li);
  });

  localStorage.setItem('astro_tasks', JSON.stringify(tasks));
}

window.deleteTask = function(index) {
  tasks.splice(index, 1);
  renderTasks();
};

if (todoAddBtn && todoInput) {
  todoAddBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text) {
      tasks.push(text);
      todoInput.value = '';
      renderTasks();

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#ec4899', '#8b5cf6']
      });
    }
  });

  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') todoAddBtn.click();
  });
}

renderTasks();

// --- 4. GLOBAL SEARCH HOTKEY ('/') ---
document.addEventListener('keydown', (e) => {
  const searchInput = document.querySelector('.search-form input');
  if (document.activeElement === searchInput || document.activeElement === todoInput) return;
  if (e.key === '/') {
    e.preventDefault();
    if (searchInput) searchInput.focus();
  }
});

// --- 5. ANIMATED STARFIELD CANVAS ---
const canvas = document.getElementById('starfield');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
    });
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    initStars();
  });

  resizeCanvas();
  initStars();
  drawStars();
}

async function fetchWeather(lat, lon) {
  const tempEl = document.getElementById('weather-temp');
  const descEl = document.getElementById('weather-desc');
  const coordsEl = document.getElementById('weather-coords');
  const locEl = document.getElementById('location-name');

  if (coordsEl) coordsEl.innerText = `${lat.toFixed(2)}° N, ${lon.toFixed(2)}° E`;

  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await res.json();
    const weather = data.current_weather;

    if (tempEl) tempEl.innerText = `${Math.round(weather.temperature)}°C`;
    if (descEl) descEl.innerText = `Wind: ${weather.windspeed} km/h`;
    if (locEl) locEl.innerText = "LOCAL ATMOSPHERE";
  } catch (err) {
    if (descEl) descEl.innerText = "Telemetry Offline";
  }
}

function initTelemetry() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(18.62, 73.80) // Fallback default coordinates
    );
  } else {
    fetchWeather(18.62, 73.80);
  }
}

document.addEventListener('DOMContentLoaded', initTelemetry);
initTelemetry();

const defaultBookmarks = [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'YouTube', url: 'https://youtube.com' },
  { name: 'Google', url: 'https://google.com' }
];

let bookmarks = JSON.parse(localStorage.getItem('astro_bookmarks')) || defaultBookmarks;

function renderBookmarks() {
  const container = document.getElementById('bookmarks-bar');
  if (!container) return;
  container.innerHTML = '';

  bookmarks.forEach((bm, index) => {
    const domain = new URL(bm.url).hostname;
    const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'bookmark-item';
    wrapper.innerHTML = `
      <a href="${bm.url}" target="_blank" class="shortcut-btn" title="${bm.name}">
        <img src="${favicon}" alt="${bm.name}" />
      </a>
      <span class="delete-bm" onclick="removeBookmark(${index})">&times;</span>
    `;
    container.appendChild(wrapper);
  });
}

window.removeBookmark = (index) => {
  bookmarks.splice(index, 1);
  localStorage.setItem('astro_bookmarks', JSON.stringify(bookmarks));
  renderBookmarks();
};

document.getElementById('add-bookmark-btn')?.addEventListener('click', () => {
  const url = prompt('Enter website URL (e.g., https://nasa.gov):');
  if (url) {
    const name = prompt('Enter name:', new URL(url).hostname);
    bookmarks.push({ name: name || 'Link', url });
    localStorage.setItem('astro_bookmarks', JSON.stringify(bookmarks));
    renderBookmarks();
  }
});

const audioTracks = {
  cosmic: 'https://actions.google.com/sounds/v1/science_fiction/space_ship_hum.ogg',
  rain: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
  lofi: 'https://actions.google.com/sounds/v1/ambiences/hum_and_rumble.ogg'
};

let currentAudio = new Audio(audioTracks.cosmic);
currentAudio.loop = true;
let isPlaying = false;

document.getElementById('sound-toggle')?.addEventListener('click', () => {
  const btn = document.getElementById('sound-toggle');
  const select = document.getElementById('sound-select');

  if (!isPlaying) {
    currentAudio.src = audioTracks[select.value];
    currentAudio.play();
    btn.innerHTML = '<i class="fas fa-pause"></i>';
    isPlaying = true;
  } else {
    currentAudio.pause();
    btn.innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
  }
});

document.getElementById('apod-trigger')?.addEventListener('click', () => {
  const img = document.getElementById('apod-img');
  const modal = document.getElementById('apod-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');

  if (img && img.src) {
    modal.style.display = 'block';
    modalImg.src = img.src;
    modalTitle.innerText = document.getElementById('apod-title').innerText;
    modalDesc.innerText = document.getElementById('apod-desc').innerText;
  }
});

document.getElementById('modal-close')?.addEventListener('click', () => {
  document.getElementById('apod-modal').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
  renderBookmarks();
});