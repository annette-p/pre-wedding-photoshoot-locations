function addCitySearchResults(cityData, citySearchMapLayer, map) {
  citySearchMapLayer.clearLayers();

  let citySearchElement = document.querySelector("#search-result-display");
  // remove from search result div
  citySearchElement.innerHTML = "";

  // for radius circle overlay layer
  let circleGroup = L.layerGroup();

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

    // fly to location upon click
    cityResultDisplay.addEventListener("click", function () {
      map.flyTo(cityCoordinate, 16);
      cityMarker.openPopup();

      // clear existing overlay for radius circle
      circleGroup.clearLayers();

      // create within 500 meter radius circle
      let circle = L.circle(cityCoordinate, {
        color: "red",
        fillColor: "orange",
        fillOpacity: 0.5,
        radius: 500,
      });
      circle.addTo(circleGroup);
    });

    citySearchElement.appendChild(cityResultDisplay);
    map.addLayer(circleGroup)
  }

  map.addLayer(citySearchMapLayer);

  // Fly to first city location in search result
  if (cityData.length > 0) {
    map.flyTo([cityData[0].location.lat, cityData[0].location.lng], 16);
    cityData[0].marker.openPopup();
  }

}