$(function() {
  $(window).unload( function () { GUnload(); } );
  var melbourne = new google.maps.LatLng(-37.8014817, 144.9617555);
  var mapOptions = {
    zoom: 17,
    center: melbourne,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  var markers = [];

  $.getJSON('/static/places.json', function(places) {
    var currentPlace = null;

    $(places).each(function() {
      var place = this;
      var point = new google.maps.LatLng(place.location.lat, place.location.lng);
      var icons = {
        'Bar':        "/static/bar.png",
        'Restaurant': "https://google-maps-icons.googlecode.com/files/restaurant.png",
        'Shopping':   "https://google-maps-icons.googlecode.com/files/supermarket.png",
        'Gift':       "https://google-maps-icons.googlecode.com/files/gifts.png",
        'Fast Food':  "https://google-maps-icons.googlecode.com/files/fastfood.png",
        'Clothing':   "https://google-maps-icons.googlecode.com/files/shoes.png",
        'Market':     "https://google-maps-icons.googlecode.com/files/market.png",
        'Veterinary':   "/static/veterinary.png",
        'Hair Dresser': '/static/barber.png',
        'Beauty':       '/static/beautysalon.png'
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

        if (currentPlace) {
          info.animate(
            {right: "-345px"},
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
                info.animate({right: "0"});
              }
            }}
          )
        } else {
          currentPlace = clickedPlace;
                if (currentPlace.url) {
                  $('.shoptitle', info).empty().html($("<a></a>").attr('href', clickedPlace.url).text(clickedPlace.name));
                } else {
                  $('.shoptitle', info).html(clickedPlace.name);
                }
          $('.shopdescription',  info).text(clickedPlace.description);
          $('.address',  info).text(clickedPlace.address);
          $('.phone',  info).text(clickedPlace.phoneNumber);
          info.animate({right: "0"});
        }
      });
    });
    var markerCluster = new MarkerClusterer(map, markers, {gridSize: 25});
  });
});
