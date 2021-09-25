window.addEventListener("DOMContentLoaded", async function () {
  // calling leaflet map function
  let map = mainMap()

  /* ............................................Navbar....................................................*/
  
  let hide = document.querySelector("#hide");
  let searchContainer = document.querySelector("#body-box");

  // to hide the card box body
  hide.addEventListener ("click", function () {
    if (!searchContainer.style.display) {
      searchContainer.style.display = "none";
      hide.innerHTML = "Show";
    } else if (searchContainer.style.display == "none") {
      searchContainer.style.display = "block";
      hide.innerHTML = "Hide";
    } else {
      searchContainer.style.display = "none";
      hide.innerHTML = "Show";
    }
  });
  
  let exploreTab = document.querySelector("#explore-tab");
  let toggleTab = document.querySelector("#toggle-view-recom");
  let searchForm = document.querySelector("#toggle-search-form");

  // to display the Toggle search & recommendation when click on explore tab
  exploreTab.addEventListener ("click", function () {
    toggleTab.style.display = "block";
    searchForm.style.display = "none";
  });

  // to hide the Toggle search & recommendation when click on search tab
  let searchTab = document.querySelector("#search")
  searchTab.addEventListener ("click", function () {
    toggleTab.style.display = "none";
    searchForm.style.display = "block";
  });

  /* group several layers to added or removed on the map later on using Leaflet LayerGroup */
  let parkSearchMapLayer = L.layerGroup();
  let citySearchMapLayer = L.layerGroup();

  // for radius circle overlay layer
  let circleGroupLayer = L.layerGroup();

  map.addLayer(circleGroupLayer);
  map.addLayer(citySearchMapLayer);
  map.addLayer(parkSearchMapLayer);

  document.querySelector("#search-btn").addEventListener("click", async function (event) {
    event.preventDefault();

    // clear layers
    parkSearchMapLayer.clearLayers();
    citySearchMapLayer.clearLayers();
    circleGroupLayer.clearLayers();

    let query = document.querySelector("#search-input").value;
    let hrLine = document.querySelector(".hr-line");
    let clearBtn = document.querySelector("#btn-reset");

    // to determine which explore options has been selected
    let exploreOption = document.querySelector("input[name='explore']:checked").value;

    // to store both parks and city location 
    let locationData = [];

    /* ...................................National Park Location...........................................*/

    if (exploreOption === "outdoor" || exploreOption === "both") {
      await searchNParks(query)
      // parkData is new variable / aka let parkData = await searchNParks(query)
      .then( (parkData) => {
        addLocationsToMap(parkData, parkSearchMapLayer, natureIcon, map);  // plot marker onto the map 
        locationData = locationData.concat(parkData);  // combine 2 arrays data

        hrLine.style.display = "block";  // display hr line when search result display
        clearBtn.style.display = "block"; 
     
      });
    }

    /* .....................................Places Location.............................................*/

    if (exploreOption === "indoor" || exploreOption === "both") {
      /* Leaflet Method (for LatLngBounds objects): getBounds() returns LatLngBounds  // getCenter() returns LatLng */
      let center = map.getBounds().getCenter();
      let cityData = await searchLocations(center.lat, center.lng, query);
      
      addLocationsToMap(cityData, citySearchMapLayer, indoorIcon, map);  // plot marker onto the map  
      locationData = locationData.concat(cityData);

      hrLine.style.display = "block";  // display hr line when search result display
      clearBtn.style.display = "block"; 
    }

    /* ................................display result of search locations....................................*/

    // Display list of locations (can be outdoor + indoor)
    locationData = sortLocationsByName(locationData); // sorted both again by name alphabetically 
    let searchResultLayer = document.querySelector("#search-result-display");
    addLocationsToSearchResultDisplay(locationData, circleGroupLayer, searchResultLayer, map);

    // clear the search input
    document.querySelector("#search-input").value = "";
  });

  /* ...................................View Recommendation ...............................................*/

  /* display famous outdoor spots */
  let outdoorFamousSpotsLayer = L.layerGroup();
  await searchAttractions("outdoor")
  .then( (attractionData) => {
    addLocationsToMap(attractionData, outdoorFamousSpotsLayer, outdoorFamousIcon, map);
  });

  document.querySelector("input[name=recommend-outdoor]").addEventListener("change", function (event) {
    if (this.checked) {
      map.addLayer(outdoorFamousSpotsLayer);
    } else {
      map.removeLayer(outdoorFamousSpotsLayer);
    }
  });

  /* display famous indoor spots */
  let indoorFamousSpotsLayer = L.layerGroup();
  await searchAttractions("indoor")
  .then( (attractionData) => {
    addLocationsToMap(attractionData, indoorFamousSpotsLayer, indoorFamousIcon, map);
  });

  document.querySelector("input[name=recommend-indoor]").addEventListener("change", function (event) {
    if (this.checked) {
      map.addLayer(indoorFamousSpotsLayer);
    } else {
      map.removeLayer(indoorFamousSpotsLayer);
    }
  });

  /* ....................................Show Regions ................................................*/

  /* display regions */
  let regionsLayer = L.layerGroup();
  await searchSgRegions()
  .then( (regionData) => {
    displayRegions(regionData, regionsLayer);
  });

  document.querySelector("input[name=show-region]").addEventListener("change", function (event) {
    if (this.checked) {
      map.addLayer(regionsLayer);
    } else {
      map.removeLayer(regionsLayer);
    }
  });

  /* ....................................Weather Forecast ................................................*/

  /*
    How to get the first property of an object?
    https://stackoverflow.com/questions/983267/how-to-access-the-first-property-of-a-javascript-object
  */

  // layers for weather forecast
  let display2hrWeatherLayer = new L.layerGroup();
  let display24hrWeatherLayers = []

  map.addLayer(display2hrWeatherLayer);

  /* 2-hours Weather Forecast */ 
  let forecast2Hr = document.querySelector("#forecast-2hr");

  forecast2Hr.addEventListener ("click", async function () {
    // clear the layers for 2hr & 24hr layers
    display2hrWeatherLayer.clearLayers();
    display24hrWeatherLayers.map( a => map.removeLayer(Object.values(a)[0]) )

    await getWeatherData(weather2hrAPI)
    .then( (weatherData) => {
      let weatherDataFor2Hr = weatherData
      display2hrWeather(weatherDataFor2Hr, display2hrWeatherLayer, map)
    })
  });

  /* 24-hours Weather Forecast */ 
  let forecast24Hr = document.querySelector("#forecast-24hr");
  let forecast24hDisplayResult = document.querySelector("#weather-display");
  let forecast4dDisplayResult = document.querySelector("#weather-4d-display");

  // store the 24 hours weather data
  let weatherDataFor24Hr = undefined;

  // Retrieve the 24 hours weather data
  await getWeatherData(weather24hrAPI)
  .then( (weatherData) => {

    weatherDataFor24Hr = weatherData;

    // display the 24 hours weather display
    display24hrWeather(weatherDataFor24Hr, forecast24hDisplayResult);
    forecast24hDisplayResult.style.display = "block"
    forecast4dDisplayResult.style.display = "none";

    // prepare the layers for the 24 hours weather data (will have 3 layers for Morning, Afternoon, Night)
    display24hrWeatherLayers = prepareLayers24hrWeather(weatherDataFor24Hr, map);
  
    for (let i = 0; i < display24hrWeatherLayers.length; i++) {

      // get the time of day and its layer with weather icons
      let nextWeatherObject = display24hrWeatherLayers[i];
      let timeOfDay = Object.keys(nextWeatherObject)[0];
      let weatherLayer = Object.values(nextWeatherObject)[0];

      // get the DOM element for the list item for time of day
      let timeOfDayListItem = document.querySelector(`.list-group-item.${timeOfDay}`);

      timeOfDayListItem.addEventListener("click", function () {

        // clear the layers for 2hr & 24hr layers
        display2hrWeatherLayer.clearLayers();
        display24hrWeatherLayers.map( a => map.removeLayer(Object.values(a)[0]) );

        // clear background of list items
        (document.querySelectorAll('.list-group-item')).forEach( a => a.style.background = "");
        // set background of clicked list item to grey color
        timeOfDayListItem.style.background = "rgb(216, 231, 226)";

        // display current weather layer
        map.addLayer(weatherLayer);
      });
    }

    forecast24Hr.addEventListener("click", function () {

      // clear the layers for 2hr & 24hr layers
      display2hrWeatherLayer.clearLayers();
      display24hrWeatherLayers.map( a => map.removeLayer(Object.values(a)[0]) );

      // show the display result div for 24 hours weather forecast
      forecast24hDisplayResult.style.display = "block"

      // hide the display result div for 4 days weather forecast
      forecast4dDisplayResult.style.display = "none";

      // display the first layer in "display24hrWeatherLayers" array
      let nextWeatherObject = display24hrWeatherLayers[0];
      let timeOfDay = Object.keys(nextWeatherObject)[0];
      let weatherLayer = Object.values(nextWeatherObject)[0];

      // clear background of list items that are not selected
      let listItems = document.querySelectorAll('.list-group-item');
      listItems.forEach( a => {
        if (a.classList.contains(timeOfDay)) {
          a.style.background = "rgb(216, 231, 226)"
        } else {
          a.style.background = ""
        }
      });

      map.addLayer(weatherLayer);
    });

  })

  /* 4-days Weather Forecast */

  // store the 4-days weather data
  let weatherDataFor4Days = undefined;
  await getWeatherData(weather4dayAPI)
  .then( (weatherData) => {
    weatherDataFor4Days = weatherData;
    display4DayWeather(weatherDataFor4Days, forecast4dDisplayResult);
  });

  let forecast4Day = document.querySelector("#forecast-4days");
  forecast4Day.addEventListener ("click", async function () {
    // hide the display result div for 24 hours weather forecast
    forecast24hDisplayResult.style.display = "none"
    // show the display result div for 4 days weather forecast
    forecast4dDisplayResult.style.display = "block";
  });

});
