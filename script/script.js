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
      } else {
        searchContainer.style.display = "none";
      }
  });

  /* 
  group several layers to added or removed on the map later on using Leaflet LayerGroup
  */
  let searchMapLayer = L.layerGroup();

  document.querySelector("#search-btn").
  addEventListener("click", async function (event) {
    event.preventDefault()

    let query = document.querySelector("#search-input").value;

    /*
    -----------------------------------------------------
    */
    // calling parks function
    await filterParks(query, searchMapLayer, map);
    // clear the search input
    document.querySelector("#search-input").value = ""
    
    /*
    // ** to hide the search result - not sure if necessary**
    // if the search container is not being displayed at the moment, show it
    if (
      searchContainer.style.display == "none" ||
      !searchContainer.style.display
    ) {
      searchContainer.style.display = "block";
    } else {
      searchContainer.style.display = "none";
    }
    */

  });

});
