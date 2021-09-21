const nparkAPI = "data/n-parks.geojson";

const attractionsAPI = "data/attraction-spots.json";

const fourSquareBaseAPI = "https://api.foursquare.com/v2/";

// https://developer.foursquare.com/docs/build-with-foursquare/categories/
const fourSquareVenueCategories = [
    {
        "categoryId": "4deefb944765f83613cdba6e",
        "categoryName": "Arts & Entertainment | Historic Site"
    },
    {
        "categoryId": "5642206c498e4bfca532186c",
        "categoryName": "Arts & Entertainment | Memorial Site"
    },
    {
        "categoryId": "4bf58dd8d48988d182941735",
        "categoryName": "Arts & Entertainment | Theme Park"
    },
    {
        "categoryId": "4bf58dd8d48988d193941735",
        "categoryName": "Arts & Entertainment | Water Park"
    },
    {
        "categoryId": "4bf58dd8d48988d17b941735",
        "categoryName": "Arts & Entertainment | Zoo"
    },
    {
        "categoryId": "56aa371be4b08b9a8d573544",
        "categoryName": "Outdoors & Recreation | Bay"
    },
    {
        "categoryId": "4bf58dd8d48988d1e2941735",
        "categoryName": "Outdoors & Recreation | Beach"
    },
    {
        "categoryId": "52e81612bcbc57f1066b7a22",
        "categoryName": "Outdoors & Recreation | Botanical Garden"
    },
    {
        "categoryId": "4bf58dd8d48988d1df941735",
        "categoryName": "Outdoors & Recreation | Bridge"
    },
    {
        "categoryId": "56aa371be4b08b9a8d573562",
        "categoryName": "Outdoors & Recreation | Canal"
    },
    {
        "categoryId": "56aa371be4b08b9a8d573511",
        "categoryName": "Outdoors & Recreation | Cave"
    },
    {
        "categoryId": "52e81612bcbc57f1066b7a23",
        "categoryName": "Outdoors & Recreation | Forest"
    },
    {
        "categoryId": "56aa371be4b08b9a8d573547",
        "categoryName": "Outdoors & Recreation | Fountain"
    },
    {
        "categoryId": "4bf58dd8d48988d15a941735",
        "categoryName": "Outdoors & Recreation | Garden"
    },
    {
        "categoryId": "4bf58dd8d48988d1e0941735",
        "categoryName": "Outdoors & Recreation | Harbor / Marina"
    },
    {
        "categoryId": "5bae9231bedf3950379f89cd",
        "categoryName": "Outdoors & Recreation | Hill"
    },
    {
        "categoryId": "4bf58dd8d48988d160941735",
        "categoryName": "Outdoors & Recreation | Hot Spring"
    },
    {
        "categoryId": "50aaa4314b90af0d42d5de10",
        "categoryName": "Outdoors & Recreation | Island"
    },
    {
        "categoryId": "4bf58dd8d48988d161941735",
        "categoryName": "Outdoors & Recreation | Lake"
    },
    {
        "categoryId": "4bf58dd8d48988d15d941735",
        "categoryName": " Outdoors & Recreation | Lighthouse"
    },
    {
        "categoryId": "4eb1d4d54b900d56c88a45fc",
        "categoryName": "Outdoors & Recreation | Mountain"
    },
    {
        "categoryId": "52e81612bcbc57f1066b7a21",
        "categoryName": "Outdoors & Recreation | National Park"
    },
    {
        "categoryId": "52e81612bcbc57f1066b7a13",
        "categoryName": "Outdoors & Recreation | Nature Preserve"
    },
    {
        "categoryId": "4bf58dd8d48988d162941735",
        "categoryName": "Outdoors & Recreation | Other Great Outdoors"
    },
    {
        "categoryId": "4bf58dd8d48988d163941735",
        "categoryName": "Outdoors & Recreation | Park"
    },
    {
        "categoryId": "52e81612bcbc57f1066b7a25",
        "categoryName": "Outdoors & Recreation | Pedestrian Plaza"
    },
    {
        "categoryId": "56aa371be4b08b9a8d573541",
        "categoryName": "Outdoors & Recreation | Reservoir"
    },
    {
        "categoryId": "4eb1d4dd4b900d56c88a45fd",
        "categoryName": "Outdoors & Recreation | River"
    },
    {
        "categoryId": "4bf58dd8d48988d133951735",
        "categoryName": "Outdoors & Recreation | Roof Deck"
    },
    {
        "categoryId": "4bf58dd8d48988d165941735",
        "categoryName": "Outdoors & Recreation | Scenic Lookout"
    },
    {
        "categoryId": "4bf58dd8d48988d166941735",
        "categoryName": "Outdoors & Recreation | Sculpture Garden"
    },
    {
        "categoryId": "5bae9231bedf3950379f89d0",
        "categoryName": "Outdoors & Recreation | State / Provincial Park"
    },
    {
        "categoryId": "530e33ccbcbc57f1066bbfe4",
        "categoryName": "Outdoors & Recreation | States & Municipalities"
    },
    {
        "categoryId": "4bf58dd8d48988d159941735",
        "categoryName": "Outdoors & Recreation | Trail"
    },
    {
        "categoryId": "52e81612bcbc57f1066b7a24",
        "categoryName": "Outdoors & Recreation | Tree"
    },
    {
        "categoryId": "56aa371be4b08b9a8d573560",
        "categoryName": "Outdoors & Recreation | Waterfall"
    },
    {
        "categoryId": "56aa371be4b08b9a8d5734c3",
        "categoryName": "Outdoors & Recreation | Waterfront"
    },
    {
        "categoryId": "4fbc1be21983fc883593e321",
        "categoryName": "Outdoors & Recreation | Well"
    },
    {
        "categoryId": "5bae9231bedf3950379f89c7",
        "categoryName": "Outdoors & Recreation | Windmill"
    },
    {
        "categoryId": "4bf58dd8d48988d1fa931735",
        "categoryName": "Travel & Transport | Hotel"
    },
    {
        "categoryId": "4e74f6cabd41c4836eac4c31",
        "categoryName": "Travel & Transport | Pier"
    },
    {
        "categoryId": "56aa371be4b08b9a8d57353e",
        "categoryName": "Travel & Transport | Port"
    },
    {
        "categoryId": "52f2ab2ebcbc57f1066b8b53",
        "categoryName": "Travel & Transport | RV Park"
    }
]

/*
4deefb944765f83613cdba6e  Arts & Entertainment | Historic Site
5642206c498e4bfca532186c  Arts & Entertainment | Memorial Site 
4bf58dd8d48988d182941735  Arts & Entertainment | Theme Park
4bf58dd8d48988d193941735  Arts & Entertainment | Water Park
4bf58dd8d48988d17b941735  Arts & Entertainment | Zoo
56aa371be4b08b9a8d573544  Outdoors & Recreation | Bay
4bf58dd8d48988d1e2941735  Outdoors & Recreation | Beach
52e81612bcbc57f1066b7a22  Outdoors & Recreation | Botanical Garden
4bf58dd8d48988d1df941735  Outdoors & Recreation | Bridge
56aa371be4b08b9a8d573562  Outdoors & Recreation | Canal
56aa371be4b08b9a8d573511  Outdoors & Recreation | Cave
52e81612bcbc57f1066b7a23  Outdoors & Recreation | Forest
56aa371be4b08b9a8d573547  Outdoors & Recreation | Fountain
4bf58dd8d48988d15a941735  Outdoors & Recreation | Garden
4bf58dd8d48988d1e0941735  Outdoors & Recreation | Harbor / Marina
5bae9231bedf3950379f89cd  Outdoors & Recreation | Hill
4bf58dd8d48988d160941735  Outdoors & Recreation | Hot Spring
50aaa4314b90af0d42d5de10  Outdoors & Recreation | Island
4bf58dd8d48988d161941735  Outdoors & Recreation | Lake
4bf58dd8d48988d15d941735  Outdoors & Recreation | Lighthouse
4eb1d4d54b900d56c88a45fc  Outdoors & Recreation | Mountain
52e81612bcbc57f1066b7a21  Outdoors & Recreation | National Park
52e81612bcbc57f1066b7a13  Outdoors & Recreation | Nature Preserve
4bf58dd8d48988d162941735  Outdoors & Recreation | Other Great Outdoors
4bf58dd8d48988d163941735  Outdoors & Recreation | Park
52e81612bcbc57f1066b7a25  Outdoors & Recreation | Pedestrian Plaza
56aa371be4b08b9a8d573541  Outdoors & Recreation | Reservoir
4eb1d4dd4b900d56c88a45fd  Outdoors & Recreation | River
4bf58dd8d48988d133951735  Outdoors & Recreation | Roof Deck
4bf58dd8d48988d165941735  Outdoors & Recreation | Scenic Lookout
4bf58dd8d48988d166941735  Outdoors & Recreation | Sculpture Garden
5bae9231bedf3950379f89d0  Outdoors & Recreation | State / Provincial Park
530e33ccbcbc57f1066bbfe4  Outdoors & Recreation | States & Municipalities
4bf58dd8d48988d159941735  Outdoors & Recreation | Trail
52e81612bcbc57f1066b7a24  Outdoors & Recreation | Tree
56aa371be4b08b9a8d573560  Outdoors & Recreation | Waterfall
56aa371be4b08b9a8d5734c3  Outdoors & Recreation | Waterfront
4fbc1be21983fc883593e321  Outdoors & Recreation | Well
5bae9231bedf3950379f89c7  Outdoors & Recreation | Windmill
4bf58dd8d48988d1fa931735  Travel & Transport | Hotel
4e74f6cabd41c4836eac4c31  Travel & Transport | Pier
56aa371be4b08b9a8d57353e  Travel & Transport | Port
52f2ab2ebcbc57f1066b8b53  Travel & Transport | RV Park
*/