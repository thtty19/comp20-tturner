var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var cors = require('cors')
var app = new express();
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUri = "mongodb://heroku_p6mrmzfr:ao7egqnjkp2bsablmoibblsb5b@ds159563.mlab.com:59563/heroku_p6mrmzfr";
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.use(express.static(path.join(__dirname, 'public')));

app.post("/submit", function(request, response){
	var gameStats = JSON.parse(request.body);

	db.collection('gameStats', function(error, coll) {
		coll.insert(gameStats, function(error, saved) {
			if (error) {
				response.send(500);
			}
			else {
				response.send([]);
			}
		});
	});
});


app.get("/", function(request, response){
	response.set('Content-Type', 'text/html');
	var user = request.body.username;
	var pageResponse = '';

	db.collection('gameStats', function(error, collection) {
		collection.find().toArray(function(error, results) {
			if (!error) {
				pageResponse += "<!DOCTYPE HTML><html><head><title>2048 Scores</title></head><body><h1>All the scores for " + user + " are: </h1>";
				for (var i = 0; i < results.length; i++) {
					pageResponse += "<p>" + results[i].gameStats + "</p>";
				}
				pageResponse += "</body></html>";
				response.send(pageResponse);
			} else {
				response.send("<!DOCTYPE HTML><html><head><title>2048 Scores</title></head><body><h1>There was an error</h1>");
			}
		});
	});
});

app.listen(process.env.PORT || 5000);
