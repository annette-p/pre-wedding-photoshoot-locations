// function to add marker and display park names

async function filterParks (query, searchMapLayer, map) {
  let response = await axios.get("data/n-parks.geojson");

  // 1. to display the search result (add the result to search-result-display class)
  let searchDisplay = document.querySelector("#search-result-display")
  // remove from search result
  searchDisplay.innerHTML = ""

  for (let park of response.data.features) {

    let parkDesc = park.properties.Description
    if (parkDesc.toLowerCase().indexOf(query.toLowerCase()) > 0) {
        // found a match based on query of user

        // to get park name
        let divElement = document.createElement("div");
        // setting innerHTML from the description
        divElement.innerHTML = parkDesc;
        // select td from n-park's table data
        let cells = divElement.querySelectorAll("td");
        // 7th elements of td represent the park's name
        let name = cells[6].innerHTML;

        // plot the marker using lat long onto the map layer with name pop up
        let plotMarker = L.marker([park.geometry.coordinates[1], park.geometry.coordinates[0]]).bindPopup(`<div><h5>${name}</h5></div>`);
        searchMapLayer.addLayer(plotMarker); 

        // *****************************************
        // is it better to put this block into script.js than the function??
        // 1.1 to add the result into list 
        let resultDisplay = document.createElement("div");
        resultDisplay.innerHTML = name;
        searchDisplay.appendChild(resultDisplay)
        
        // to fly to markers when click
        resultDisplay.addEventListener("click", function () {
          map.flyTo([park.geometry.coordinates[1], park.geometry.coordinates[0]], 16);
          marker.openPopup();
        });

    }
  }
  searchMapLayer.addTo(map);
  
}

async function addAllParks (map) {
  let response = await axios.get("data/n-parks.geojson");
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

export { filterParks };
// export { addAllParks };   -- to add **