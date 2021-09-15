/* Extract park's "Name" from park's description */
function getParkNameFromDescription(parkDescription) {
  let divElement = document.createElement("div");
  // setting innerHTML from the description
  divElement.innerHTML = parkDescription;
  // select td from n-park's table data
  let cells = divElement.querySelectorAll("td");
  // 7th elements of td represent the park's name
  let name = cells[6].innerHTML;

  return name;
}


/* Search for the parks details based on user's query */
async function searchParks(query) {
  let response = await axios.get(nparkAPI);

  // Store the parks that match user's query
  let filteredParks = [];
  for (let park of response.data.features) {
    let parkDesc = park.properties.Description
    if (parkDesc.toLowerCase().indexOf(query.toLowerCase()) > 0) {
      filteredParks.push(park);
    }
  }

  /*
  sorting based on park's names 

  sort() can no have arguments, i put anonymous function with (2) arguments here for comparision purpose 
  */
  filteredParks.sort( (park1, park2) => {
    // get the name of park1 and park2, make comparision then continue iteration
    let parkName1 = getParkNameFromDescription(park1.properties.Description);
    let parkName2 = getParkNameFromDescription(park2.properties.Description);
    return parkName1.localeCompare(parkName2);

  });

  // get array with sorted result 
  return filteredParks;
}


/* Add parks to the map */
function addParksToMap(parkData, searchMapLayer, map) {
  for (let park of parkData) {

    // Extract park's "Name" from park's description
    let parkDesc = park.properties.Description
    let name = getParkNameFromDescription(parkDesc)

    // plot the marker using lat long onto the map layer with name pop up
    let plotMarker = L.marker([park.geometry.coordinates[1], park.geometry.coordinates[0]]).bindPopup(`<div><h5>${name}</h5></div>`);
    searchMapLayer.addLayer(plotMarker);

    // store reference to marker in park object
    park.marker = plotMarker;

  }
  searchMapLayer.addTo(map);
}

/* Add parks to the search result display layer on the map */
function addParksToSearchResultDisplay(parkData, searchResultLayer, map) {
  // remove from search result
  searchResultLayer.innerHTML = ""

  for (let park of parkData) {
    // Extract park's "Name" from park's description
    let parkDesc = park.properties.Description;
    let name = getParkNameFromDescription(parkDesc);

    let resultDisplay = document.createElement("div");
    resultDisplay.innerHTML = name;
    searchResultLayer.appendChild(resultDisplay)
    
    // to fly to markers when click
    resultDisplay.addEventListener("click", function () {
      map.flyTo([park.geometry.coordinates[1], park.geometry.coordinates[0]], 16);
      park.marker.openPopup();
    });

  }

  // Fly to first park in search result
  if (parkData.length > 0) {
    map.flyTo([parkData[0].geometry.coordinates[1], parkData[0].geometry.coordinates[0]], 16);
    parkData[0].marker.openPopup();
  }

}

async function addAllParks (map) {
  let response = await axios.get(nparkAPI);
  /* 
    Leaflet GeoJSON (to process the geojson file), using onEachFeature options
    ref: https://leafletjs.com/reference-1.7.1.html#geojson 
  */
  let nationalParkLayer = L.geoJSON(response.data, {
    onEachFeature: function (feature, layer) {
      let divElement = document.createElement("div");
      // setting innerHTML from the description
      divElement.innerHTML = feature.properties.Description;
      // select td from n-park's table data
      let cells = divElement.querySelectorAll("td");
      // 7th elements of td represent the park's name
      let name = cells[6].innerHTML;
      layer.bindPopup(`<div><h5>${name}</h5></div>`);
    }
  });
  nationalParkLayer.addTo(map);
}
