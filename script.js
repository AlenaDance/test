const key = '765b31cce89d72eb5dbb8e153d6fd3d8';

const fetchData = function(URL, callback){
  fetch(`${URL}&appid=${key}`,{timeout:10000})
  .then(res => res.json())
  .then(data => callback(data));
}
 const url = {
  currentWeather(lat, lon){
    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ru&units=metric`
  },
  forecastWeather(lat,lon){
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=ru&units=metric`
  },
  geo(query){
    return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
  }
}

window.addEventListener('load', function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, weather(56.8667, 37.35));
  } 
});

const successCallback = function (position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  weather(latitude, longitude);
}


const searchField = document.getElementById('d');
const searchResult = document.getElementById('data-search-result');
const arrow = document.getElementById('arrow');
const glass = document.getElementById('glass');

searchField.addEventListener("input", function() {
  if(searchField.value){
        arrow.classList.add('active');
        glass.classList.remove('active');
        searchResult.classList.add("active");
        fetchData(url.geo(searchField.value), function(locations){
          searchResult.innerHTML ='<ul class="view-list"></ul>'; 
          let list = document.querySelector('ul');
          for( const{name, local_names, country, state, lat, lon} of locations){
            const searchItem = document.createElement("li");
            searchItem.classList.add("view-item");
            searchItem.innerHTML=`<div class="cities" onclick ="weather(${lat}, ${lon});">
                                    <p class ="item-title">${(local_names["ru"] || name)}</p>
                                    <p class = "item-subtitle">${state}, ${country}</p>
                                  </div>`;
            list.append(searchItem);
          }
        });     
  }
  if(!searchField.value){
    searchDisable();
  }
});

const weapper = document.querySelector('.weapper');
const descr = document.querySelector('.weather-description');
const place = document.querySelector('.place');
const seems = document.querySelector('.seems');
const wind = document.querySelector('.wind');
const date = document.querySelector('.date');
const humidity = document.querySelector('.humidity');
const pressure = document.querySelector('.pressure');

const cards = document.getElementsByClassName('time-title');
const temp2 = document.getElementsByClassName('temperature2');
const icon2 = document.getElementsByClassName('weapper2');
const descr2 = document.getElementsByClassName('weather-description2');

const dayTitle = document.getElementsByClassName('day-title');
const dayTemp = document.getElementsByClassName('temperature-day');
const dayIcon = document.getElementsByClassName('weapper-day');
const dayDescription = document.getElementsByClassName('weather-description-day');

const displayCurrentWeather = (currentWeatherData) => {
  weapper.innerHTML = "";
  weapper.innerHTML += `<p class="temperature" id="temp">${Math.round(currentWeatherData.main.temp)}&deg;<sup>c</sup></p>`;
  descr.innerHTML = `<i class="fa-solid fa-envelope"></i> ${currentWeatherData.weather[0]['description']}`;
  weapper.innerHTML += `<img src="https://openweathermap.org/img/wn/${currentWeatherData.weather[0]['icon'].substring(0,2)}d.png" alt="" class="weather-icon">`;
  place.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${currentWeatherData.name}`;
  seems.innerHTML = `<i class="fa-solid fa-temperature-half"></i> Ощущается как ${Math.round(currentWeatherData.main.feels_like)}&deg;<sup>c</sup>`;
  wind.innerHTML = `<i class="fa-solid fa-wind"></i> Скорость ветра ${currentWeatherData.wind.speed} м/c`;
  date.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${getDate(currentWeatherData.dt, currentWeatherData.timezone)}`;
  humidity.innerHTML = `<i class="fa-solid fa-droplet"></i> влажность воздуха ${currentWeatherData.main.humidity}%`;
  pressure.innerHTML = `<i class="fa-sharp fa-solid fa-gem"></i> давление ${Math.round(currentWeatherData.main.pressure*0.750063755419211)} мм.рт.ст`;
};

const displayHourlyForecast = function(forecastWeatherData){
  for (let i = 0; i < 8; i++) {
      const date24 = forecastWeatherData.list[i].dt_txt;
      cards[i].innerHTML = date24.substring(8, 10) + '.' + date24.substring(5, 7) + ' ' + date24.slice(-8);
      temp2[i].innerHTML = Math.round(forecastWeatherData.list[i].main.temp) + '&deg;<sup>c</sup>';
      icon2[i].innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastWeatherData.list[i].weather[0]['icon'].substring(0,2)}d.png" alt="" class="weather-icon2">`;
      descr2[i].innerHTML = forecastWeatherData.list[i].weather[0]['description'];
  }
};

const displayDailyForecast = function(forecastWeatherData){
  let count = 0;
  for (let i = 8; i < 40; i++) {
      if ((forecastWeatherData.list[i].dt_txt).slice(-8) == "15:00:00") {
          dayTitle[count].innerHTML = (getDate(forecastWeatherData.list[i].dt, forecastWeatherData.city.timezone)).substring(6);
          dayTemp[count].innerHTML = Math.round(forecastWeatherData.list[i].main.temp) + '&deg;<sup>c</sup>';
          dayIcon[count].innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastWeatherData.list[i].weather[0]['icon'].substring(0,2)}d.png" alt="" class="weather-icon2">`;
          dayDescription[count].innerHTML = forecastWeatherData.list[i].weather[0]['description'];
          count++;
      }
  }
};

const weather = function(lat, lon) {
  searchDisable();
  fetchData(url.currentWeather(lat, lon), function(currentWeatherData) {
      displayCurrentWeather(currentWeatherData);
  });
  fetchData(url.forecastWeather(lat, lon), function(forecastWeatherData) {
      displayHourlyForecast(forecastWeatherData);
      displayDailyForecast(forecastWeatherData);
  });
};

const getDate = function(dateUnix, timezone){
  const weekDayNames = ["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"];
  const monthNames = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
  const date = new Date((dateUnix+timezone)*1000);
  const weekDayName = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];
  return date.getUTCHours() +':'+ ('0'+date.getUTCMinutes()).slice(-2)+ ', '+ date.getUTCDate() + ' ' + monthName + ', ' + weekDayName;
}

const searchDisable = function(){
  searchResult.classList.remove("active");
  arrow.classList.remove('active');
  glass.classList.add('active');
  searchField.value = "";
  searchResult.innerHTML = "";
}



const egg = document.querySelector('.eggwrap');
const img1 = egg.querySelector('.zont');
const logo = document.querySelector('.logo');
const stakan = document.querySelector('.logo2');
const simka = document.querySelector('.simka');
document.addEventListener('click', function(event) {
  if (egg.contains(event.target) && event.target != img1 && event.target != stakan) {
    egg.classList.remove('active');
    simka.classList.remove('active');
  }
  if(logo.contains(event.target)){
    egg.classList.add('active');
  }
  if(stakan.contains(event.target)){
    simka.classList.toggle('active');
  }
});
