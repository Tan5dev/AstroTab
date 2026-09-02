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
    if (tempEl) tempEl.textContent = '23°C';
    if (descEl) descEl.textContent = 'ATMOSPHERE NORMAL';
  }
}

function initTelemetry() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, 'ORBITAL LOCK'),
      () => fetchWeather(18.62, 73.88, 'Pimpri-Chinchwad'), // Default fallback coords
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
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (noiseNode) {
    noiseNode.stop();
    noiseNode.disconnect();
  }

  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    if (type === 'rain') {
      output[i] = Math.random() * 2 - 1; 
    } else if (type === 'lofi') {
      output[i] = (Math.random() * 2 - 1) * 0.3; 
    } else { 
      output[i] = Math.sin(i * 0.01) * 0.1 + (Math.random() * 0.05);
    }
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
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';
    isAudioPlaying = true;
  } else {
    if (noiseNode) noiseNode.stop();
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
    isAudioPlaying = false;
  }
});

document.getElementById('sound-select')?.addEventListener('change', (e) => {
  if (isAudioPlaying) {
    createWebAudioGenerator(e.target.value);
  }
});

document.getElementById('volume-slider')?.addEventListener('input', (e) => {
  if (gainNode) {
    gainNode.gain.value = parseFloat(e.target.value);
  }
});

const defaultBookmarks = [
  { name: 'GitHub', url: 'https://github.com/Tan5dev' },
  { name: 'YouTube', url: 'https://youtube.com' },
  { name: 'Google', url: 'https://google.com' }
];

let bookmarks = JSON.parse(localStorage.getItem('astro_bookmarks')) || defaultBookmarks;

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
    } catch (e) {
      console.error('Invalid URL:', bm.url);
    }
  });
}

window.removeBookmark = (index) => {
  bookmarks.splice(index, 1);
  localStorage.setItem('astro_bookmarks', JSON.stringify(bookmarks));
  renderBookmarks();
};

const bmModal = document.getElementById('bm-modal');
document.getElementById('add-bookmark-btn')?.addEventListener('click', () => {
  if (bmModal) bmModal.style.display = 'block';
});

document.getElementById('bm-modal-close')?.addEventListener('click', () => {
  if (bmModal) bmModal.style.display = 'none';
});

document.getElementById('bm-save-btn')?.addEventListener('click', () => {
  const nameInput = document.getElementById('bm-name-input');
  const urlInput = document.getElementById('bm-url-input');
  let url = urlInput.value.trim();
  const name = nameInput.value.trim();

  if (url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    bookmarks.push({ name: name || 'Link', url });
    localStorage.setItem('astro_bookmarks', JSON.stringify(bookmarks));
    renderBookmarks();
    
    if (nameInput) nameInput.value = '';
    if (urlInput) urlInput.value = '';
    if (bmModal) bmModal.style.display = 'none';
  }
});

document.getElementById('apod-trigger')?.addEventListener('click', () => {
  const img = document.getElementById('apod-img');
  const modal = document.getElementById('apod-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');

  if (img && img.src && modal) {
    modal.style.display = 'block';
    if (modalImg) modalImg.src = img.src;
    if (modalTitle) modalTitle.innerText = document.getElementById('apod-title')?.innerText || '';
    if (modalDesc) modalDesc.innerText = document.getElementById('apod-desc')?.innerText || '';
  }
});

document.getElementById('modal-close')?.addEventListener('click', () => {
  const modal = document.getElementById('apod-modal');
  if (modal) modal.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);
  fetchAPOD();
  initTelemetry();
  renderBookmarks();
});