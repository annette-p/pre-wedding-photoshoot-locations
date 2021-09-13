/*
this function to loading Four-Square API data
*/

const API_BASE_URL = "https://api.foursquare.com/v2/";

async function search(lat, lng, query) {
  let ll = lat + "," + lng;
  let response = await axios.get(API_BASE_URL + "/venues/search", {
    params: {
      ll: ll,
      client_id: fourSquareClientId,
      client_secret: fourSquareClientSecret,
      v: "20210903", // YYYYMMDD format
      query: query,
    },
  });
  return response.data;
}
