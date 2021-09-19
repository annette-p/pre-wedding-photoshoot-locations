/*
create class as template to get common info(attribute) from them to present in the more consistance way
This custom "Location" class to present each location data from different or multiple data sources (have different data structure)
*/
class Location {
  constructor(name, latitude, longitude, image=undefined) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    // combine latlong 
    this.coordinates = [this.latitude, this.longitude];
    this.image = image;
    this.marker = undefined;
  }
}

// Sort an array of Location objects by 'name'
function sortLocationsByName(locationData) {
  return locationData.sort( (location1, location2) => {
    let locationName1 = location1.name.toLowerCase();
    let locationName2 = location2.name.toLowerCase();

    return locationName1.localeCompare(locationName2);
  });
}

/* ...................................Four Square Places Location...............................................*/
// Search Four Square
async function searchLocations(lat, lng, query) {
  // get current date 
  let currentDate = new Date().toJSON().slice(0,10).replace(/-/g,'');

  // boilerplate for Four Square
  let ll = lat + "," + lng;
  let response = await axios.get(fourSquareBaseAPI + "/venues/search", {
    params: {
      ll: ll,
      client_id: fourSquareClientId,
      client_secret: fourSquareClientSecret,
      v: currentDate, // YYYYMMDD format
      query: query,
    },
  });

  let filteredLocations = [];
  for (let venue of response.data.response.venues) {
    // short hand - new object (using Location class)
    filteredLocations.push(new Location(venue.name, venue.location.lat, venue.location.lng));
    /*
    long hand - new object (using Location class): 
    let venueLocation = new Location(
      venue.name,
      venue.location.lat,
      venue.location.lng
    );
    filteredLocations.push(venueLocation);
    */
  }
  // sort the array 
  return sortLocationsByName(filteredLocations);
}

/* ...................................National Park...............................................*/

/* Extract park's "Name" from park's description */
function getParkNameFromDescription(parkDescription) {
  let divElement = document.createElement("div");
  // setting innerHTML from the description
  divElement.innerHTML = parkDescription;
  // select td from n-park's table data
  let cells = divElement.querySelectorAll("td");
  // 7th elements of td represent the park's name
  let name = cells[6].innerHTML;

  return name;
}

/* Search for the parks details based on user's query */
async function searchNParks(query) {
  let response = await axios.get(nparkAPI);

  // Store the parks that match user's query
  let filteredParks = [];
  for (let park of response.data.features) {
    let parkDesc = park.properties.Description
    if (parkDesc.toLowerCase().indexOf(query.toLowerCase()) > 0) {
      let parkName = getParkNameFromDescription(parkDesc)
      let latitude = park.geometry.coordinates[1]
      let longitude = park.geometry.coordinates[0]
      // create new Location object (using the class)
      filteredParks.push(new Location(parkName, latitude, longitude));
      /*
      short hand: 
      filteredParks.push(new Location(getParkNameFromDescription(parkDesc), park.geometry.coordinates[1], park.geometry.coordinates[0]));
      */
    }
  }
  // sort the array 
  return sortLocationsByName(filteredParks);
}

/* ...................................Attraction/Famous Spots .........................................*/

/* Retrieve location data of attraction spots based on location type (indoor or outdoor) */
async function searchAttractions(locationType) {
  let response = await axios.get(attractionsAPI);

  // Store the parks that match user's query
  let filteredAttractions = [];
  for (let attraction of response.data) {
    if (attraction.type === locationType) {
      // create new Location object (using the class)
      filteredAttractions.push(
        new Location(attraction.name, attraction.latitude, attraction.longitude, attraction.image)
      );
    }
  }
  // sort the array 
  return sortLocationsByName(filteredAttractions);
}

/* ..............................................................................................*/
