
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
  {name: "Savin Hill", stop_id: "place-shmnl", lat: 42.31129, lng: -71.053331},
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

var testCoords = {latitude: 42.3113, longitude: -71.05332}

var testLine = [
  {latitude: 42.3113, longitude: -71.05332},
  {latitude: 42.39674, longitude: -71.121815}
];

//producing an array with stops from alewife to ashmont
var ashmontFullLine = redLineStops.slice(0, 17);
//producing an array with the JFK/UMass stops and the Braintree branch stops
var braintreeBranch = redLineStops.slice(17, 22);
braintreeBranch.unshift(redLineStops[12]);

var yourPos = {lat: NaN, lng: NaN};


//Creating the display
var map;
function initMap () {
  //Calling the function to find the nearest T station
  //var location = findNearest(testCoords, redLineStops);

  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      yourPos.lat = pos.lat;
      yourPos.lng = pos.lng;
    });
  };


  //Calling the function to find the nearest T station
  //var location = findNearest(yourPos, redLineStops);

  //making the map the background, initially centered at South Station
  map = new google.maps.Map(document.getElementById("map"), {
    center: redLineStops[9], //initially centered on south station
    zoom: 12
  });
  /*if (yourPos.lat != NaN && yourPos.lng != NaN) {
    map.setCenter(yourPos);
  };*/


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

  /*var personalLine = new google.maps.Polyline ({
    path: testLine,
    strokeColor: '#0000FF',
    strokeOpactiy: 1.0,
    strokeWidth: 3,
    map:map,
  })*/


//creating and placing the station markers on the map
  var stationMarker = [];
  var stopId = [];
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

    var infoWindow = new google.maps.InfoWindow({
    });

    stopId[i] = redLineStops[i].stop_id

    stationMarker[i].addListener('click', function() {
      infoWindow.open(map, this)
    });

    stationMarker[i].addListener('click', function(stopId) {
      var index = stationMarker.indexOf(this);
      infoWindow.setContent(fetchTrainInfo(redLineStops[index].stop_id, redLineStops[index].name));
    });
  };


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

  for (i = 0; i < stations.length; i++) {

    station = (new google.maps.LatLng(stations[i].lat, stations[i].lng));

    var distance = new google.maps.geometry.spherical.computeDistanceBetween(yourLoc, station);

    if (distance < closestStop.distance) {
      closestStop.distance = distance;
      closestStop.stop_id = stations[i].stop_id;
    }
  }
}




function makeWindowContent(direction, arrival_time, name) {
  var windowInfo = "<div id=info><h1>" + name + "</h1>"
  + " <div class=direction>"
  + "<p> Direction and time of the next 10 trains <p>";
  for (count = 0; count < direction.length; count++) {
    windowInfo += "<p>" + direction[count] + "    " + arrival_time[count] + "</p>";
  };
  windowInfo += "</div></div>";
  return windowInfo;

};


//JSON Parsing for the stop information
function fetchTrainInfo(stopId, stopName) {
  var request = new XMLHttpRequest();

  var contentString;
  //request.open("GET", "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" + stopId, false)
  request.open("GET", "https://api-v3.mbta.com/predictions?filter[route]=Red&filter[stop]=" + stopId + "&page[limit]=10&page[offset]=0&sort=departure_time&api_key=86e986351ed9401ba54ecce14c481d36", false);

  request.onreadystatechange = function (trainInfo, direction, arrival_time) {
    if (request.readyState == 4 && request.status == 200) {
      var allData = request.responseText;
      var comingTrains = JSON.parse(allData);
      var direction = [""];
      var arrival_date = [];
      var arrival_time = [];
      var trainInfo = comingTrains.data; //data[+0-to-9+].attributes.(arrival_time, departure_time, direction_id)
      for (count = 0; count < trainInfo.length; count++) {
        if (comingTrains.data[count].attributes.direction_id == 1) {
          direction[count] = "North";
        } else {
          direction[count] = "South"
        };

        arrival_date[count] = comingTrains.data[count].attributes.arrival_time;
        arrival_time[count] = arrival_date[count].slice(11,19);
      }

      contentString = makeWindowContent(direction, arrival_time, stopName);
    }
    else if (request.readyState == 4 && request.status != 200) {
      alert("something went wrong")
    }
    else if (request.readyState == 3) {

    }

  /*  for (count = 0; count < trainInfo.length; count++) {
      if (comingTrains.data[count].attributes.direction_id == 1) {
        direction[count] = "North (to Alewife)";
      } else {
        direction[count] = "South (to Ashmont/Braintree)"
      };

      arrival_time[count] = comingTrains.data[count].attributes.arrival_time;
    }*/


     //makeWindowContent(direction, arrival_time);

  };

  request.send();
  return contentString;
};
