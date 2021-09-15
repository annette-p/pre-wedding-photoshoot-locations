/*
this function to loading Four-Square API data
*/

async function search(lat, lng, query) {
  let ll = lat + "," + lng;
  let response = await axios.get(fourSquareBaseAPI + "/venues/search", {
    params: {
      ll: ll,
      client_id: fourSquareClientId,
      client_secret: fourSquareClientSecret,
      v: "20210903", // YYYYMMDD format
      query: query,
    },
  });

  // sorting data base on location name
  response.data.response.venues.sort( (location1, location2) => {
    let locationName1 = location1.name.toLowerCase();
    let locationName2 = location2.name.toLowerCase();

    return locationName1.localeCompare(locationName2);
  });

  return response.data.response.venues;
}

