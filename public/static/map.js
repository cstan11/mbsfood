$(function() {
  $(window).unload( function () { GUnload(); } );
  // new direction service
  var directionDisplay;
  var directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({
               suppressMarkers: true,
               preserveViewport:true
           });
  directionsDisplay.setMap(map);
  // end direction service

  var mbspoint = new google.maps.LatLng(-37.8013754,144.9612405);
  var mapOptions = {
    zoom: 17,
    center: mbspoint,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  var markers = [];
  var mbsmarker = new google.maps.Marker({
    position: mbspoint,
    map: map,
    title: 'You are here!'
  });

// start of loading place points.
  $.getJSON('/static/places.json', function(places) {
    var currentPlace = null;
    var infoWindow = new google.maps.InfoWindow({maxWidth: 200});

    $(places).each(function() {
      var place = this;
      var point = new google.maps.LatLng(place.location.lat, place.location.lng);
      var icons = {
        'Bar':        "/static/bar.png",
        'Restaurant': "https://google-maps-icons.googlecode.com/files/restaurant.png",
        'Shopping':   "https://google-maps-icons.googlecode.com/files/supermarket.png",
        'Gift':       "https://google-maps-icons.googlecode.com/files/gifts.png",
        'Fast Food':  "https://google-maps-icons.googlecode.com/files/fastfood.png",
      }
      var marker = new google.maps.Marker({
        position: point,
        map:      map,
        title:    place.name,
        icon:     icons[place.type]
      });
      markers.push(marker);
      google.maps.event.addListener(marker, 'click', function() {
        var clickedPlace = place;
        var info = $('#placeDetails');
        currentPlace = clickedPlace;
        calcRoute(this.getPosition());

          //set info window content
          var contentString =
                              '<h1>'+clickedPlace.name+'</h1>'+
                              '<p>'+clickedPlace.description+'</p>'+
                              '<h2>'+clickedPlace.address+'</h2>'+
                              '<h2>'+clickedPlace.phoneNumber+'</h2>'+
                              '<p>'+'<a target="_blank" href="'+clickedPlace.url+'">'+clickedPlace.url+'</a>'+'</p>'

          openInfoWindow(marker, info)
          function openInfoWindow(marker, info) {
           infoWindow.setContent(contentString);
           infoWindow.open(map, marker); // open the infoWindow above the marker. the maps API will bind the close button click for you.
        }

          function calcRoute(drive_end) {
                    var start = new google.maps.LatLng(-37.8013754,144.9612405);
                    var end = new google.maps.LatLng(place.location.lat, place.location.lng);
                    var request = {
                        origin:start,
                        destination:end,
                        travelMode: google.maps.DirectionsTravelMode.DRIVING,
                        unitSystem: google.maps.DirectionsUnitSystem.IMPERIAL
                    };
                    directionsService.route(request, function(response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                            distance = response.routes[0].legs[0].distance.text;
                            duration = response.routes[0].legs[0].duration.text;
                          //  document.getElementById("distance_road").innerHTML = distance;
                          //  document.getElementById("duration").innerHTML = duration;

                        }
                    });
                }

        // info window load finish
      });
    });
    var markerCluster = new MarkerClusterer(map, markers, {gridSize: 25});
  });
  // end of loading place points

});
