import { mainMap } from "../data/main.map.js";
import { filterParks } from "../data/parks.views.js"

window.addEventListener("DOMContentLoaded", async function () {
  // calling leaflet map function
  let map = mainMap()

  /* 
  group several layers to added or removed on the map later on using Leaflet LayerGroup
  */
  let searchMapLayer = L.layerGroup();
  document.querySelector("#search-btn").addEventListener("click", async function (event) {
    event.preventDefault()

    let query = document.querySelector("#search-input").value;

    // calling parks function
    await filterParks(query, searchMapLayer, map);
    // clear the search input
    document.querySelector("#search-input").value = ""
  });

});
