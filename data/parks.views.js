// to add marker and display park names

async function addParks (map) {
  /* ------------------- Natural parks (from geojson file) -------------------------- */
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
      layer.bindPopup(`${name}`);
    }
  });
  nationalParkLayer.addTo(map);
}

export { addParks };