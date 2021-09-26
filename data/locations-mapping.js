// function to plot marker to the map (locationData is an array of objects from Location class)
function addLocationsToMap(locationData, circleGroupLayer, mapLayer, markerIcon, map) {
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

    // **** to fly to cordinate when click on marker ***
    plotMarker.on("click", function(e){
      map.flyTo(location.coordinates, 15);

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
      map.flyTo(location.coordinates, 15);
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
    map.flyTo(locationData[0].coordinates, 15);
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

/* ........................................ SG Regions ................................................*/

function displayRegions(regionData, mapLayer) {
  for (let region of regionData) {
    // extract region name
    let regionName = getRegionNameFromDescription(region.properties.Description)
    let regionColor = "";
    switch (regionName) {
      case 'WEST REGION': regionColor = "blue"; break;
      case 'NORTH REGION': regionColor = "green"; break;
      case 'NORTH-EAST REGION': regionColor = "red"; break;
      case 'EAST REGION': regionColor = "yellow"; break;
      case 'CENTRAL REGION': regionColor = "orange"; break;
      default: regionColor = ""; break;
    }

    // create a multi-polygon layer using geojson data, with background color
    let polygon = L.geoJSON(region.geometry, { style: {color: regionColor} });

    // get center coordinate of multi-polygon layer - on Leaflet
    let center = polygon.getBounds().getCenter()
    // create Leaflet marker at the center coordinatr, with tooltip showing region name  // permanent: true >> is to always display
    let marker = L.marker(center).bindTooltip(regionName, {permanent: true, direction:"center", className: 'polygon-labels'});
    mapLayer.addLayer(marker)
    mapLayer.addLayer(polygon)
  }
}