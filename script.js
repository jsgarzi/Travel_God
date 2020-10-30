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
            latlngStore.push(bounds);
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

var latlngStore = [];
console.log(latlngStore)

const search = document.querySelector("#travel-input");
search.addEventListener("click", () => {
	console.log("clicked search");
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        
    }
}

function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;

    var getEvents = [];


    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?size=4&apikey=ElWPP9FatyxVq4ke0f4mPT8u3LtGG04m&latlong=" + latlon,
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

    // function showEvents(json) {
    //     var items = $('#events .card');
    //     var events = json._embedded.events;
    //     var item = items.first();
    //     for (var i = 0; i < events.length; i++) {
    //         $(".card-event").append("<div>"+json._embedded.events[i].name+"</div>");
    //         $(".card-content-event").append("<div>"+json._embedded.events[i].dates.start.localDate+"</div>");
    //         $(".card-action-event").append("<div>"+json._embedded.events[i].url+"</div>");
    //     }
        
    // }

    function showEvents(json) {
        var items = $('#events .card');
        var events = json._embedded.events;
        var item = items.first();
        for (var i = 0; i < events.length; i++) {
            var newDiv = $("<div>")
            var pName = $("<p>").text(json._embedded.events[i].name);
            var pDate = $("<p>").text(json._embedded.events[i].dates.start.localDate);
            var pLink = $("<p>").text(json._embedded.events[i].url);
            newDiv.append(pName, pDate, pLink);

            $("#card-content-event" + [i]).append(newDiv)
        }
    };

}

getLocation();

////
