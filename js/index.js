var map;
var markers = [];
var infoWindow;
function initMap() {
  var losAngeles = {
    lat: 34.063380,
    lng: -118.358080
  }
  map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 8,
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#c9b2a6' }]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#dcd2be' }]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#ae9e90' }]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{ color: '#dfd2ae' }]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#dfd2ae' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#93817c' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{ color: '#a5b076' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#447530' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#f5f1e6' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#fdfcf8' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#f8c967' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#e9bc62' }]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [{ color: '#e98d58' }]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#db8555' }]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#806b63' }]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{ color: '#dfd2ae' }]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#8f7d77' }]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#ebe3cd' }]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{ color: '#dfd2ae' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{ color: '#b9d3c2' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#92998d' }]
      }
    ]
  });

  infoWindow = new google.maps.InfoWindow();
  searchStores();
  setOnClickListener();
}

function searchStores() {
  var foundStores = [];
  var zipCode = document.getElementById('zip-code-input').value;
  if (zipCode) {
    stores.forEach(function (store) {
      var postal = store.address.postalCode.substring(0, 5);
      if (postal == zipCode) {
        foundStores.push(store);
      }
    });
  }
  else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener();
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener() {
  var storeElements = document.querySelectorAll('.store-container');
  storeElements.forEach(function (elem, index) {
    elem.addEventListener('click', function () {
      google.maps.event.trigger(markers[index], 'click');
    })
  });
}

function displayStores(stores) {
  var storesHtml = "";
  stores.forEach(function (store, index) {
    var address = store.addressLines;
    var phone = store.phoneNumber;
    storesHtml += `
            <div class="store-container">
              
                <div class="store-info-container">
                  <div class="store-address">
                      <span>${address[0]}</span>
                      <span>${address[1]}</span>
                  </div>
                  <div class="store-phone-number">                    
                    <i class="fa fa-phone" style="font-size:16px;color:#00704a;margin-right: 8px; "></i>                  
                    ${phone}
                  </div>
                </div>
                <div class="store-number-container">
                  <div class="store-number">
                       ${index + 1}
                  </div>
                </div>         
                             
            </div> `
  });
  document.querySelector('.stores-list').innerHTML = storesHtml;
}

function showStoresMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  stores.forEach(function (store, index) {
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude);
    var name = store.name;
    var address = store.addressLines[0];
    var phone = store.phoneNumber;
    var openStatusText = store.openStatusText;
    var lat = store.coordinates.latitude;
    var lan = store.coordinates.longitude;

    bounds.extend(latlng);
    createMarker(latlng, name, openStatusText, address, phone, lat, lan, index);
  })
  map.fitBounds(bounds);
}

function createMarker(latlng, name, openStatusText, address, phone, lat, lan, index) {

  var html = ` 
        <div class="store-info-window ">
            <div class="store-info-name">
               <img alt="" src="images/starbuckslogo.png" style="font-size:10px; width: 10%"/>
                ${name}
            </div> 
            <div class="store-info-status ">
                <i class="fa fa-clock" style="font-size:22px;color:#00704a;margin-right: 8px;"></i>
                ${openStatusText}
            </div> 
            <div class="store-info-address">
                <i class="fa fa-directions" style="font-size:22px;color:blue;margin-right: 8px;"></i>
                <a href="https://www.google.com/maps/dir/?api=1&origin=32.775150,-96.809097&destination=${lat},${lan}" target="_blank">${address}</a>
            </div> 
            <div class="store-info-phone ">
                <div class="icon-circle">
                    <i class="fa fa-phone" ></i>
                </div>
                ${phone}
            </div> 
        </div>     
    `;

  var iconBase = 'images/';

  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    icon: iconBase + 'starbucks.png',
    label: { text: `${index + 1}`, color: "#FA163F", fontWeight: "bold" }
  });
  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}


