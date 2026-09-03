let is24Hour = false;

function updateClock() {
  const clockEl = document.getElementById('clock');
  const greetingEl = document.getElementById('greeting');
  if (!clockEl) return;

  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  let ampm = '';

  if (!is24Hour) {
    ampm = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12 || 12;
  }
  
  const displayHours = String(hours).padStart(2, '0');
  clockEl.innerHTML = `${displayHours}:${minutes}:${seconds}<span class="ampm-text">${ampm}</span>`;

  if (greetingEl) {
    const curHour = now.getHours();
    if (curHour < 12) greetingEl.textContent = 'Good morning, Explorer!';
    else if (curHour < 18) greetingEl.textContent = 'Good afternoon, Explorer!';
    else greetingEl.textContent = 'Good evening, Explorer!';
  }
}

document.getElementById('format-toggle')?.addEventListener('click', () => {
  is24Hour = !is24Hour;
  const toggleBtn = document.getElementById('format-toggle');
  if (toggleBtn) toggleBtn.textContent = is24Hour ? '24H' : '12H';
  updateClock();
});

async function fetchAPOD() {
  const titleEl = document.getElementById('apod-title');
  const imgEl = document.getElementById('apod-img');
  const descEl = document.getElementById('apod-desc');
  const dateEl = document.getElementById('apod-date');
  const imgWrapper = document.getElementById('apod-trigger');

  const apiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`NASA API Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (titleEl) titleEl.textContent = data.title || 'Astronomy Picture of the Day';
    if (descEl) descEl.textContent = data.explanation || 'No description available.';
    if (dateEl) dateEl.textContent = data.date || 'Today';

    if (data.media_type === 'image') {
      if (imgEl) {
        imgEl.src = data.hdurl || data.url;
        imgEl.style.display = 'block';
      }
    } else if (data.media_type === 'video') {
      if (imgWrapper) {
        imgWrapper.innerHTML = `
          <iframe src="${data.url}" frameborder="0" allowfullscreen 
            style="width: 100%; height: 260px; border-radius: 12px;"></iframe>
        `;
      }
    }
  } catch (err) {
    console.warn('NASA APOD API Failure:', err.message);
    
    if (titleEl) titleEl.textContent = 'APOD Service Rate Limited';
    if (descEl) descEl.textContent = 'NASA DEMO_KEY request limit reached. Register for a free API key at api.nasa.gov to bypass rate limits.';
    if (dateEl) dateEl.textContent = 'Offline';
    if (imgEl) {
      imgEl.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop';
      imgEl.style.display = 'block';
    }
  }
}

let tasks = JSON.parse(localStorage.getItem('astro_tasks')) || [];

function renderTasks() {
  const pendingEl = document.getElementById('pending-list');
  const completedEl = document.getElementById('completed-list');

  if (!pendingEl || !completedEl) return;

  pendingEl.innerHTML = '';
  completedEl.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <div class="todo-item-left">
        <input 
          type="checkbox" 
          class="todo-checkbox" 
          ${task.completed ? 'checked' : ''} 
          onchange="toggleTask(${index})"
        />
        <span>${task.text}</span>
      </div>
      <button class="delete-task-btn" onclick="deleteTask(${index})">&times;</button>
    `;

    if (task.completed) {
      completedEl.appendChild(li);
    } else {
      pendingEl.appendChild(li);
    }
  });
}

function addTask() {
  const input = document.getElementById('todo-input');
  const text = input?.value.trim();

  if (text) {
    tasks.push({ text, completed: false });
    localStorage.setItem('astro_tasks', JSON.stringify(tasks));
    if (input) input.value = '';
    renderTasks();
  }
}

window.toggleTask = (index) => {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('astro_tasks', JSON.stringify(tasks));
  renderTasks();
};

window.deleteTask = (index) => {
  tasks.splice(index, 1);
  localStorage.setItem('astro_tasks', JSON.stringify(tasks));
  renderTasks();
};

document.getElementById('todo-add')?.addEventListener('click', addTask);
document.getElementById('todo-input')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTask();
  }
});

async function fetchWeather(lat, lon, locName = 'Local Station') {
  const tempEl = document.getElementById('weather-temp');
  const descEl = document.getElementById('weather-desc');
  const coordsEl = document.getElementById('weather-coords');
  const locEl = document.getElementById('location-name');

  if (coordsEl) coordsEl.textContent = `${lat.toFixed(2)}° N, ${lon.toFixed(2)}° E`;
  if (locEl) locEl.textContent = locName;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.current_weather) {
      if (tempEl) tempEl.textContent = `${Math.round(data.current_weather.temperature)}°C`;
      if (descEl) descEl.textContent = `WIND: ${data.current_weather.windspeed} KM/H`;
    }
  } catch (err) {
    console.warn('Weather API Error:', err);
  }
}

const locModal = document.getElementById('loc-modal');
document.getElementById('loc-picker-btn')?.addEventListener('click', () => {
  if (locModal) locModal.style.display = 'block';
});
document.getElementById('loc-modal-close')?.addEventListener('click', () => {
  if (locModal) locModal.style.display = 'none';
});

document.getElementById('loc-search-btn')?.addEventListener('click', async () => {
  const input = document.getElementById('loc-search-input');
  const query = input?.value.trim();
  if (!query) return;

  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const loc = data.results[0];
      fetchWeather(loc.latitude, loc.longitude, `${loc.name}, ${loc.country_code.toUpperCase()}`);
      if (locModal) locModal.style.display = 'none';
      if (input) input.value = '';
    } else {
      alert('Location not found.');
    }
  } catch (e) {
    console.error('Geocoding error:', e);
  }
});

function initTelemetry() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, 'ORBITAL LOCK'),
      () => fetchWeather(18.62, 73.88, 'Pimpri-Chinchwad'),
      { timeout: 5000 }
    );
  } else {
    fetchWeather(18.62, 73.88, 'Pimpri-Chinchwad');
  }
}

let audioCtx = null;
let noiseNode = null;
let gainNode = null;
let isAudioPlaying = false;

function createWebAudioGenerator(type = 'cosmic') {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (noiseNode) { noiseNode.stop(); noiseNode.disconnect(); }

  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = type === 'rain' ? (Math.random() * 2 - 1) : Math.sin(i * 0.01) * 0.1 + (Math.random() * 0.05);
  }

  noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = buffer;
  noiseNode.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = type === 'rain' ? 'bandpass' : 'lowpass';
  filter.frequency.value = type === 'rain' ? 1000 : 250;

  gainNode = audioCtx.createGain();
  const volSlider = document.getElementById('volume-slider');
  gainNode.gain.value = volSlider ? parseFloat(volSlider.value) : 0.5;

  noiseNode.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  noiseNode.start();
}

document.getElementById('sound-toggle')?.addEventListener('click', () => {
  const btn = document.getElementById('sound-toggle');
  const select = document.getElementById('sound-select');
  if (!isAudioPlaying) {
    createWebAudioGenerator(select?.value || 'cosmic');
    if (audioCtx?.state === 'suspended') audioCtx.resume();
    if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';
    isAudioPlaying = true;
  } else {
    if (noiseNode) noiseNode.stop();
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
    isAudioPlaying = false;
  }
});

const defaultBookmarks = [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'YouTube', url: 'https://youtube.com' },
  { name: 'Google', url: 'https://google.com' }
];

let bookmarks = JSON.parse(localStorage.getItem('astro_bookmarks')) || defaultBookmarks;
const addBmBtn = document.getElementById('add-bookmark-btn');
const bmModal = document.getElementById('bm-modal');
const bmCloseBtn = document.getElementById('bm-modal-close');

if (addBmBtn && bmModal) {
  addBmBtn.addEventListener('click', () => {
    bmModal.style.display = 'flex';
  });
}

if (bmCloseBtn && bmModal) {
  bmCloseBtn.addEventListener('click', () => {
    bmModal.style.display = 'none';
  });
}

window.addEventListener('click', (e) => {
  if (e.target === bmModal) {
    bmModal.style.display = 'none';
  }
});

function renderBookmarks() {
  const container = document.getElementById('bookmarks-bar');
  if (!container) return;
  container.innerHTML = '';

  bookmarks.forEach((bm, index) => {
    try {
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
    } catch (e) {}
  });
}

document.getElementById('bm-save-btn')?.addEventListener('click', (e) => {
  e.preventDefault();

  const nameInput = document.getElementById('bm-name-input');
  const urlInput = document.getElementById('bm-url-input');

  const name = nameInput?.value.trim();
  let url = urlInput?.value.trim();

  if (!name || !url) {
    alert('Please provide both a name and a URL.');
    return;
  }

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  bookmarks.push({ name, url });
  localStorage.setItem('astro_bookmarks', JSON.stringify(bookmarks));
  renderBookmarks();

  if (nameInput) nameInput.value = '';
  if (urlInput) urlInput.value = '';
  if (bmModal) bmModal.style.display = 'none';
});

window.removeBookmark = (index) => {
  bookmarks.splice(index, 1);
  localStorage.setItem('astro_bookmarks', JSON.stringify(bookmarks));
  renderBookmarks();
};

document.getElementById('apod-trigger')?.addEventListener('click', () => {
  const img = document.getElementById('apod-img');
  const modal = document.getElementById('apod-modal');
  if (img && img.src && modal) {
    modal.style.display = 'block';
    document.getElementById('modal-img').src = img.src;
    document.getElementById('modal-title').innerText = document.getElementById('apod-title')?.innerText || '';
    document.getElementById('modal-desc').innerText = document.getElementById('apod-desc')?.innerText || '';
  }
});

document.getElementById('modal-close')?.addEventListener('click', () => {
  document.getElementById('apod-modal').style.display = 'none';
});

let timerMode = 'pomodoro'; 
let timerInterval = null;
let isTimerRunning = false;

let customPomoMinutes = parseInt(localStorage.getItem('astro_pomo_mins'), 10) || 25;
let timerSeconds = customPomoMinutes * 60;

function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  if (!display) return;

  const hours = Math.floor(timerSeconds / 3600);
  const mins = Math.floor((timerSeconds % 3600) / 60);
  const secs = timerSeconds % 60;

  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');

  if (hours > 0) {
    const formattedHours = String(hours).padStart(2, '0');
    display.textContent = `${formattedHours}:${formattedMins}:${formattedSecs}`;
  } else {
    display.textContent = `${formattedMins}:${formattedSecs}`;
  }
}

function resetTimerState() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  const startBtn = document.getElementById('timer-start');
  if (startBtn) startBtn.innerHTML = '<i class="fas fa-play"></i>';

  if (timerMode === 'pomodoro') {
    timerSeconds = customPomoMinutes * 60;
  } else {
    timerSeconds = 0;
  }
  updateTimerDisplay();
}

document.getElementById('mode-pomo-btn')?.addEventListener('click', () => {
  if (timerMode === 'pomodoro') return;
  timerMode = 'pomodoro';
  document.getElementById('mode-pomo-btn')?.classList.add('active-mode');
  document.getElementById('mode-sw-btn')?.classList.remove('active-mode');
  
  const badge = document.getElementById('timer-badge');
  if (badge) badge.innerHTML = '<i class="fas fa-stopwatch"></i> FOCUS TIMER';
  
  resetTimerState();
});

document.getElementById('mode-sw-btn')?.addEventListener('click', () => {
  if (timerMode === 'stopwatch') return;
  timerMode = 'stopwatch';
  document.getElementById('mode-sw-btn')?.classList.add('active-mode');
  document.getElementById('mode-pomo-btn')?.classList.remove('active-mode');
  
  const badge = document.getElementById('timer-badge');
  if (badge) badge.innerHTML = '<i class="fas fa-stopwatch-20"></i> STOPWATCH';

  resetTimerState();
});

document.getElementById('timer-settings-toggle')?.addEventListener('click', () => {
  const panel = document.getElementById('timer-settings-panel');
  if (panel) {
    const isHidden = panel.style.display === 'none';
    panel.style.display = isHidden ? 'flex' : 'none';
  }
});

document.getElementById('save-timer-settings')?.addEventListener('click', () => {
  const input = document.getElementById('custom-pomo-min');
  const newMins = parseInt(input?.value, 10);

  if (newMins && newMins > 0) {
    customPomoMinutes = newMins;
    localStorage.setItem('astro_pomo_mins', newMins);
    if (timerMode === 'pomodoro') {
      resetTimerState();
    }
    const panel = document.getElementById('timer-settings-panel');
    if (panel) panel.style.display = 'none';
  }
});

document.getElementById('timer-start')?.addEventListener('click', () => {
  const btn = document.getElementById('timer-start');
  
  if (!isTimerRunning) {
    isTimerRunning = true;
    if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';

    timerInterval = setInterval(() => {
      if (timerMode === 'pomodoro') {
        if (timerSeconds > 0) {
          timerSeconds--;
          updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          isTimerRunning = false;
          alert('Focus Session Complete!');
          if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
        }
      } else {
        timerSeconds++;
        updateTimerDisplay();
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
    isTimerRunning = false;
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
  }
});

document.getElementById('timer-reset')?.addEventListener('click', () => {
  resetTimerState();
});

const themeBtn = document.getElementById('theme-btn');
const themePopover = document.getElementById('theme-popover');
const blurSlider = document.getElementById('blur-slider');

themeBtn?.addEventListener('click', () => {
  themePopover?.classList.toggle('active');
});

blurSlider?.addEventListener('input', (e) => {
  const cards = document.querySelectorAll('.card, .top-nav');
  cards.forEach(card => {
    card.style.backdropFilter = `blur(${e.target.value}px)`;
  });
});

const canvas = document.getElementById('starfield');
const ctx = canvas ? canvas.getContext('2d') : null;

let stars = [];
let starCount = 150;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    });
  }
}

function drawStars() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    star.alpha += star.speed;
    if (star.alpha > 1 || star.alpha < 0) {
      star.speed = -star.speed;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
    ctx.shadowBlur = star.radius * 2;
    ctx.shadowColor = '#ffffff';
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}

document.getElementById('stars-slider')?.addEventListener('input', (e) => {
  starCount = parseInt(e.target.value, 10);
  initStars();
});

window.addEventListener('resize', resizeCanvas);

document.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
  drawStars();
  updateClock();
  setInterval(updateClock, 1000);
  fetchAPOD();
  initTelemetry();
  renderBookmarks();
  renderTasks();
  updateTimerDisplay();
});