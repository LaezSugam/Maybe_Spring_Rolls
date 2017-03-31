var pos;

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.258, lng: -95},
    zoom: 5
  });
  var infoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
      map.setZoom(15);

    }, function() {
      alert("Geolocation must be enabled to use this application.");
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    alert("Geolocation must be enabled to use this application.");
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
  document.getElementById("current_place").innerHTML = "";
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
  document.getElementById("current_place").innerHTML = "";
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
    if (meals_from_django){
      var meal_arr = [];
      for(i in meals_from_django){
        meal_arr.push(meals_from_django[i]);
      }
      var your_meal = meal_arr[Math.floor(Math.random() * meal_arr.length)];
      alert("Your search criteria didn't return any results.  Maybe you should make " + your_meal + "?");
    }
    else {
      alert("Your search didn't return any results, and you don't appear to have a meal list.  Guess you're going hungry tonight.")
    }
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
      newHTML += "<div class='details'><h3>" + place.name + "</h3><p class='address'>" + place.vicinity + "</p><p class='phoneNumber'>" + place.formatted_phone_number + "</p><p class='rating'>";
      for (var i = 0; i < Math.floor(place.rating); i++){
        newHTML += "&#9733;"
      }
      newHTML += " " + place.rating + "</p>";
      if (place.opening_hours){
        newHTML += "<h4>Hours of Operation</h4><ul class='openHours'>"
        for(i in place.opening_hours.weekday_text){
          newHTML += "<li>" + place.opening_hours.weekday_text[i] + "</li>"
        }
        newHTML += "</ul>"
      }
      newHTML += "<a href='" + place.url + "'>Open in Google Maps &#8618;</a></div>"
      document.getElementById("current_place").innerHTML = newHTML;
    };
