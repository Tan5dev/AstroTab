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
