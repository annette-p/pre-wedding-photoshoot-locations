function addCitySearchResults(cityData, citySearchMapLayer, map) {
  citySearchMapLayer.clearLayers();

  let citySearchElement = document.querySelector("#search-result-display");
  // remove from search result div
  citySearchElement.innerHTML = "";

  for (let eachVenue of cityData) {
    let cityCoordinate = [eachVenue.location.lat, eachVenue.location.lng];
    let cityMarker = L.marker(cityCoordinate);
    cityMarker.bindPopup(`<div><h5>${eachVenue.name}</h5></div>`);
    // citySearchMapLayer.addLayer(marker)
    cityMarker.addTo(citySearchMapLayer);

    // store reference to marker in location object (key = marker, value = cityMarker)
    eachVenue.marker = cityMarker;

    // add the search result to #search-results  -- to display the search result
    let cityResultDisplay = document.createElement("div");
    cityResultDisplay.innerHTML = eachVenue.name;

    cityResultDisplay.addEventListener("click", function () {
      map.flyTo(cityCoordinate, 16);
      cityMarker.openPopup();
    });

    citySearchElement.appendChild(cityResultDisplay);
  }

  map.addLayer(citySearchMapLayer);

  // Fly to first city location in search result
  if (cityData.length > 0) {
    map.flyTo([cityData[0].location.lat, cityData[0].location.lng], 16);
    cityData[0].marker.openPopup();
  }

}