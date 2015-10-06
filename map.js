var map1, map2, map3, map4;

function initMap() {
  // Create a map object and specify the DOM element for display.
  map1 = new google.maps.Map(document.getElementById('map1'), {
    center: {lat: 47.8499924, lng: -119.8784013},
    scrollwheel: true,
    zoom: 8
  });
  map2 = new google.maps.Map(document.getElementById('map2'), {
    center: {lat: 47.8499924, lng: -119.8784013},
    scrollwheel: true,
    zoom: 8
  });
  map3 = new google.maps.Map(document.getElementById('map3'), {
    center: {lat: 47.8499924, lng: -119.8784013},
    scrollwheel: true,
    zoom: 8
  });
  map4 = new google.maps.Map(document.getElementById('map4'), {
    center: {lat: 46.8588974, lng: -121.6111682},
    scrollwheel: true,
    zoom: 11
  });

  getPolys();
}

function getPolys() {
  var fbURL="https://spotwx.com/products/grib_polys.php?lat=47.5741395&lon=-120.7657064";

  $.ajax({
      url: fbURL+"&callback=?",
      type: 'GET',
      success: function (resp) {
          alert(resp);
      },
      error: function(e) {
          alert('Error: '+e);
      }  
  });
}

function myFunction(resp){
  console.log("got it");
  console.log(resp);
}