import { mainMap } from "../data/main.map.js";
import { addParks } from "../data/parks.views.js"

window.addEventListener("DOMContentLoaded", async function () {
  // calling leaflet map function
  let map = mainMap()
  // calling parks function
  await addParks(map)

});
