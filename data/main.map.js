// Leaflet map: https://leafletjs.com/reference-1.7.1.html

function mainMap() {
  let singapore = [1.34, 103.85]; // [ <lat>, <lng> ]
  // locate leaflet zoom control in a desired position
  let map = L.map("map", {zoomControl: false})
  new L.Control.Zoom({ position: 'topright' }).addTo(map);

  // set for different screensize
  // https://stackoverflow.com/questions/23910594/leaflet-responsive-design-creating-different-zoom-levels-for-different-screen
  let width = document.documentElement.clientWidth;
  let zoomLevel = 12;
  if (width < 768) {
    zoomLevel = 10.5; // phone - set the zoom level to 10
  } else if (width < 992) {
    zoomLevel = 11.5; // ipad
  }

  map.setView(singapore, zoomLevel);

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

/* ........................Location icons......................... */
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


/* ........................Weather icons......................... */
const cloudyIcon = L.divIcon({
  html: '<i class="fas fa-cloud weather-marker-icon"></i>',
  iconSize: [20, 20],
  className: 'cloudy-icon'
});

const fairDayIcon = L.divIcon({
  html: '<i class="far fa-sun weather-marker-icon"></i>',
  iconSize: [20, 20],
  className: 'fair-day-icon'
});

const partlyCloudyDayIcon = L.divIcon({
  html: '<i class="fas fa-cloud-sun weather-marker-icon"></i>',
  iconSize: [20, 20],
  className: 'partly-cloudy-day-icon'
});

const partlyCloudyNightIcon = L.divIcon({
  html: '<i class="fas fa-cloud-moon weather-marker-icon"><i>',
  iconSize: [20, 20],
  className: 'partly-cloudy-night-icon'
});

const fairNightIcon = L.divIcon({
  html: '<i class="fas fa-moon weather-marker-icon"></i>',
  iconSize: [20, 20],
  className: 'fair-night-icon'
});

const lightToModerateRainIcon = L.divIcon({
  html: '<i class="fas fa-cloud-sun-rain weather-marker-icon"></i>',
  iconSize: [20, 20],
  className: 'light-moderate-rain-icon'
});

const showersIcon = L.divIcon({
  html: '<i class="fas fa-cloud-showers-heavy weather-marker-icon"></i>',
  iconSize: [20, 20],
  className: 'showers-icon'
});

const heavyThunderyShowersIcon = L.divIcon({
  html: '<i class="fas fa-poo-storm weather-marker-icon"></i>',
  iconSize: [20, 20],
  className: 'heavy-thundery-showers-icon'
});

// tooltips marker to display date & time
const clockIcon = L.divIcon({
  html: '<i class="far fa-clock"></i>',
  iconSize: [20, 20],
  className: 'clock-icon'
});

/* ........................end of Weather icons......................... */