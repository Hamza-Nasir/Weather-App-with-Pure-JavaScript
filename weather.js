const apiKey = secrets.API_KEY;

const searchbar = document.getElementById("search-bar");
var typingTimer;
var doneTypingInterval = 3000;

document.getElementById("search-button").addEventListener("click", function() {
  changeLocation();

  weatherBalloon(0, 0, 10, searchbar.value);

  searchbar.value = "";
  searchbar.placeholder = "Search";
})

searchbar.addEventListener("keyup", e => {
  const searchString = e.target.value

  clearTimeout(typingTimer);
  if (searchbar.value) {
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  }
})

function doneTyping() {
  let link = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${searchbar.value}`;

  

  fetch(link)
  .then(function(resp) { return resp.json() } )
  .then(function(data) {

    var fiveSuggestions = [];

    for (let i = 0; i < 5; i++) {
      fiveSuggestions.push(data[i].name);
    }

    console.log(fiveSuggestions)

    suggestionDropDown(fiveSuggestions);
  })

}

function suggestionDropDown(suggestions) {

  let suggestionList = document.getElementById("autocomplete-list");

  if (document.getElementById("option-0")) {
    console.log("Deleting previous suggestions");

    for (let i = 0; i < 5; i++) {

      let elementId = `option-${i}`

      let prevSugg = document.getElementById(elementId);

      console.log("removing ", prevSugg.value);
      document.getElementById("autocomplete-list").removeChild(prevSugg);
    }
  }

  for (let i = 0; i < 5; i++) {

    let currentSugg = suggestions[i];;

    let optionNode = document.createElement("option");

    optionNode.value = currentSugg;
    optionNode.id = `option-${i}`;
    optionNode.text = currentSugg;

    suggestionList.appendChild(optionNode);
  }

  document.getElementById("search-bar").placeholder = document.getElementById("search-bar").value;
  document.getElementById("search-bar").value = "";
  // var openDropDown = 
}

// Delete previous HTML Elements
function changeLocation() {
  var element = document.getElementById("current-location");

  element.remove();

  element = document.getElementById("temp-table");

 

  if (typeof element != 'undefined') {
    element.parentNode.removeChild(element);
  }

}

function insertTableRow(minTemp, maxTemp, date) {
 

  // var table = document.getElementsByTagName("table");
  let table = document.getElementsByTagName("tbody")[0];


  let row = document.createElement("tr");
  let d0 = document.createElement("td");
  let d1 = document.createElement("td");
  let d2 = document.createElement("td");

  d0.innerHTML = date;
  d1.innerHTML = minTemp + " C";
  d2.innerHTML = maxTemp + " C" ;

  row.appendChild(d0);
  row.appendChild(d1);
  row.appendChild(d2);

  table.appendChild(row);
}

function createTable() {
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  table.appendChild(thead);
  table.appendChild(tbody);

  document.getElementById("table-tag").appendChild(table);

  let heading0 = document.createElement("th");
  let heading1 = document.createElement("th");
  let heading2 = document.createElement("th");
  let row1 = document.createElement("tr");

  heading0.innerHTML = "Date";
  heading1.innerHTML = "Min. Temp.";
  heading2.innerHTML = "Max. Temp.";

  row1.appendChild(heading0);
  row1.appendChild(heading1);
  row1.appendChild(heading2);
  thead.appendChild(row1);

  table.id = "temp-table";

 
}

function weatherBalloon(lat, lon, days, location="") {

 

  var link;

  if (location === "") {
    link = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7`;
  }

  else {
    link = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7`
  }


  fetch(link)
    .then(function (resp) { return resp.json() }) // Convert data to json
    .then(function (data) {
     
      let weather = data.forecast.forecastday;

      var h1 = document.createElement("h1");
      h1.id = "current-location";
      h1.appendChild(document.createTextNode(data.location.name));
      document.getElementById("user-location").appendChild(h1);
      

      createTable();

      for (let i in weather) {
  
        insertTableRow(weather[i].day.mintemp_c, weather[i].day.maxtemp_c, weather[i].date)
      }
    })
    .catch(function () {
      // catch any errors
    });
}

function showPosition(position) {

  weatherBalloon(position.coords.latitude, position.coords.longitude, 10);
}

window.onload = function () {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition)

  }

  // weatherBalloon( 6167865 );
}
