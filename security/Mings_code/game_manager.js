username = prompt("Enter your name");
request = new XMLHttpRequest();
request.open("POST", "https://gameserver2048.herokuapp.com/submit", true);
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
request.onreadystatechange = function() {
  // Okay, I got top 10 scores back from server, now print in a fancybox
  if (request.status == 200 && request.readyState == 4) {
    scores = JSON.parse(request.responseText);
    var results = "<h1>High Scores</h1><table><tr><th>Name</th><th>Score</th><th>Date</th>";
    for (i = 0 ; i < scores.length; i++) {
      results += "<tr><td>" + scores[i].username + "</td><td>" + scores[i].score + "</td><td>" + new Date(scores[i].created_at).toString() + "</td></tr>";
    }
    results += "</table>";
    $.fancybox.open(results);
  }
};
// E.g., `username=mchow&score=10&grid={}` => x-www-form-urlencoded format
request.send("username=" + username + "&score=" + this.score + "&grid=" + JSON.stringify(this.grid));
