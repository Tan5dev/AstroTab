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

  // Dynamic Greeting
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

async function fetchNASAData() {
  const titleEl = document.getElementById('apod-title');
  const imgEl = document.getElementById('apod-img');
  const descEl = document.getElementById('apod-desc');
  const dateEl = document.getElementById('apod-date');

  if (!titleEl || !imgEl || !descEl) {
    console.error('APOD Error: Required DOM elements missing in HTML.');
    return;
  }

  try {
    const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=SxQtFNDwSaUDIgtXlff7mSsY7m7wzXRa5zxC58ff');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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
    console.warn('NASA API Fetch Failed. Loading fallback space image:', error);

    titleEl.innerText = 'Deep Space Nebula';
    descEl.innerText = 'An extraordinary view of starry space. (Loaded via fail-safe secondary mirror).';
    if (dateEl) dateEl.innerText = 'Offline Mode';

    imgEl.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop';
    imgEl.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', fetchNASAData);
fetchNASAData();




fetchNASAData();

const todoInput = document.getElementById('todo-input');
const todoAddBtn = document.getElementById('todo-add');
const todoList = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('astro_tasks')) || [];

function renderTasks(){
    if(!todoList) return;
    todoList.innerHTML = '';

    tasks.forEach((task, index) =>{
        const li = document.createElement('li');
        li.className='todo-item';
        li.innerHTML = `<span>${task}</span>
      <button onclick="deleteTask(${index})">✕</button>
    `;
    todoList.appendChild(li);
    });

    localStorage.setItem('astro_tasks', JSON.stringify(tasks));
}

if (todoAddBtn && todoInput) {
  todoAddBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text) {
      tasks.push(text);
      todoInput.value = '';
      renderTasks();
    }
  });

  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      todoAddBtn.click();
    }
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

renderTasks();

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
      if (star.alpha > 1 || star.alpha < 0) {
        star.speed = -star.speed;
      }
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