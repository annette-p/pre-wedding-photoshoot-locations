
function addCitySearchResults(cityData, citySearchMapLayer, map) {
    citySearchMapLayer.clearLayers();

    let citySearchElement = document.querySelector("#city-search-result-display");
    // remove from search result div
    citySearchElement.innerHTML = "";

    for (let eachVenue of cityData.response.venues) {
        let cityCoordinate = [eachVenue.location.lat, eachVenue.location.lng];
        let cityMarker = L.marker(cityCoordinate);
        cityMarker.bindPopup(`<div><h5>${eachVenue.name}</h5></div>`);
        // citySearchMapLayer.addLayer(marker)
        cityMarker.addTo(citySearchMapLayer);
    
        // add the search result to #search-results  -- to display the search result
        let cityResultDisplay = document.createElement("div");
        // cityResultDisplay.className = "city-search-result";
        cityResultDisplay.innerHTML = eachVenue.name;
    
        cityResultDisplay.addEventListener("click", function () {
          map.flyTo(cityCoordinate, 16);
          cityMarker.openPopup();
        });
    
        citySearchElement.appendChild(cityResultDisplay);
      }
    
      map.addLayer(citySearchMapLayer);
}