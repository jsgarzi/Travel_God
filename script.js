//MAP STUFF
let map;

var currentLocation;


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
        city.push(currentLocation);
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
// /////////////////


// Weather API

$(document).ready(function () {

    var APIkey = "11aae01829609ac12c0335ac0cc4505c";

    $("#travel-input").keypress(function (e) {
        if (e.which == 13) {


            var city = [];
            console.log(city);
            $("#current").empty();



            $(this).attr("city");

            var getEvents = [];


            $.ajax({
                type: "GET",
                url: "https://app.ticketmaster.com/discovery/v2/events.json?size=4&apikey=ElWPP9FatyxVq4ke0f4mPT8u3LtGG04m&city=" + city,
                async: true,
                dataType: "json",
                success: function (json) {
                    getEvents.json = json;
                    showEvents(json);
                    console.log(json);
                },
                error: function (xhr, status, err) {
                    console.log(err);
                }
            });

            function showEvents(json) {
                var events = json._embedded.events;
                for (var i = 0; i < events.length; i++) {
                    var newDiv = $("<div>");
                    var pName = $("<p>").text(json._embedded.events[i].name);
                    var pDate = $("<p>").text(json._embedded.events[i].dates.start.localDate);
                    var pLink = $("<p>").text(json._embedded.events[i].url);
                    newDiv.append(pName, pDate, pLink);

                    $("#card-content-event" + [i]).append(newDiv);
                }
            };



            var userInput = $("#travel-input").val();

            var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=" + APIkey + "&units=imperial"


            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);

                var weathResults = response;
                console.log(weathResults);

                var city = response.name;
                var lat = response.coord.lat;
                var lon = response.coord.lon;
                var temp = response.main.temp;
                var weather = response.weather[0].icon;

                console.log(lat, lon);

                var curDiv = $("<div>");
                var pCity = $("<p>").text(city);
                var pTemp = $("<p>").text("Temperature: " + temp + "F");
                var weathIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + weather + ".png");
                curDiv.append(pCity, pTemp, weathIcon)

                $("#current").append(curDiv)

                sevenDay(lat, lon)

            })
        }
    });
    function sevenDay(lat, lon) {

        var userInput = $("#travel-input").val();

        var sevDURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={current}" + "&appid=" + APIkey + "&units=imperial"

        console.log(lat, lon)


        $.ajax({
            url: sevDURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response.daily)


            var daily = response.daily

            $(".card-content").empty();

            for (var i = 0; i < daily.length; i++) {

                var dayoneDiv = $("<div>")


                var pTemp = $("<p>").text("Temperature " + response.daily[i].temp.day + "F");
                console.log(pTemp)
                var pWeath = $("<img>").attr("src", "http://openweathermap.org/img/w/" + daily[i].weather[0].icon + ".png")
                console.log(pWeath)
                dayoneDiv.append(pTemp, pWeath)
                $("#card" + [i]).append(dayoneDiv)

                console.log(daily[i].temp.day)


            }



        })


    };

    // TicketMaster API /////////////////

    var city = [];
    console.log(city);

    $("#travel-input").keypress(function (e) {
        if (e.which === 13) {

            var searchedCity = $("#travel-input").val();
            $(this).attr("city.name");




            var getEvents = [];


            $.ajax({
                type: "GET",
                url: "https://app.ticketmaster.com/discovery/v2/events.json?size=4&apikey=ElWPP9FatyxVq4ke0f4mPT8u3LtGG04m&city=" + searchedCity,
                async: true,
                dataType: "json",
                success: function (json) {
                    getEvents.json = json;
                    showEvents(json);
                    console.log(json);
                },
                error: function (xhr, status, err) {
                    console.log(err);
                }
            });

            function showEvents(json) {
                console.log(json);
                var events = json._embedded.events;
                for (var i = 0; i < events.length; i++) {
                    var newDiv = $("<div>");
                    var pName = $("<p>").text(json._embedded.events[i].name);
                    var pDate = $("<p>").text(json._embedded.events[i].dates.start.localDate);
                    var pLink = $("<p>").text(json._embedded.events[i].url);
                    newDiv.append(pName, pDate, pLink);

                    $("#card-content-event" + [i]).append(newDiv);
                }
            };


        }

    });
    /////////////// Local Storage ////////

//     var searchHist;

//     var STORAGE_KEY = ("searchBox_history");
//     var citySearch = $("#citySearch");
//     var cityInput = $("#travel-input");
//     var cityHistory = $("#Previously-searched");

//     // When page load we need to get Searched History
//     getSearchHist();

//     displaySearchHist();
//     citySearch.click(clickedSearch)

//     function clickedSearch() {
//         var city = cityInput.val();
//         cityInput.val('');
//         manageList(city);
//     }
//     //Same with prepend for HTML elements
//     // push=append    unshift=prepend 
//     searchHist.unshift(city);
//     console.log(searchHist);
//     setSearchHist();

//     function clickedHist() {
//         var city = $(this).text()
//         manageList(city);
//     }

//     function manageList(city) {
//         updateList(city);
//         setSearchHist();
//         displaySearchHist();
//     }
//     // Displaying search history
//     function displaySearchHist() {
//         cityHistory.empty();
//         if (!searchHist.length) return;

//         for (var city of searchHist) {
//             var cityEl = $("<button>,")
//                 .addClass("cityHistory")
//                 .text(city)
//                 .click(clickedHist)

//             cityHistory.append(cityEl)
//         }
//     }
//     // This will not duplicate the city if user will search for a city that is already in the searched history
//     function updateList(val) {
//         if (searchHist.includes(val)) {
//             // This will determine the position of the city in the array
//             var index = searchHist.indexOf(val);
//             // Removes the duplicate city in the array
//             searchHist.splice(index, 1);
//         }
//         // Adds the city in the first position of the array
//         searchHist.unshift(val);
//     }


//     // Local Storage functions!

//     // function to update database
//     function setSearchHist() {
//         setItem(STORAGE_KEY, searchHist)
//     }
//     function getSearchHist() {
//         searchHist = getItem(STORAGE_KEY)
//         // Giving the search history to be an array
//         if (searchHist === null) searchHist = []
//     }
//     function setItem(key, val) {
//         localStorage.setItem(key, JSON.stringify(val))
//     }
//     function getItem(key) {
//         return JSON.parse(localStorage.getItem(key))
//     }
});
