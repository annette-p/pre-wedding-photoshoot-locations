window.addEventListener("DOMContentLoaded", async function () {
  // calling leaflet map function
  let map = mainMap()
  
  let hide = document.querySelector("#hide")
  let searchContainer = document.querySelector("#body-box")

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
  
  let exploreTab = document.querySelector("#explore-tab")
  let toggleTab = document.querySelector("#toggle-view-recom")
  let searchForm = document.querySelector("#toggle-search-form")

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

  map.addLayer(circleGroupLayer)
  map.addLayer(citySearchMapLayer)
  map.addLayer(parkSearchMapLayer)

  /* display famous indoor spots */
  let indoorFamousSpotsLayer = L.layerGroup();
  await searchAttractions("indoor")
  .then( (attractionData) => {
    addLocationsToMap(attractionData, indoorFamousSpotsLayer, indoorFamousIcon, map);
  } );

  /* display famous outdoor spots */
  let outdoorFamousSpotsLayer = L.layerGroup();
  await searchAttractions("outdoor")
  .then( (attractionData) => {
    addLocationsToMap(attractionData, outdoorFamousSpotsLayer, outdoorFamousIcon, map);
  } );

  /* ...................................Event Listener for Navbar...........................................*/
  document.querySelector("#search-btn").addEventListener("click", async function (event) {
    event.preventDefault();

    // clear layers
    parkSearchMapLayer.clearLayers();
    citySearchMapLayer.clearLayers();
    circleGroupLayer.clearLayers();

    let query = document.querySelector("#search-input").value;
    let hrLine = document.querySelector(".hr-line");

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
     
      } );
    }

    /* .....................................Places Location.............................................*/

    if (exploreOption === "indoor" || exploreOption === "both") {
      /* Leaflet Method (for LatLngBounds objects): getBounds() returns LatLngBounds  // getCenter() returns LatLng */
      let center = map.getBounds().getCenter();
      let cityData = await searchLocations(center.lat, center.lng, query);
      
      addLocationsToMap(cityData, citySearchMapLayer, indoorIcon, map);  // plot marker onto the map  
      locationData = locationData.concat(cityData);

      hrLine.style.display = "block";  // display hr line when search result display
    }

    /* ................................display result of search locations....................................*/

    // Display list of locations (can be outdoor + indoor)
    locationData = sortLocationsByName(locationData); // sorted both again by name alphabetically 
    let searchResultLayer = document.querySelector("#search-result-display");
    addLocationsToSearchResultDisplay(locationData, circleGroupLayer, searchResultLayer, map)

    // clear the search input
    document.querySelector("#search-input").value = "";
  });

  /* ...................................View Recommendation ...............................................*/
  document.querySelector("input[name=recommend-outdoor]").addEventListener("change", function (event) {
    if (this.checked) {
      map.addLayer(outdoorFamousSpotsLayer)
    } else {
      map.removeLayer(outdoorFamousSpotsLayer)
    }
  });

  document.querySelector("input[name=recommend-indoor]").addEventListener("change", function (event) {
    if (this.checked) {
      map.addLayer(indoorFamousSpotsLayer)
    } else {
      map.removeLayer(indoorFamousSpotsLayer)
    }
  });


  /* ....................................Weather Forecast ................................................*/

  /* 2-hours Weather Forecast */ 
  let forecast2Hr = document.querySelector("#forecast-2hr");

  forecast2Hr.addEventListener ("click", async function () {
      await get2hrWeather(map)
  });

  /* 24-hours Weather Forecast */ 
  let forecast24Hr = document.querySelector("#forecast-2hr");
  let forecastDisplayResult = document.querySelector("#weather-display");

  forecast24Hr.addEventListener ("click", async function () {
    // await get24hrWeather(map)
    await get24hrWeather()
    forecastDisplayResult.innerHTML = get24hrWeather
});
    
});
