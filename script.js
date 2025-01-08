/* script.js */
const apiKey = 'UeIxdiKkufRT6Q2AFqOp3ex3KSF6seNXcVcIP2VI';  
const currentImageContainer = document.getElementById('current-image-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchHistory = document.getElementById('search-history');

async function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  await getImageOfTheDay(currentDate);
}

async function getImageOfTheDay(date) {
  try {
    console.log(`Fetching image for date: ${date}`);
    const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    
    const data = await response.json();
    displayImage(data);
    saveSearch(date);
    addSearchToHistory();
  } catch (error) {
    console.error(`Error fetching image for ${date}:`, error.message);
    currentImageContainer.innerHTML = `<p>Error fetching image for ${date}: ${error.message}</p>`;
  }
}

function displayImage(data) {
  currentImageContainer.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.date}</p>
    <img src="${data.url}" alt="${data.title}">
    <p>${data.explanation}</p>
  `;
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem('searches')) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem('searches', JSON.stringify(searches));
  }
}

function addSearchToHistory() {
  const searches = JSON.parse(localStorage.getItem('searches')) || [];
  searchHistory.innerHTML = '';
  
  searches.forEach(date => {
    const listItem = document.createElement('li');
    listItem.textContent = date;
    listItem.addEventListener('click', () => getImageOfTheDay(date));
    searchHistory.appendChild(listItem);
  });
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const date = searchInput.value;
  if (date) getImageOfTheDay(date);
});

document.addEventListener('DOMContentLoaded', () => {
  getCurrentImageOfTheDay();
  addSearchToHistory();
});
