const weather2hrAPI = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast"

/*
use moment.js library to convert date & time to ('YYYY-MM-DDTHH:MM:SS')  // https://momentjs.com/
*/

function get2hrWeather(){

    let date_time = moment().format()  // convert to YYYY-MM-DDTHH:MM:SS
    let date = moment().format('YYYY-MM-DD')  // convert to YYYY-MM-DD

    params = {date_time, date}

    // clearOptionalLayers();

    axios.get(weather2hrAPI, {params}).then(function (response) {

        let display2hrWeather = response.data
        display2hrWeatherLayer = new L.layerGroup()

        for (let i=0; i< display2hrWeather.area_metadata.length; i++){

            area = display2hrWeather.area_metadata[i]
            let forecast = display2hrWeather.items[0].forecasts[i].forecast
            let weatherCoordinate = [area.label_location.latitude, area.label_location.longitude]
                            
            switch (forecast){

                case "Cloudy":
                    marker = L.marker(weatherCoordinate, {icon: `<i class="fas fa-cloud"></i>`}).bindPopup(forecast + '<br>' + area.name)
                break;

                case "Fair & Warm":
                case "Fair (Day)":
                    marker = L.marker(weatherCoordinate, {icon: `<i class="far fa-sun"></i>`}).bindPopup(forecast + '<br>' + area.name)
                break;

                case "Partly Cloudy (Day)":
                    marker = L.marker(weatherCoordinate, {icon: `<i class="fas fa-cloud-sun"></i>`}).bindPopup(forecast + '<br>' + area.name)
                break;

                case "Partly Cloudy (Night)":
                    marker = L.marker(weatherCoordinate, {icon: `<i class="fas fa-cloud-moon"><i>`}).bindPopup(forecast + '<br>' + area.name)
                break;

                case "Fair (Night)":
                    marker = L.marker(weatherCoordinate, {icon: `<i class="fas fa-moon"></i>`}).bindPopup(forecast + '<br>' + area.name)
                break;

                case "Light Showers":
                case "Light Rain":
                case "Moderate Rain":
                    marker = L.marker(weatherCoordinate, {icon: `<i class="fas fa-cloud-sun-rain"></i>`}).bindPopup(forecast + '<br>' + area.name)
                break;

                case "Showers":
                    marker = L.marker(weatherCoordinate, {icon: `<i class="fas fa-cloud-showers-heavy"></i>`}).bindPopup(forecast + '<br>' + area.name)
                break;
                
                case "Thundery Showers":
                case "Heavy Thundery Showers":    
                marker = L.marker(weatherCoordinate, {icon: `<i class="fas fa-poo-storm"></i>`}).bindPopup(forecast + '<br>' + area.name)
                break;

                default:
                    marker = L.marker(weatherCoordinate, {icon: `<i class="fas fa-cloud"></i>`}).bindPopup(forecast + '<br>' + area.name)
                break;

            } 

            display2hrWeatherLayer.addLayer(marker)
            // **** to fly to cordinate when click on marker ***
            marker.on("click", function(e){
                map.flyTo(this.getLatLng(),14)
            }) 
            // marker.click(function(){
            //     map.flyTo(this.getLatLng(),14)
            // })
            
        }    
        display2hrWeatherLayer.addTo(map)
        // resetMapView()            
    })
}

let forecast2Hr = document.querySelector("#forecast-2hr");

forecast2Hr.addEventListener ("click", function () {
    get2hrWeather()
});

