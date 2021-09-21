// function to plot marker to the map (locationData is an array of objects from Location class)
function addLocationsToMap(locationData, mapLayer, markerIcon, map) {
  mapLayer.clearLayers();
  for (let location of locationData) {

    // plot the marker and add tooltip using lat-long onto the map layer with name pop up
    // the image will be displayed if it is available
    let popupContent;
    if (location.image == undefined) {
      popupContent = `<div><h5>${location.name}</h5></div>`;
    } else {
      popupContent = `<div><h5>${location.name}</h5><img src="${location.image}" style="width:50%"/></div>`;
    }
    let plotMarker = L.marker(location.coordinates, {"title": location.name, "icon": markerIcon}).bindPopup(popupContent);
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
        radius: 1000,
      });
      circle.addTo(circleGroupLayer);
      circle.bindPopup(`<b><i class="fas fa-walking"></i> within 1km from</b><h6>${location.name}</h6>`);
    });
  }

  // Fly to first Location in the search result
  if (locationData.length > 0) {
    map.flyTo(locationData[0].coordinates, 16);
    locationData[0].marker.openPopup();

    // clear existing overlay for radius circle
    circleGroupLayer.clearLayers();

    // show within 500 meter radius circle
    let circle = L.circle(locationData[0].coordinates, {
      color: "red",
      fillColor: "orange",
      fillOpacity: 0.5,
      radius: 1000,
    });
    circle.addTo(circleGroupLayer);
    circle.bindPopup(`<b><i class="fas fa-walking"></i> within 1km from</b><h6>${locationData[0].name}</h6>`);
  }

}