
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

//producing an array with stops from alewife to ashmont
var ashmontFullLine = redLineStops.slice(0, 17);
//producing an array with the JFK/UMass stops and the Braintree branch stops
var braintreeBranch = redLineStops.slice(17, 22);
braintreeBranch.unshift(redLineStops[12]);

//declaring and initializing the global variable of the user's position
//it begins with latitudes and longitudes of NaN to prevent it from being used
//before the user's geographic location is found
var yourPos = {lat: NaN, lng: NaN};


//Creating the display
var map;
function initMap () {
  //
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      yourPos.lat = pos.lat;
      yourPos.lng = pos.lng;
      map.panTo(yourPos);

      //finding the closest station
      closestStop = findNearest(yourPos);


      //making the info window, marker, and polyline for the user's location
      var personalWindow = new google.maps.InfoWindow({
        content: "<p>The nearest station to you is <strong>" + redLineStops[closestStop.ind].name
        + "</strong></p>"
        + "<p> It is " + closestStop.distance + " miles away</p>"
      });

      var yourMark = new google.maps.Marker({
        position: yourPos,
        draggable: false,
        map: map
      });

      yourMark.addListener('click', function() {
        personalWindow.open(map, this);
      })

      var yourLine = new google.maps.Polyline({
        path: [yourPos, redLineStops[closestStop.ind]],
        strokeColor: '#0000FF',
        strokeOpactiy: 1.0,
        strokeWidth: 3,
        map: map
      });

    });
  } else {
    alert("location services are not supported by your current browser, we are unable to find your location")
  };


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


//creating the markers and info windows for all the stations
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
    });

    var infoWindow = new google.maps.InfoWindow();

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

//function to determine the closest station to you
//requires two paramters, an object containing your latitude and longitute
//and a global array of objects containing the stations' stop ids, lats, and longs
function findNearest(yourPos) {
  var distance;
  var closestStop = {ind: -1, distance: Infinity};
  for (var i = 0; i < redLineStops.length; i++) {
    var station = (new google.maps.LatLng(redLineStops[i].lat, redLineStops[i].lng));
    var pos = new google.maps.LatLng(yourPos);

    var distance = google.maps.geometry.spherical.computeDistanceBetween(pos, station);

    //converting the distance from meters to miles
    distance = distance * 0.000621371;

    //Rounding to 2 decimal places
    distance = Math.round(distance * 100) / 100;

    //saving the distance and index of the stop if it is closer than the stop
    //that is currently saved in closestStop
    if (distance < closestStop.distance) {
      closestStop.distance = distance;
      closestStop.ind = i;

    }
  }
  return closestStop;
}

//Function to produce the content for the info windows for the station markers
//requires an array of strings containing the trains directions, an array with
//the departure times for the trains, and an array with the name of the station
function makeWindowContent(direction, departure_time, name) {
  var windowInfo = "<div id=info><h1>" + name + "</h1>"
  + "<p> Direction and departure time of the next "
  + direction.length + " trains <p>";

  if (direction.length < 10) {
    windowInfo += "<p>*There was not information for all 10 upcoming trains*<p>"
    + "<p>*All available information is displayed*</p>";
  }

  for (count = 0; count < direction.length; count++) {
    windowInfo += "<p>" + direction[count] + "    " + departure_time[count] + "</p>";
  };
  windowInfo += "</div></div>";

  return windowInfo;

};


//Function for JSON Parsing the stop information
//requires the stop id and the name of the station
function fetchTrainInfo(stopId, stopName) {
  var request = new XMLHttpRequest();

  var contentString;
  //request.open("GET", "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" + stopId, false)
  request.open("GET", "https://api-v3.mbta.com/predictions?filter[route]=Red&filter[stop]=" + stopId + "&page[limit]=10&page[offset]=0&sort=departure_time&api_key=86e986351ed9401ba54ecce14c481d36", false);

  request.onreadystatechange = function (trainInfo, direction, departure_time) {
    if (request.readyState == 4 && request.status == 200) {
      var allData = request.responseText;
      var comingTrains = JSON.parse(allData);
      var direction = [""];
      var departure_date = [];
      var departure_time = [];
      var trainInfo = comingTrains.data; //data[+0-to-9+].attributes.(departure_time, departure_time, direction_id)
      for (count = 0; count < trainInfo.length; count++) {
        if (comingTrains.data[count].attributes.direction_id == 1) {
            direction[count] = "<strong>North:</strong>";
          } else {
            direction[count] = "<strong>South:</strong>"
          };

        if (comingTrains.data[count].attributes.departure_time != null){
          departure_date[count] = comingTrains.data[count].attributes.departure_time;
          departure_time[count] = departure_date[count].slice(11,19);
      } else {
        departure_time[count] = "This information is not currently available for this train";
      }

    };
      contentString = makeWindowContent(direction, departure_time, stopName);
    }
    else if (request.readyState == 4 && request.status != 200) {
      alert("something went wrong")
    }
    else if (request.readyState == 3) {

    }
  };

  request.send();
  return contentString;
};
