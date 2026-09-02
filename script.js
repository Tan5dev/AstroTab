function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').innerText = `${hours}:${minutes}`;

    const hourNum = now.getHours();
    let greetingText = "Good Evening, Explorer!";
    if (hourNum < 12) greetingText = "Good Morning, Explorer!";
    else if (hourNum < 18) greetingText = "Good Afternoon, Explorer!";
    document.getElementById('greeting').innerText = greetingText;

}

setInterval(updateClock, 1000);
updateClock();

async function fetchNASAData() {
  const titleEl = document.getElementById('apod-title');
  const descEl = document.getElementById('apod-desc');
  const imgEl = document.getElementById('apod-img');
  const dateEl = document.getElementById('apod-date');

  try {
    const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
    
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const data = await response.json();

    titleEl.innerText = data.title;
    descEl.innerText = data.explanation;
    if (dateEl) dateEl.innerText = data.date;

    if (data.media_type === 'image') {
      imgEl.src = data.url;
      imgEl.style.display = 'block';
    } else {
      titleEl.innerText = `${data.title} (Video Content)`;
      imgEl.style.display = 'none';
    }
  } catch (error) {
    console.error('NASA API Error:', error);
    titleEl.innerText = 'Cosmic Data Unavailable';
    descEl.innerText = 'Failed to fetch live NASA imagery. Check internet connection or API rate limit.';
  }
}

fetchNASAData();