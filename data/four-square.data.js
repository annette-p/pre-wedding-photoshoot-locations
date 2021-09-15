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
  return response.data;
}

