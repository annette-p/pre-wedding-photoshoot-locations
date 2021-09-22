const weather2hrAPI = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast"

/*
use moment.js library to convert date & time to ('YYYY-MM-DDTHH:MM:SS')  // https://momentjs.com/
*/

async function get2hrWeather(map){

    let date_time = moment().format()  // convert to YYYY-MM-DDTHH:MM:SS
    let date = moment().format('YYYY-MM-DD')  // convert to YYYY-MM-DD

    params = {date_time, date}

    // clearOptionalLayers();

    await axios.get(weather2hrAPI, {params}).then(function (response) {

        let display2hrWeather = response.data
        let display2hrWeatherLayer = new L.layerGroup()

        for (let i=0; i< display2hrWeather.area_metadata.length; i++){

            area = display2hrWeather.area_metadata[i]
            let forecast = display2hrWeather.items[0].forecasts[i].forecast
            let weatherCoordinate = [area.label_location.latitude, area.label_location.longitude]
            console.log(area.name, weatherCoordinate, forecast)
            
            let weatherMarker = undefined
            switch (forecast){
                case "Cloudy":
                    weatherMarker = L.marker(weatherCoordinate, {icon: cloudyIcon}).bindPopup(forecast + '<br>' + area.name)
                break;

                case "Fair & Warm":
                case "Fair (Day)":
                    weatherMarker = L.marker(weatherCoordinate, {icon: fairDayIcon}).bindPopup(forecast + '<br>' + area.name)
                break;

                case "Partly Cloudy (Day)":
                    weatherMarker = L.marker(weatherCoordinate, {icon: partlyCloudyDayIcon}).bindPopup(forecast + '<br>' + area.name)
                break;

                case "Partly Cloudy (Night)":
                    weatherMarker = L.marker(weatherCoordinate, {icon: partlyCloudyNightIcon}).bindPopup(forecast + '<br>' + area.name)
                break;

                case "Fair (Night)":
                    weatherMarker = L.marker(weatherCoordinate, {icon: fairNightIcon}).bindPopup(forecast + '<br>' + area.name)
                break;

                case "Light Showers":
                case "Light Rain":
                case "Moderate Rain":
                    weatherMarker = L.marker(weatherCoordinate, {icon: lightToModerateRainIcon}).bindPopup(forecast + '<br>' + area.name)
                break;

                case "Showers":
                    weatherMarker = L.marker(weatherCoordinate, {icon: showersIcon}).bindPopup(forecast + '<br>' + area.name)
                break;
                
                case "Thundery Showers":
                case "Heavy Thundery Showers":    
                    weatherMarker = L.marker(weatherCoordinate, {icon: heavyThunderyShowersIcon}).bindPopup(forecast + '<br>' + area.name)
                break;

                default:
                    weatherMarker = L.marker(weatherCoordinate, {icon: cloudyIcon}).bindPopup(forecast + '<br>' + area.name)
                break;
            } 

            display2hrWeatherLayer.addLayer(weatherMarker)
            // **** to fly to cordinate when click on marker ***
            weatherMarker.on("click", function(e){
                map.flyTo(this.getLatLng(),14)
            }) 
            // marker.click(function(){
            //     map.flyTo(this.getLatLng(),14)
            // })
            
        }    
        // display2hrWeatherLayer.addTo(map)
        map.addLayer(display2hrWeatherLayer)
        // resetMapView()            
    })
}

// let forecast2Hr = document.querySelector("#forecast-2hr");

// forecast2Hr.addEventListener ("click", function () {
//     get2hrWeather()
// });

