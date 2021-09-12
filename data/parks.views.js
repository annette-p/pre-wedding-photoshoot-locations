// to add marker and display park names

async function filterParks (query, searchMapLayer, map) {
  let response = await axios.get("data/n-parks.geojson");

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

        // plot the marker onto map layer with name pop up
        let marker = L.marker([park.geometry.coordinates[1], park.geometry.coordinates[0]]).bindPopup(`<div><h5>${name}</h5></div>`);
        searchMapLayer.addLayer(marker); 

        /*
        Leaflet Method (for LatLngBounds objects):
        getBounds() returns LatLngBounds  // getCenter() returns LatLng
        */
        // ****TO DO - when click on search result > bring to marker 
        let center = map.getBounds().getCenter();
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