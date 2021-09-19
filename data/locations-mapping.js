// function to plot marker to the map (locationData is an array of objects from Location class)
function addLocationsToMap(locationData, mapLayer, map) {
  mapLayer.clearLayers();
  for (let location of locationData) {

    // plot the marker and add tooltip using lat-long onto the map layer with name pop up
    let plotMarker = L.marker(location.coordinates, {"title": location.name}).bindPopup(`<div><h5>${location.name}</h5></div>`);
    mapLayer.addLayer(plotMarker);

    // store reference to marker in Location object
    location.marker = plotMarker;
  }
}

// to add search result to display container (locationData is an array of objects from Location class)
function addLocationsToSearchResultDisplay(locationData, circleGroupLayer, searchResultLayer, map) {
  // remove from search result
  searchResultLayer.innerHTML = ""

  for (let location of locationData) {
    let resultDisplay = document.createElement("div");
    resultDisplay.innerHTML = location.name;
    searchResultLayer.appendChild(resultDisplay)
    
    // to fly to markers when click
    resultDisplay.addEventListener("click", function () {
      map.flyTo(location.coordinates, 16);
      location.marker.openPopup();
      // console.log(location.marker.getLatLng());

      // clear existing overlay for radius circle
      circleGroupLayer.clearLayers();

      // create within 500 meter radius circle
      let circle = L.circle(location.coordinates, {
        color: "red",
        fillColor: "orange",
        fillOpacity: 0.5,
        radius: 500,
      });
      circle.addTo(circleGroupLayer);
    });
    
  }

  // Fly to first Location in the search result
  if (locationData.length > 0) {
    map.flyTo(locationData[0].coordinates, 16);
    locationData[0].marker.openPopup();
  }

}