$(function() {
  $(window).unload( function () { GUnload(); } );
  var melbourne = new google.maps.LatLng(-37.8013754,144.9612405);
  var mapOptions = {
    zoom: 17,
    center: melbourne,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  var markers = [];
  var mbsmarker = new google.maps.Marker({
    position: melbourne,
    map: map,
    title: 'You are here!'
  });

  $.getJSON('/static/places.json', function(places) {
    var currentPlace = null;
    var infoWindow = new google.maps.InfoWindow();

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

        /*if (currentPlace) {
          info.animate(
            {left: "0px"},
            {complete: function() {
              if (clickedPlace == currentPlace) {
                currentPlace = null;
              } else {
                currentPlace = clickedPlace;
                if (currentPlace.url) {
                  $('.shoptitle', info).empty().html($("<a></a>").attr('href', clickedPlace.url).text(clickedPlace.name));
                } else {
                  $('.shoptitle', info).html(clickedPlace.name);
                }
                $('.shopdescription',  info).html(clickedPlace.description);
                $('.address',  info).text(clickedPlace.address);
                $('.phone',  info).text(clickedPlace.phoneNumber);
                //info.animate({right: "0"});
                //set info window content
                var contentString = '<div>'+
                                    '<h1>'+clickedPlace.name+'</h1>'+
                                    '<h2>'+clickedPlace.description+'</h2>'+
                                    '<h2>'+clickedPlace.address+'</h2>'+
                                    '<h1>'+clickedPlace.phoneNumber+'</h1>'+
                                    '</div>';

                openInfoWindow(marker, info)
                function openInfoWindow(marker, info) {
                 infoWindow.setContent(contentString);
                 infoWindow.open(map, marker); // open the infoWindow above the marker. the maps API will bind the close button click for you.
              }
              // info window load finish
              }
            }}
          )
        } */

      //else {
          currentPlace = clickedPlace;
                if (currentPlace.url) {
                  $('.shoptitle', info).empty().html($("<a></a>").attr('href', clickedPlace.url).text(clickedPlace.name));
                } else {
                  $('.shoptitle', info).html(clickedPlace.name);
                }
          $('.shopdescription',  info).text(clickedPlace.description);
          $('.address',  info).text(clickedPlace.address);
          $('.phone',  info).text(clickedPlace.phoneNumber);
          //info.animate({left: "0"});
          //set info window content
          var contentString = '<section id="availability">'+
                              '<div class="map">'+
                              '<h1>'+clickedPlace.name+'</h1>'+
                              '<h2>'+clickedPlace.description+'</h2>'+
                              '<h2>'+clickedPlace.address+'</h2>'+
                              '<h2>'+clickedPlace.phoneNumber+'</h2>'+
                              '</div>'
                              '</section>';
          openInfoWindow(marker, info)
          function openInfoWindow(marker, info) {
           infoWindow.setContent(contentString);
           infoWindow.open(map, marker); // open the infoWindow above the marker. the maps API will bind the close button click for you.
        }
        // info window load finish

        //}
      });
    });
    var markerCluster = new MarkerClusterer(map, markers, {gridSize: 25});
  });
});
