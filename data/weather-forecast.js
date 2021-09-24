const weather2hrAPI = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast"

/* use moment.js library to convert date & time to ('YYYY-MM-DDTHH:MM:SS')  // https://momentjs.com/ */

async function get2hrWeather(display2hrWeatherLayer, map){

    let date_time = moment().format()  // convert to YYYY-MM-DDTHH:MM:SS
    let date = moment().format('YYYY-MM-DD')  // convert to YYYY-MM-DD
    params = {date_time, date}

    // clearOptionalLayers();

    await axios.get(weather2hrAPI, {params}).then(function (response) {

        let display2hrWeather = response.data;

        for (let i=0; i< display2hrWeather.area_metadata.length; i++){

            area = display2hrWeather.area_metadata[i];
            let forecast = display2hrWeather.items[0].forecasts[i].forecast;
            let weatherCoordinate = [area.label_location.latitude, area.label_location.longitude];
            let popupMsg = `<b>${forecast}</b><br>${area.name}`;
            // console.log(area.name, weatherCoordinate, forecast)
            
            let weatherMarker = undefined;
            switch (forecast){
                case "Cloudy":
                    weatherMarker = L.marker(weatherCoordinate, {icon: cloudyIcon}).bindPopup(popupMsg)
                    // bindPopup(forecast + '<br>' + area.name)
                break;

                case "Fair & Warm":
                case "Fair (Day)":
                    weatherMarker = L.marker(weatherCoordinate, {icon: fairDayIcon}).bindPopup(popupMsg)
                break;

                case "Partly Cloudy (Day)":
                    weatherMarker = L.marker(weatherCoordinate, {icon: partlyCloudyDayIcon}).bindPopup(popupMsg)
                break;

                case "Partly Cloudy (Night)":
                    weatherMarker = L.marker(weatherCoordinate, {icon: partlyCloudyNightIcon}).bindPopup(popupMsg)
                break;

                case "Fair (Night)":
                    weatherMarker = L.marker(weatherCoordinate, {icon: fairNightIcon}).bindPopup(popupMsg)
                break;

                case "Light Showers":
                case "Light Rain":
                case "Moderate Rain":
                    weatherMarker = L.marker(weatherCoordinate, {icon: lightToModerateRainIcon}).bindPopup(popupMsg)
                break;

                case "Showers":
                    weatherMarker = L.marker(weatherCoordinate, {icon: showersIcon}).bindPopup(popupMsg)
                break;
                
                case "Thundery Showers":
                case "Heavy Thundery Showers":    
                    weatherMarker = L.marker(weatherCoordinate, {icon: heavyThunderyShowersIcon}).bindPopup(popupMsg)
                break;

                default:
                    weatherMarker = L.marker(weatherCoordinate, {icon: cloudyIcon}).bindPopup(popupMsg)
                break;
            } 

            display2hrWeatherLayer.addLayer(weatherMarker)
            // **** to fly to cordinate when click on marker ***
            weatherMarker.on("click", function(e){
                map.flyTo(this.getLatLng(),16);
            }) 
            
        }          
    })
}

const weather24hrAPI = "https://api.data.gov.sg/v1/environment/24-hour-weather-forecast"

const sgRegionCoordinates = {
    "north":   [ 1.419,   103.812 ],
    "east":    [ 1.345,   103.944 ],
    "south":   [ 1.277,   103.819 ],
    "west":    [ 1.34039, 103.705 ],
    "central": [ 1.327,   103.826]
}

function getWeatherIcon(forecast, getAsText=false) {
    let weatherIcon = undefined;
    switch (forecast){
        case "Cloudy":
            weatherIcon = cloudyIcon
            break;

        case "Fair & Warm":
        case "Fair (Day)":
            weatherIcon = fairDayIcon
            break;

        case "Partly Cloudy (Day)":
            weatherIcon = partlyCloudyDayIcon
            break;

        case "Partly Cloudy (Night)":
            weatherIcon = partlyCloudyNightIcon
            break;

        case "Fair (Night)":
            weatherIcon = fairNightIcon
            break;

        case "Light Showers":
        case "Light Rain":
        case "Moderate Rain":
            weatherIcon = lightToModerateRainIcon
            break;

        case "Showers":
            weatherIcon = showersIcon
            break;
        
        case "Thundery Showers":
        case "Heavy Thundery Showers":    
            weatherIcon = heavyThunderyShowersIcon
            break;

        default:
            weatherIcon = cloudyIcon
            break;
    }
    return getAsText ? weatherIcon : weatherIcon.options.html;
}

/* get the 24 hours weather data via API */
async function get24hrWeather() {

    let date_time = moment().format();
    let date = moment().format('YYYY-MM-DD');

    params = {date_time, date};

    let response = await axios.get(weather24hrAPI, { params });
    return response.data;
}

/* display the 24 hours weather display */
function display24hrWeather(weatherData, forecastDisplayResult) {

    let forecast = weatherData.items[0].general.forecast;
    let lowTemp = weatherData.items[0].general.temperature.low;
    let highTemp = weatherData.items[0].general.temperature.high;  

    // get the weather icon based on forecast
    let weatherIcon = getWeatherIcon(forecast, false);
    // increase the icon size
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
        <h3 class="forecast24hr-md-text">24 Hours Forecast</h3>
        <h4 class="forecast24hr-sm-text">24 Hours Forecast</h4>
        <p class="weather-text">${forecast}</p>
        ${weatherIcon}
        <div style="font-size: 50px;"></div>

        <p class="weather-text"><i class="fas fa-temperature-low"></i> &nbsp;${lowTemp} &deg;C / <i class="fas fa-temperature-high"></i> &nbsp;${highTemp} &deg;C</p>
    `;
    forecastDisplayResult.innerHTML = weatherText;

}

/* Prepare the layers for the 24 hours weather data (will have 3 layers for Morning, Afternoon, Night) */
function prepareLayers24hrWeather(weatherData) {

    // to store the weather layers, one for each time of the day (i.e. Morning, Afternoon, Night)
    let weatherLayers = [];

    let weatherDataByTimeOfDay = weatherData.items[0].periods;
    for (let i = 0; i < weatherDataByTimeOfDay.length; i++) {

        // layer to plot weather icons for each region of that time of day
        let weatherLayer = new L.layerGroup();
        for (let regionName of Object.keys(weatherDataByTimeOfDay[i].regions)) {
            let forecast = weatherDataByTimeOfDay[i].regions[regionName];
            let weatherIcon = getWeatherIcon(forecast, true);
            let weatherMarker = L.marker(sgRegionCoordinates[regionName], {icon: weatherIcon});
            weatherLayer.addLayer(weatherMarker);
        }

        // base on start hour of the forecast data, determine time of day (i.e. Morning, Afternoon, Night)
        // then append as an object { timeOfDay: weatherLayer }
        let startHour = moment(weatherDataByTimeOfDay[i].time.start).format('HH');
        switch(startHour) {
            case('06'):
                weatherLayers.push({ 'Morning': weatherLayer });
                break;
            case('12'):
                weatherLayers.push({ 'Afternoon': weatherLayer });
                break;
            case('18'):
                weatherLayers.push({ 'Night': weatherLayer });
                break;
        }

    }

    // console.log("in function", weatherLayers);
    
    // the array of weather layers
    return weatherLayers;

}

// async function get24hrWeather(forecastDisplayResult) {
//     let date_time = moment().format()
//     let date = moment().format('YYYY-MM-DD')

//     params = {date_time, date}

//     await axios.get(weather24hrAPI, { params }).then(function (response) {
//         let display24hrWeather = response.data;
//         let display24hrWeatherLayer = new L.layerGroup();

//         let forecast = display24hrWeather.items[0].general.forecast;
//         let lowTemp = display24hrWeather.items[0].general.temperature.low;
//         let highTemp = display24hrWeather.items[0].general.temperature.high;
//         // for adding to map
//         // let regionCoordinate = display24hrWeather.items[0].periods[i].regions;
//         // let timeProjection = display24hrWeather.items[0].periods[i].time;
//         // let popupMsg = `<b>${forecast}</b>`;

//         let aveTemp = Math.floor((lowTemp + highTemp) / 2)

//         // let weatherMarker = undefined;
//         let weatherIcon = undefined;

//             switch (forecast){
//                 case "Fair & Warm":
//                 case "Fair (Day)":
//                     weatherIcon = '<i class="far fa-sun weather-marker-icon"></i>'
//                     // weatherMarker = L.marker(regionCoordinate, {icon: fairDayIcon}).bindPopup(popupMsg)
//                 break;

//                 case "Partly Cloudy (Day)":
//                     weatherIcon = '<i class="fas fa-cloud-sun weather-marker-icon"></i>'
//                 break;

//                 case "Cloudy":
//                     weatherIcon = '<i class="fas fa-cloud weather-marker-icon"></i>'
//                 break;

//                 case "Partly Cloudy (Night)":
//                     weatherIcon = '<i class="fas fa-cloud-moon weather-marker-icon"><i>'
//                 break;

//                 case "Light Showers":
//                 case "Light Rain":
//                 case "Moderate Rain":
//                     weatherIcon = '<i class="fas fa-cloud-sun-rain weather-marker-icon"></i>'
//                 break;
                
//                 case "Showers":
//                     weatherIcon = '<i class="fas fa-cloud-showers-heavy weather-marker-icon"></i>'
//                 break;
                
//                 case "Thundery Showers":
//                 case "Heavy Thundery Showers":    
//                     weatherIcon = '<i class="fas fa-poo-storm weather-marker-icon"></i>'
//                 break;

//                 default:
//                     weatherIcon = '<i class="fas fa-cloud weather-marker-icon"></i>'
//                 break;

//             } 

//             let weatherText = `
//                 <h3>24 Hours Forecast</h3>
//                 <p class="weather-text">${forecast}</p>
//                 ${weatherIcon} 

//                 <p class="weather-text"><i class="fas fa-temperature-low"></i> &nbsp;${lowTemp} &deg;C / <i class="fas fa-temperature-high"></i> &nbsp;${highTemp} &deg;C</p>
//             `
//             forecastDisplayResult.innerHTML = weatherText;

//     })

// }
