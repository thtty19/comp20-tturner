
var map;
function initMap () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 42.352271, lng: -71.05524200000001},
    zoom: 12
  });


var redLineStops = [
  {/*alewife*/ stop_id: "place-alfcl", lat: 42.395428, lng: -71.142483},
  {/*davis*/ stop_id: "place-davis", lat: 42.39674, lng: -71.121815},
  {/*porter*/ stop_id: "place-portr", lat: 42.3884, lng: -71.11914899999999},
  {/*harvard*/ stop_id: "place-harsq", lat: 42.373362, lng: -71.118956},
  {/*central*/ stop_id: "place-cntsq", lat: 42.365486, lng: -71.103802},
  {/*kendall*/ stop_id: "place-knncl", lat: 42.36249079, lng: -71.08617653},
  {/*mgh*/ stop_id: "place-chmnl", lat: 42.361166, lng: -71.070628},
  {/*park*/ stop_id: "place-pktrm", lat: 42.35639457, lng: -71.0624242},
  {/*downtown*/ stop_id: "place-dwnxg", lat: 42.355518, lng: -71.060225},
  {/*south station*/ stop_id: "place-sstat", lat: 42.352271, lng: -71.05524200000001},
  {/*broadway*/ stop_id: "place-brdwy", lat: 42.342622, lng: -71.056967},
  {/*Andrew*/ stop_id: "place-andrw", lat: 42.330154, lng: -71.057655},
  {/*JFK*/ stop_id: "place-jfk", lat: 42.320685, lng: -71.052391},
  //branches here
  {/*Savin Hill*/ stop_id: "place-shmnl" lat: 42.31129, lng: -71.053331},
  {/*Fields Corner*/ stop_id: "place-fldcr", lat: 42.300093, lng: -71.061667},
  {/*Shawmut*/ stop_id: "place-smmnl", lat: 42.29312583, lng: -71.06573796000001},
  {/*Ashmont*/ stop_id: "place-asmnl", lat: 42.284652, lng: -71.06448899999999}
  {/*N Quincy*/ stop_id: "place-nqncy", lat: 42.275275, lng: -71.029583},
  {/*Wollaston*/ stop_id: "place-wlsta", lat: 42.2665139, lng: -71.0203369},
  {/*Quincy Center*/ stop_id: "place-qnctr", lat: 42.251809, lng: -71.005409},
  {/*Quincy Adams*/ stop_id: "place-qamnl", lat: 42.233391, lng: -71.007153},
  {/*Braintree*/ stop_id: "place-brntn", lat: 42.2078543, lng: -71.0011385}
];

/*
var redLineCoords = [];

for (i=0, i<redLineData.length, i+1) {
  redLineCoords.push(redLineData[i].lat, redLineData[i].lng);
}
console.log(redLineStops);
console.log(redLineCoords);
*/

var redLine = new google.maps.Polyline ({
  path: redLineStops.lat redLineStops.lng,
  strokeColor: '#FF0000',
  strokeOpactiy: 1.0,
  strokeWidth: 3,
  map: map,
});

redLine.setMap(map);

}
