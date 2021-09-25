/* Weather Forecast API - ref https://data.gov.sg/dataset/weather-forecast */
const weather2hrAPI  = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast";
const weather24hrAPI = "https://api.data.gov.sg/v1/environment/24-hour-weather-forecast";
const weather4dayAPI = "https://api.data.gov.sg/v1/environment/4-day-weather-forecast";

/* Self-defined coordinates (lat/long) to plot weather icon for each region of Singapore */
const sgRegionCoordinates = {
    "north":   [ 1.419,   103.812 ],
    "east":    [ 1.345,   103.944 ],
    "south":   [ 1.277,   103.819 ],
    "west":    [ 1.34039, 103.705 ],
    "central": [ 1.327,   103.826]
}

/* Determine the weather icon based on text in the weather forecast */
function getWeatherIcon(forecast, getAsText=false) {
    let weatherIcon = cloudyIcon;
    forecast = forecast.toLowerCase();
    if (forecast.includes("partly cloudy")) {
        if (forecast.includes("night")) {
            // forecast of "Partly Cloudy (Night)"
            weatherIcon = partlyCloudyNightIcon;
        } else {
            // forecast of "Partly Cloudy (Day)"
            weatherIcon = partlyCloudyDayIcon;
        }
    } else if (forecast.includes("thundery")) {
        // forecast of "Thundery Showers", "Heavy Thundery Showers":
        weatherIcon = heavyThunderyShowersIcon;
    } else if (forecast.includes("rain") || forecast.includes("shower")) {
        if (forecast.includes("light") || forecast.includes("moderate")) {
            // forecast of "Light Showers", "Light Rain", "Moderate Rain"
            weatherIcon = lightToModerateRainIcon;
        } else {
            // forecast of "Showers"
            weatherIcon = showersIcon;
        }
    } else if (forecast.includes("fair")) {
        if (forecast.includes("night")) {
            // forecast of "Fair (Night)"
            weatherIcon = fairNightIcon;
        } else {
            // forecast of "Fair & Warm", "Fair (Day)"
            weatherIcon = fairDayIcon;
        }
    } else if (forecast.includes("cloudy")) {
        // forecast of "Cloudy"
        weatherIcon = cloudyIcon;
    }
    
    // if getAsText is "true", return the html of icon, else as leaflet divIcon object
    return getAsText ? weatherIcon.options.html : weatherIcon;
}

/* use moment.js library to convert date & time to ('YYYY-MM-DDTHH:MM:SS')  // https://momentjs.com/ */

/* Get the weather data via provided NEA Weather API */
async function getWeatherData(weatherApi) {
    let date_time = moment().format();
    params = {date_time};

    let response = await axios.get(weatherApi, { params });
    return response.data;
}

/* display the 2 hours weather data by plotting the weather icons on map */
function display2hrWeather(weatherData, display2hrWeatherLayer, map){

    for (let i=0; i< weatherData.area_metadata.length; i++){

        let area = weatherData.area_metadata[i];
        let forecast = weatherData.items[0].forecasts[i].forecast;
        let weatherCoordinate = [area.label_location.latitude, area.label_location.longitude];
        let popupMsg = `<b>${forecast}</b><br>${area.name}`;
        
        let weatherIcon = getWeatherIcon(forecast);
        let weatherMarker = L.marker(weatherCoordinate, {icon: weatherIcon}).bindPopup(popupMsg);

        display2hrWeatherLayer.addLayer(weatherMarker)
        // **** to fly to cordinate when click on marker ***
        weatherMarker.on("click", function(e){
            map.flyTo(this.getLatLng(),16);
        }) 
        
    }

    // add marker with tooltip with start/end time the forecast is for
    let displayCoordinate = [1.297, 103.944];
    let startTime = moment(weatherData.items[0].valid_period.start).format('h:mma DD MMM')
    let endTime = moment(weatherData.items[0].valid_period.end).format('h:mma DD MMM')
    let popupMsg = `<i>valid from</i> ${startTime} - ${endTime}`;
    let timeMarker = L.marker(displayCoordinate, {icon: clockIcon})
                      .bindTooltip(popupMsg, {permanent: true, direction: 'right', opacity: 0.7});
    display2hrWeatherLayer.addLayer(timeMarker);
}

/* display the 24 hours weather display */
function display24hrWeather(weatherData, forecastDisplayResult) {

    let forecast = weatherData.items[0].general.forecast;
    let lowTemp = weatherData.items[0].general.temperature.low;
    let highTemp = weatherData.items[0].general.temperature.high;  

    let weatherIcon = getWeatherIcon(forecast, true);
    const node = new DOMParser();
    let i = node.parseFromString(weatherIcon, "text/html").querySelector('i');
    i.style = 'font-size: 60px';
    weatherIcon = i.outerHTML;

    let weatherText = `
        <ul class="list-group list-group-horizontal">
            <li class="list-group-item morning">Morning</li>
            <li class="list-group-item afternoon">Afternoon</li>
            <li class="list-group-item night">Night</li>
        </ul>
        <h3>24 Hours Forecast</h3>
        <p class="weather-text">${forecast}</p>
        ${weatherIcon}
        <div style="font-size: 50px;"></div>

        <p class="weather-text"><i class="fas fa-temperature-low"></i> &nbsp;${lowTemp} &deg;C / <i class="fas fa-temperature-high"></i> &nbsp;${highTemp} &deg;C</p>
    `;
    forecastDisplayResult.innerHTML = weatherText;

}

/* Prepare the layers for the 24 hours weather data (will have 3 layers for Morning, Afternoon, Night) */
function prepareLayers24hrWeather(weatherData, map) {

    // to store the weather layers, one for each time of the day (i.e. Morning, Afternoon, Night)
    let weatherLayers = [];

    let weatherDataByTimeOfDay = weatherData.items[0].periods;
    for (let i = 0; i < weatherDataByTimeOfDay.length; i++) {

        // layer to plot weather icons for each region of that time of day
        let weatherLayer = new L.layerGroup();
        for (let regionName of Object.keys(weatherDataByTimeOfDay[i].regions)) {
            let forecast = weatherDataByTimeOfDay[i].regions[regionName];
            let weatherIcon = getWeatherIcon(forecast, false);
            let popupMsg = `<h6>${regionName.toUpperCase()}: ${forecast}</h6>`
            let weatherMarker = L.marker(sgRegionCoordinates[regionName], {icon: weatherIcon}).bindPopup(popupMsg);
            weatherLayer.addLayer(weatherMarker);

            // **** to fly to cordinate when click on marker ***
            weatherMarker.on("click", function(e){
                map.flyTo(this.getLatLng(),16);
            }) 
        }

        // add marker with tooltip with start/end time the forecast is for
        let displayCoordinate = [1.297, 103.944];
        let startTime = moment(weatherDataByTimeOfDay[i].time.start).format('h a DD MMM')
        let endTime = moment(weatherDataByTimeOfDay[i].time.end).format('h a DD MMM')
        let popupMsg = `<i>valid from</i> ${startTime} - ${endTime}`;
        let timeMarker = L.marker(displayCoordinate, {icon: clockIcon})
                          .bindTooltip(popupMsg, {permanent: true, direction: 'right', opacity: 0.7})
        weatherLayer.addLayer(timeMarker);

        // base on start hour of the forecast data, determine time of day (i.e. Morning, Afternoon, Night)
        // then append as an object { timeOfDay: weatherLayer }
        let startHour = moment(weatherDataByTimeOfDay[i].time.start).format('HH');
        switch(startHour) {
            case('00'):
                break;
            case('18'):
                weatherLayers.push({ 'night': weatherLayer });
                break;
            case('06'):
                weatherLayers.push({ 'morning': weatherLayer });
                break;
            case('12'):
                weatherLayers.push({ 'afternoon': weatherLayer });
                break;
        }

    }

    // the array of weather layers
    return weatherLayers;

}

/* display the 4 days weather display */
function display4DayWeather(weatherData, forecastDisplayResult) {

    let displayContent = `
    <ul id="forecast-4days">
      <li class="list-group-item"><h3>4-day Outlook<h3></li>
    `

    for (let nextDayWeatherData of weatherData.items[0].forecasts) {
        let dayOfWeek = moment(nextDayWeatherData.date).format("ddd");
        let forecast = nextDayWeatherData.forecast;
        let lowTemp = nextDayWeatherData.temperature.low;
        let highTemp = nextDayWeatherData.temperature.high;
        let weatherIcon = getWeatherIcon(forecast, true);

        let weatherText = `
        <li class="list-group-item">
            <div class="row">
                <div class="col-2 weather-4days-result-col">
                    ${weatherIcon}
                </div>
                <div class="col-10 weather-4days-result-col">
                    <b>${dayOfWeek}</b> &nbsp;&nbsp; ${forecast}
                    <div class="temp-weather-4days-result-col">
                        <i class="fas fa-temperature-low"></i> ${lowTemp} &deg;C / 
                        <i class="fas fa-temperature-high"></i> &nbsp;${highTemp} &deg;C
                    </div>
                </div>
            </div>
        </li>
        `
        displayContent += weatherText
    }

    displayContent += `</ul>`

    forecastDisplayResult.innerHTML = displayContent;

}
