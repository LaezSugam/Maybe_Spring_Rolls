var pos;

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 13
  });
  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };


      map.setCenter(pos);

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function restaurantSearch() {

  map = new google.maps.Map(document.getElementById('map'), {
      center: pos,
      zoom: 15
    });



  var request = {
    location: pos,
    type: 'restaurant',
  };

  request["radius"] = document.getElementById("distance").value * 1609
  request["keyword"] = document.getElementById("restaurant_type").value
  request["openNow"] = document.getElementById("open_now").value
  console.log(document.getElementById("min_price").value)
  console.log(document.getElementById("max_price").value)
  if (document.getElementById("min_price").value == 0){
    delete request["minPriceLevel"];
  }
  else {
      request["minPriceLevel"] = document.getElementById("min_price").value;
  }

  if (document.getElementById("max_price").value == 4){
    delete request["maxPriceLevel"];
  }
  else {
    request["maxPriceLevel"] = document.getElementById("max_price").value;
  }

  for (i in request){
    console.log(i) + " | " + console.log(request[i])
  }


  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.radarSearch(request, pickPlace);
}

function searchAll() {

  map = new google.maps.Map(document.getElementById('map'), {
      center: pos,
      zoom: 15
    });

  var request = {
    location: pos,
    radius: '50000',
    type: 'restaurant',
  };

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.radarSearch(request, pickPlace);
}

function pickPlace(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(results.length)
      eatHere = Math.floor(Math.random() * results.length)
      service = new google.maps.places.PlacesService(map);
      request2 = {placeId: results[eatHere].place_id}
      service.getDetails(request2, processPlace);
  }
  else {
    console.log("It's not okay!")
  }
}

function processPlace(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
      createMarker(results);
      createInfo(results);
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  map.setCenter(place.geometry.location);

  google.maps.event.addListener(marker, 'click', function() {
    placeInfo = "<img src='" + place.icon + "' width='15px' /><b>" + place.name + "</b><br />" + place.vicinity + "<br />" + place.rating + "<br />" + "<a href='" + place.url + "'>Open in Google Maps</a>"
    infowindow.setContent(placeInfo);
    infowindow.open(map, this);
  });
}

  function createInfo(place) {
      newHTML = ""
      if (place.photos){
        newHTML += "<img src='" + place.photos[0].getUrl({'maxWidth': 500, 'maxHeight': 500}) + "' width='100%' /><br />"
      }
      newHTML += "<b>" + place.name + "</b><br />" + place.vicinity + "<br />" + place.formatted_phone_number + "<br />" + place.rating + "<br />";
      for(i in place.opening_hours.weekday_text){
        newHTML += place.opening_hours.weekday_text[i] + "<br />"
      }
      newHTML += "<a href='" + place.url + "'>Open in Google Maps</a>"
      document.getElementById("current_place").innerHTML = newHTML;
    };
