// Leaflet map: https://leafletjs.com/reference-1.7.1.html

function mainMap() {
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
  return map;
}


const natureIcon = L.divIcon({
  html: '<i class="fab fa-canadian-maple-leaf marker-icon"></i>',
  iconSize: [20, 20],
  className: 'nature-icon'
});

const indoorIcon = L.divIcon({
  html: '<i class="fas fa-building marker-icon"></i>',
  iconSize: [20, 20],
  className: 'indoor-icon'
});

const outdoorFamousIcon = L.divIcon({
  html: '<i class="fas fa-leaf marker-icon"></i>',
  iconSize: [20, 20],
  className: 'outdoor-famous-icon'
});

const indoorFamousIcon = L.divIcon({
  html: '<i class="fas fa-torii-gate marker-icon"></i>',
  iconSize: [20, 20],
  className: 'indoor-famous-icon'
});