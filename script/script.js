window.addEventListener("DOMContentLoaded", async function () {
  // calling leaflet map function
  let map = mainMap()
  
  let hide = document.querySelector("#hide")
  let searchContainer = document.querySelector("#body-box")

    // to hide the card box body
    hide.addEventListener ("click", function () {
      if (
        searchContainer.style.display == "none" ||
        !searchContainer.style.display
      ) {
        searchContainer.style.display = "block";
        hide.innerHTML = "hide";
      } else {
        searchContainer.style.display = "none";
        hide.innerHTML = "show";
      }
  });

  // to display the Toggle search & recommendation when click on explore tab
  let exploreTab = document.querySelector("#explore-tab")
  let toggleTab = document.querySelector("#toggle-view-recom")
  let searchForm = document.querySelector("#toggle-search-form")

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
  // TODO - to place this in the "click" event listener of desired DOM element
  await searchAttractions("indoor")
  .then( (attractionData) => {
    addLocationsToMap(attractionData, indoorFamousSpotsLayer, map);
  } );
  map.addLayer(indoorFamousSpotsLayer)

  /* display famous outdoor spots */
  let outdoorFamousSpotsLayer = L.layerGroup();
  // TODO - to place this in the "click" event listener of desired DOM element
  await searchAttractions("outdoor")
  .then( (attractionData) => {
    addLocationsToMap(attractionData, outdoorFamousSpotsLayer, map);
  } );
  map.addLayer(outdoorFamousSpotsLayer)

  document.querySelector("#search-btn").addEventListener("click", async function (event) {
    event.preventDefault();

    // clear layers
    parkSearchMapLayer.clearLayers();
    citySearchMapLayer.clearLayers();
    circleGroupLayer.clearLayers();

    let query = document.querySelector("#search-input").value;

    // to determine which explore options has been selected
    let exploreOption = document.querySelector("input[name='explore']:checked").value;

    // to store both parks and city location 
    let locationData = [];

    /* ...................................National Park Location...........................................*/

    if (exploreOption === "outdoor" || exploreOption === "both") {
      await searchNParks(query)
      // parkData is new variable / aka let parkData = await searchNParks(query)
      .then( (parkData) => {
        addLocationsToMap(parkData, parkSearchMapLayer, map);  // plot marker onto the map 
        locationData = locationData.concat(parkData);  // combine 2 arrays data
      } );
    }

    /* ...................................Places Location...............................................*/

    if (exploreOption === "indoor" || exploreOption === "both") {
      /* 
      Leaflet Method (for LatLngBounds objects):
      getBounds() returns LatLngBounds  // getCenter() returns LatLng
      */
      let center = map.getBounds().getCenter();
      let cityData = await searchLocations(center.lat, center.lng, query);

      
      addLocationsToMap(cityData, citySearchMapLayer, map);  // plot marker onto the map  

      locationData = locationData.concat(cityData);
    }

    /* ................................display result of search locations....................................*/

    // Display list of locations (can be outdoor + indoor)
    locationData = sortLocationsByName(locationData); // sorted both again by name alphabetically 
    let searchResultLayer = document.querySelector("#search-result-display");
    addLocationsToSearchResultDisplay(locationData, circleGroupLayer, searchResultLayer, map)

    // clear the search input
    document.querySelector("#search-input").value = "";

  });

});
