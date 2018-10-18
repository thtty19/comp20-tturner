
//hardcoding in the stop ids, latitudes, and longitudes for all the stops
var redLineStops = [
  {name: "Alewife", stop_id: "place-alfcl", lat: 42.395428, lng: -71.142483},
  {name: "Davis Square", stop_id: "place-davis", lat: 42.39674, lng: -71.121815},
  {name: "Porter Square", stop_id: "place-portr", lat: 42.3884, lng: -71.11914899999999},
  {name: "Harvard Square", stop_id: "place-harsq", lat: 42.373362, lng: -71.118956},
  {name: "Central Square", stop_id: "place-cntsq", lat: 42.365486, lng: -71.103802},
  {name: "Kendall/MIT", stop_id: "place-knncl", lat: 42.36249079, lng: -71.08617653},
  {name: "Charles/MGH", stop_id: "place-chmnl", lat: 42.361166, lng: -71.070628},
  {name: "Park Street", stop_id: "place-pktrm", lat: 42.35639457, lng: -71.0624242},
  {name: "Downtown Crossing", stop_id: "place-dwnxg", lat: 42.355518, lng: -71.060225},
  {name: "South Station", stop_id: "place-sstat", lat: 42.352271, lng: -71.05524200000001},
  {name: "Broadway", stop_id: "place-brdwy", lat: 42.342622, lng: -71.056967},
  {name: "Andrew", stop_id: "place-andrw", lat: 42.330154, lng: -71.057655},
  {name: "JFK/UMass", stop_id: "place-jfk", lat: 42.320685, lng: -71.052391},
  //branches here
  {name: "Saving Hill", stop_id: "place-shmnl", lat: 42.31129, lng: -71.053331},
  {name: "Field Circle", stop_id: "place-fldcr", lat: 42.300093, lng: -71.061667},
  {name: "Shawmut", stop_id: "place-smmnl", lat: 42.29312583, lng: -71.06573796000001},
  {name: "Ashmont", stop_id: "place-asmnl", lat: 42.284652, lng: -71.06448899999999},
  //start of braintree branch
  {name: "North Quincy", stop_id: "place-nqncy", lat: 42.275275, lng: -71.029583},
  {name: "Wollaston", stop_id: "place-wlsta", lat: 42.2665139, lng: -71.0203369},
  {name: "Quincy Center", stop_id: "place-qnctr", lat: 42.251809, lng: -71.005409},
  {name: "Quincy Adams", stop_id: "place-qamnl", lat: 42.233391, lng: -71.007153},
  {name: "Braintree", stop_id: "place-brntn", lat: 42.2078543, lng: -71.0011385}
];

var testCoords = {latitude: 42.2078543, longitude: -71.0011385}

//producing an array with stops from alewife to ashmont
var ashmontFullLine = redLineStops.slice(0, 17);
//producing an array with the JFK/UMass stops and the Braintree branch stops
var braintreeBranch = redLineStops.slice(17, 22);
braintreeBranch.unshift(redLineStops[12]);

//geolocation section. Unable to test the geolocation on a local server I think
//Need to check with office hours or Ming

function saveLocation(pos){
  var coords = pos.coords;
  console.log(coords);
  console.log("v good");
}

function locationError(){}


if (navigator.geolocation){
  console.log("good");
  //var location = navigator.geolocation.getCurrentPosition(saveLocation, locationError);
} else {
  console.log("this aint working");
}



//Creating the display
var map;
function initMap () {
  //making the map the background, initially centered at South Station
  map = new google.maps.Map(document.getElementById("map"), {
    center: redLineStops[9], //initially centered on south station
    zoom: 12
  });

//creating a polyline connecting the stops from alewife to ashmont
var redLineMajor = new google.maps.Polyline ({
  path: ashmontFullLine,
  strokeColor: '#FF0000',
  strokeOpactiy: 1.0,
  strokeWidth: 3,
  map: map,
});

//creating a polyline for the braintree branch stops
var redLineMinor = new google.maps.Polyline ({
  path: braintreeBranch,
  strokeColor: '#FF0000',
  strokeOpactiy: 1.0,
  strokeWidth: 2,
  map: map,
});

var infoWindow = new google.maps.InfoWindow({
  content: "working"
});

//placing the station markers on the map
var stationMarker = [];

for (i=0; i<redLineStops.length; i++) {
  stationMarker[i] = new google.maps.Marker({
    position: redLineStops[i],
    icon: {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      scale: 4
    },
    draggable: false,
    map: map
  })

  stationMarker[i].addListener('click', function () {
    infoWindow.open(map, this)
  });
};

findNearest(testCoords, redLineStops);

}


function toRadians(x) {
  return x * Math.PI / 180;
}




//function to determine the closest station to you
//requires two paramters, an object containing your latitude and longitute
//and an aray of objects containing the stations' stop ids, lats, and longs

function findNearest(yourLoc, stations) {
  var distance;
  var closestStop = {stop_id: "", distance: Infinity};
  var currentStation = new google.maps.LatLng(0, 0);
/*
  var radius = 6317;
  var a;
  var lat1 = yourLoc.lat;
  var lng1 = yourLoc.lng;
  var latRad1 = toRadians(yourLoc.lat);
  var latRad;
  var lat2;
  var lng2;
  var dLat;
  var dLng;
*/
  for (i = 0; i < stations.length; i++) {
    /*
    lat2 = stations[i].lat;
    lng2 = stations[i].lng;

    latRad2 = toRadians(lat2);

    dLat = toRadians(lat1-lat2);
    dLng = toRadians(lng1-lng2);

    a = (Math.sin(dLat/2) * Math.sin(dLat/2)) + (Math.cos(latRad1) * Math.cos(latRad2))
      + (Math.sin(dLng/2) * Math.sin(dLng/2));

    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    distance = (radius * c) / 1.60934;
*/
  currentStation = (new google.maps.LatLng(stations[i].lat, stations[i].lng));

  var distance = new google.maps.geometry.spherical.computeDistanceBetween(yourLoc, stations[i]);
console.log(distance)
    if (distance < closestStop.distance) {
      closestStop.distance = distance;
      closestStop.stop_id = stations[i].stop_id;
    }
  }

console.log(closestStop);
}
