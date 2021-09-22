const weather2hrAPI = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast"

/* use moment.js library to convert date & time to ('YYYY-MM-DDTHH:MM:SS')  // https://momentjs.com/ */

async function get2hrWeather(map){

    let date_time = moment().format()  // convert to YYYY-MM-DDTHH:MM:SS
    let date = moment().format('YYYY-MM-DD')  // convert to YYYY-MM-DD
    params = {date_time, date}

    // clearOptionalLayers();

    await axios.get(weather2hrAPI, {params}).then(function (response) {

        let display2hrWeather = response.data;
        let display2hrWeatherLayer = new L.layerGroup()

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
                map.flyTo(this.getLatLng(),16)
            }) 
            
        }    
        map.addLayer(display2hrWeatherLayer)
        // resetMapView()            
    })
}

// let forecast2Hr = document.querySelector("#forecast-2hr");

// forecast2Hr.addEventListener ("click", function () {
//     get2hrWeather()
// });


const weather24hrAPI = "https://api.data.gov.sg/v1/environment/24-hour-weather-forecast"

async function get24hrWeather() {
    let date_time = moment().format()
    let date = moment().format('YYYY-MM-DD')

    params = {date_time, date}

    await axios.get(weather24hrAPI, { params }).then(function (response) {
        let display24hrWeather = response.data;
        let display24hrWeatherLayer = new L.layerGroup();

        let forecast = display24hrWeather.items[0].general.forecast;
        let lowTemp = display24hrWeather.items[0].general.temperature.low;
        let highTemp = display24hrWeather.items[0].general.temperature.high;
        let regionCoordinate = display24hrWeather.items[0].periods[i].regions;
        let timeProjection = display24hrWeather.items[0].periods[i].time;
        let popupMsg = `<b>${forecast}</b>`;

        let aveTemp = Math.floor((lowTemp + highTemp) / 2)

        // let weatherMarker = undefined;
        let weatherIcon = undefined;

            switch (forecast){
                case "Fair & Warm":
                case "Fair (Day)":
                    weatherIcon = '<i class="far fa-sun weather-marker-icon"></i>'
                    // weatherMarker = L.marker(regionCoordinate, {icon: fairDayIcon}).bindPopup(popupMsg)
                break;

                case "Partly Cloudy (Day)":
                    weatherIcon = '<i class="fas fa-cloud-sun weather-marker-icon"></i>'
                break;

                case "Cloudy":
                    weatherIcon = '<i class="fas fa-cloud weather-marker-icon"></i>'
                break;

                case "Partly Cloudy (Night)":
                    weatherIcon = '<i class="fas fa-cloud-moon weather-marker-icon"><i>'
                break;

                case "Light Showers":
                case "Light Rain":
                case "Moderate Rain":
                    weatherIcon = '<i class="fas fa-cloud-sun-rain weather-marker-icon"></i>'
                break;
                
                case "Showers":
                    weatherIcon = '<i class="fas fa-cloud-showers-heavy weather-marker-icon"></i>'
                break;
                
                case "Thundery Showers":
                case "Heavy Thundery Showers":    
                    weatherIcon = '<i class="fas fa-poo-storm weather-marker-icon"></i>'
                break;

                default:
                    weatherIcon = '<i class="fas fa-cloud weather-marker-icon"></i>'
                break;

            } 

            let weatherText = `
                    <h3 class="bluetext mb-0 mt-3">24 Hours Forecast</h3>
                    
                        <p class="weatherText mt-0 pt-0 pb-0 mb-0">${forecast} </span></p>
                        <img src="${weatherIcon}" class="ml-2 pt-2"> 

                        <p class="highlow mt-3">
                            <small class="lightgreen-text"><sup><i class="fas fa-temperature-low"></i></sup> </small>${lowTemp} / <small class="text-danger"><sup><i class="fas fa-temperature-high"></i></sup></small> ${highTemp}
                        </p>
            `

            $('#weather-display').empty()
            $('#weather-display').append(weatherText)

    })

}
