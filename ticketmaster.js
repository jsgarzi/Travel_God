function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
       handleLocationError('No geloaction available', map.center())
    }
}

function showPosition(position) {
    var x = document.getElementById("location");
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude; 
    var latlon = position.coords.latitude + "," + position.coords.longitude;

    var getEvents = [];


    $.ajax({
      type:"GET",
      url:"https://app.ticketmaster.com/discovery/v2/events.json?size=4&apikey=ElWPP9FatyxVq4ke0f4mPT8u3LtGG04m&latlong="+latlon,
      async:true,
      dataType: "json",
      success: function(json) {
                  getEvents.json = json;
                  showEvents(json);
                  console.log(json);
               },
      error: function(xhr, status, err) {
                  console.log(err);
               }
    });

    function showEvents(json) {
        var items = $('#events .card');
        var events = json._embedded.events;
        var item = items.first();
        for (var i = 0; i < events.length; i++) {
            item.children('.card').text(events[i].name);
            item.children('.card-content').text(events[i].dates.start.localDate);
            item.children('.card-action').text(events[i].url);
            try {
                item.children('.venue').text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name + " url " + events[i]._embedded.venues[0].url);
            } catch (err) {
                console.log(err);
            }
        }
    }
    }
      
      getLocation();



