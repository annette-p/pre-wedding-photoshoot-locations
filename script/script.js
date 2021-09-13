window.addEventListener("DOMContentLoaded", async function () {
  // calling leaflet map function
  let map = mainMap()
  
  let hide = document.querySelector("#hide")
  let searchContainer = document.querySelector("#body-box")

    // to hide the card box body
    hide.addEventListener ("click", function () {
      if (
        searchContainer.style.display == "none" ||
        !searchContainer.style.display
      ) {
        searchContainer.style.display = "block";
        hide.innerHTML = "hide";
      } else {
        searchContainer.style.display = "none";
        hide.innerHTML = "show";
      }
  });

  /* 
  group several layers to added or removed on the map later on using Leaflet LayerGroup
  */
  let searchMapLayer = L.layerGroup();

  document.querySelector("#search-btn").
  addEventListener("click", async function (event) {
    event.preventDefault();

    let query = document.querySelector("#search-input").value;

    // Perform search for parks based on user query, function searchParks gives array with sorted result 
    let parkData = await searchParks(query);

    // Plot the parks on map
    addParksToMap(parkData, searchMapLayer, map);

    // Display list of parks
    let searchResultLayer = document.querySelector("#search-result-display");

    addParksToSearchResultDisplay(parkData, searchResultLayer, map);

    // clear the search input
    document.querySelector("#search-input").value = "";

  });

});
