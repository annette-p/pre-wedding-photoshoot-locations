import { leafletAccessToken } from "./secrets.js";


window.addEventListener("DOMContentLoaded", async function () {
  // Leaflet map
  let singapore = [1.29, 103.85]; // [ <lat>, <lng> ]
  let map = L.map("map");
  map.setView(singapore, 13);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: leafletAccessToken, //demo access token
    }
  ).addTo(map);
  // end of Leaflet map

  let response = await axios.get("data/n-parks.geojson");
  // console.log(response.data)
  // Leaflet map object to process the geojson file (L.geoJSON is build in function of Leaflet map)
  let nationalParkLayer = L.geoJSON(response.data, {
    onEachFeature: function (feature, layer) {
      // console.log(feature.properties.Description);
      // ** Need the name attribute in the description -- dunno how to do
      let divElement = document.createElement("div");
      // setting innerHTML from the description
      divElement.innerHTML = feature.properties.Description;
      // **need to select td that under th name -- dunno how to do**
      let cells = divElement.querySelectorAll("td");
      // console.log(cells);
      let name = cells[6].innerHTML;
      layer.bindPopup(`${name}`);
    }
  });
  nationalParkLayer.addTo(map);
});