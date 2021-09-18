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

  // to display the Toggle search & recommendation when click on explore tab
  let exploreTab = document.querySelector("#navbarDropdown")
  let toggleTab = document.querySelector("#toggle-view-recom")
  exploreTab.addEventListener ("click", function () {
    if (
      toggleTab.style.display == "none" ||
      !toggleTab.style.display
    ) {
      toggleTab.style.display = "block";
    } else {
      toggleTab.style.display = "none";
    }
  });

  // to hide the Toggle search & recommendation when click on search tab
  let searchTab = document.querySelector("#search")
  searchTab.addEventListener ("click", function () {
    toggleTab.style.display = "none";
  });

  /* 
  group several layers to added or removed on the map later on using Leaflet LayerGroup
  */
  let searchMapLayer = L.layerGroup();

  document.querySelector("#search-btn").addEventListener("click", async function (event) {
    event.preventDefault();

    let query = document.querySelector("#search-input").value;

    // to determine which explore options has been selected
    let exploreOption = document.querySelector("input[name='explore']:checked").value;

    if (exploreOption === "outdoor") {

      /* ...................................National Park...............................................*/

      // Perform search for parks based on user query, function searchParks gives array with sorted result 
      let parkData = await searchParks(query);
      // Plot the parks on map
      addParksToMap(parkData, searchMapLayer, map);

      // Display list of parks
      let searchResultLayer = document.querySelector("#search-result-display");

      addParksToSearchResultDisplay(parkData, searchResultLayer, map);

    }

    if (exploreOption === "indoor") {

      /* ...................................Places Location...............................................*/

      let citySearchMapLayer = L.layerGroup();

      /* 
      Leaflet Method (for LatLngBounds objects):
      getBounds() returns LatLngBounds  // getCenter() returns LatLng
      */
      let center = map.getBounds().getCenter();
      let cityData = await search(center.lat, center.lng, query);

      // calling function to add city location to map & display search result 
      addCitySearchResults(cityData, citySearchMapLayer, map);
    }

    // clear the search input
    document.querySelector("#search-input").value = "";

  });

});
