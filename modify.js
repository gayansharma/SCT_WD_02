let startTime, updatedTime, difference, interval;
let isRunning = false;
let lapCounter = 1;
let lapTimes = [];

const timeDisplay = document.getElementById('time-display');
const laps = document.getElementById('laps');

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseTimer);
document.getElementById('reset').addEventListener('click', resetTimer);
document.getElementById('lap').addEventListener('click', recordLap);

const sortAscButton = document.createElement('button');
sortAscButton.textContent = 'Sort Laps (Fastest)';
sortAscButton.addEventListener('click', () => sortLaps(true));

const sortDescButton = document.createElement('button');
sortDescButton.textContent = 'Sort Laps (Slowest)';
sortDescButton.addEventListener('click', () => sortLaps(false));

const clearLapsButton = document.createElement('button');
clearLapsButton.textContent = 'Clear Laps';
clearLapsButton.addEventListener('click', clearLaps);

document.querySelector('.controls').append(sortAscButton, sortDescButton, clearLapsButton);

function startTimer() {
    if (!isRunning) {
        startTime = Date.now() - (difference || 0);
        interval = setInterval(updateTime, 10);
        isRunning = true;
    }
}

function updateTime() {
    updatedTime = Date.now() - startTime;
    timeDisplay.textContent = formatTime(updatedTime);
}

function formatTime(time) {
    let milliseconds = parseInt((time % 1000));
    let seconds = parseInt((time / 1000) % 60);
    let minutes = parseInt((time / (1000 * 60)) % 60);
    let hours = parseInt((time / (1000 * 60 * 60)) % 24);

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

function pad(number, digits = 2) {
    return number.toString().padStart(digits, '0');
}

function pauseTimer() {
    clearInterval(interval);
    isRunning = false;
    difference = updatedTime;
}

function resetTimer() {
    clearInterval(interval);
    isRunning = false;
    difference = 0;
    timeDisplay.textContent = '00:00:00.000';
    lapCounter = 1;
    laps.innerHTML = '';
    lapTimes = [];
    clearHighlights();
}

function recordLap() {
    if (isRunning) {
        const lapTime = updatedTime;
        lapTimes.push(lapTime);
        displayLaps();
        highlightBestWorstLaps();
        updateTotalTime();
    }
}

function displayLaps() {
    laps.innerHTML = '';
    lapTimes.forEach((lapTime, index) => {
        const lapItem = document.createElement('li');
        lapItem.textContent = `Lap ${index + 1}: ${formatTime(lapTime)}`;
        lapItem.appendChild(createDeleteButton(index));
        laps.appendChild(lapItem);
    });
}

function createDeleteButton(index) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '10px';
    deleteButton.style.backgroundColor = '#dc3545';
    deleteButton.style.border = 'none';
    deleteButton.style.color = 'white';
    deleteButton.style.borderRadius = '5px';
    deleteButton.addEventListener('click', () => deleteLap(index));
    return deleteButton;
}

function deleteLap(index) {
    lapTimes.splice(index, 1);
    displayLaps();
    highlightBestWorstLaps();
    updateTotalTime();
}

function sortLaps(ascending) {
    lapTimes.sort((a, b) => ascending ? a - b : b - a);
    displayLaps();
    highlightBestWorstLaps();
}

function clearLaps() {
    lapTimes = [];
    laps.innerHTML = '';
    clearHighlights();
    updateTotalTime();
}

function highlightBestWorstLaps() {
    clearHighlights();
    if (lapTimes.length > 0) {
        const fastestTime = Math.min(...lapTimes);
        const slowestTime = Math.max(...lapTimes);
        lapTimes.forEach((time, index) => {
            if (time === fastestTime) {
                laps.children[index].style.backgroundColor = '#28a745';
            } else if (time === slowestTime) {
                laps.children[index].style.backgroundColor = '#dc3545';
            }
        });
    }
}

function clearHighlights() {
    Array.from(laps.children).forEach(lap => {
        lap.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
}

function updateTotalTime() {
    const totalTime = lapTimes.reduce((total, time) => total + time, 0);
    const totalTimeDisplay = document.getElementById('total-time');
    if (!totalTimeDisplay) {
        const totalTimeElement = document.createElement('div');
        totalTimeElement.id = 'total-time';
        totalTimeElement.style.marginTop = '20px';
        totalTimeElement.textContent = `Total Time: ${formatTime(totalTime)}`;
        document.querySelector('.stopwatch-container').appendChild(totalTimeElement);
    } else {
        totalTimeDisplay.textContent = `Total Time: ${formatTime(totalTime)}`;
    }
}