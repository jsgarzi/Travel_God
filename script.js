//MAP STUFF
let map;

var currentLocation;
var options =


    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 40.7306, lng: -73.9352 },
            zoom: 12,
        });
        const input = document.getElementById("travel-input");
        const searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input);
        // Bias the SearchBox results towards current map's viewport.
        map.addListener("bounds_changed", () => {
            searchBox.setBounds(map.getBounds());
        });
        let markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();
            console.log(places) //where the name is captured 
            currentLocation = places[0].name; //storing the name
            console.log(currentLocation);
            if (places.length == 0) {
                return;
            }
            // Clear out the old markers.
            markers.forEach((marker) => {
                marker.setMap(null);
            });
            markers = [];
            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();
            places.forEach((place) => {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                const icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25),
                };
                // Create a marker for each place.
                markers.push(
                    new google.maps.Marker({
                        map,
                        icon,
                        title: place.name,
                        position: place.geometry.location,
                    })
                );
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.setOptions({ minZoom: 12, maxZoom: 16 }) //fixed zoom to make more sense on search of city
            map.fitBounds(bounds);
        });
    }
/////////////////




//////////////// EVENT Test
// var getEvents = [];
// $.ajax({
//   type: "GET",
//   url: "https://app.ticketmaster.com/discovery/v2/events.json?size=4&apikey=ElWPP9FatyxVq4ke0f4mPT8u3LtGG04m",
//   async: true,
//   dataType: "json",
//   success: function(json) {
//       getEvents.json = json;
//       showEvents(json);
//       console.log(json);
//       }
// });
// function showEvents(json) {
//   var items = $('#events .list-group-item'); //// might want to try grabbing just the class and use the class at each index instead of using an id 
//   var events = json._embedded.events;
//   var item = items.first(); ////may not need
//   for (var i=0; i< events.length; i++) {
//     item.children('.list-group-item-heading').text(events[i].name);
//     item.children('.list-group-item-text').text(events[i].dates.start.localDate);
//     item.children('.list-group-url').text(events[i].url);
//     try {
//       item.children('.venue').text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name + " url " + events[i]._embedded.venues[0].url);
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }

// Weather API

$(document).ready(function () {

    var APIkey = "11aae01829609ac12c0335ac0cc4505c";

    $(".search").on("click", function () {

        var userInput = $("#search-box").val();

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=" + APIkey + "&units=imperial"


        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var weathResults = response;
            console.log(weathResults);

            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var temp = response.main.temp;
            var weather = response.weather[0].icon;

            console.log(lat, lon);

            var curDiv = $("<div>");
            var pTemp = $("<p>").text("Temperature: " + temp + "F");
            // var pWeath = $("<p>").text("Weather: " + weather);
            var weathIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
            curDiv.append(pTemp, weathIcon)

            $("#current").append(curDiv)

            sevenDay(lat, lon)

        })
    });
    function sevenDay(lat, lon) {

        var userInput = $("#search-box").val();

        var sevDURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={current}" + "&appid=" + APIkey + "&units=imperial"

        console.log(lat, lon)


        $.ajax({
            url: sevDURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response.daily)


            var daily = response.daily


            for (var i = 0; i < daily.length; i++) {
                var unixTime = daily[i].dt
                var date = moment.unix(unixTime).format("MM, DD, YYYY")
                console.log(date);

            }
            // moment(daily[0].dt_txt).format('MMMM Do YYYY')
                $("#seven-days").empty();

                for (var i = 0; i < daily.length; i++) {

                    var dayoneDiv = $("<div>")
                    

                    // var date = $("<p>").text(moment(daily[0].dt_txt).format('MMMM Do YYYY'));
                    var pTemp = $("<p>").text(response.daily[i].temp.day + "F");
                    var pWeath = $("<img>").attr("src", "http://openweathermap.org/img/w/" + daily[i].weather[0].icon + ".png")
                    dayoneDiv.append(pTemp, pWeath)
                    $("#seven-days").prepend(dayoneDiv)

                    console.log(daily[i].temp.day)

                }
            


        })


    };



});