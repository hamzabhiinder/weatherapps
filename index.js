let timeEl = document.querySelector("#time").value
let dateEl = document.querySelector("#date").value
let currentWeatherItemsEl = document.querySelector("#current-weather-items")
let timezone = document.querySelector("#time-zone").value
let country = document.querySelector("#country").value
let weatherForecastEl = document.querySelector("#weather-forecast")
let currentTempEl = document.querySelector("#current-temp")


let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let API_KEY = 'd306ac66498d23b3c3af932f22a954d8';

setInterval(() => {
    let time = new Date()
    let month = time.getMonth()
    let date = time.getDate()
    let day = time.getDay()
    let hour = time.getHours()
    let hoursIn24Format = hour >= 13 ? hour % 12 : hour
    let minute = time.getMinutes()
    let ampm = hour >= 12 ? 'PM' : 'AM'
    document.querySelector("#time").innerHTML = hoursIn24Format + ':' + minute + ' ' + `<span id="am-pm">${ampm}</span>`

    document.querySelector("#date").innerHTML = days[day] + ', ' + date + ' ' + months[month]
}, 1000);

getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success)

        let { latitude, longitude } = success.coords

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })
    });


}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    currentWeatherItemsEl.innerHTML =
        `<div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}%</div>
</div>
<div class="weather-item">
    <div>Pressure</div>
    <div>${pressure}%</div>
</div>  <div class="weather-item">
    <div>Wind</div>
    <div>${wind_speed}%</div>
</div>
<div class="weather-item">
    <div>Sunrise</div>
    <div>${sunrise}%</div>
</div><div class="weather-item">
<div>Sunset</div>
<div>${sunset}%</div>
</div>
`


let otherDayForcast = ''
data.daily.forEach((day, idx) => {
    if(idx == 0){
        document.querySelector("#current-temp").innerHTML = `
        <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
        <div class="other">
            <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
            <div class="temp">Night - ${day.temp.night}&#176;C</div>
            <div class="temp">Day - ${day.temp.day}&#176;C</div>
        </div>
        
        `
    }else{
        otherDayForcast += `
        <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Night - ${day.temp.night}&#176;C</div>
            <div class="temp">Day - ${day.temp.day}&#176;C</div>
        </div>
        
        `
    }
})


weatherForecastEl.innerHTML = otherDayForcast;

}
