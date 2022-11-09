import { Z_NO_COMPRESSION } from "zlib";

// ---------------- Block API Google by dev.to  ----------------//
// Store old reference
const appendChild = Element.prototype.appendChild;

// All services to catch
const urlCatchers = [
  "/AuthenticationService.Authenticate?",
  "/QuotaService.RecordEvent?"
];

// Google Map is using JSONP.
// So we only need to detect the services removing access and disabling them by not
// inserting them inside the DOM
Element.prototype.appendChild = function (element) {
  const isGMapScript = element.tagName === 'SCRIPT' && /maps\.googleapis\.com/i.test(element.src);
  const isGMapAccessScript = isGMapScript && urlCatchers.some(url => element.src.includes(url));

  if (!isGMapAccessScript) {
    return appendChild.call(this, element);
  }

  // Extract the callback to call it with success data
  // Only needed if you actually want to use Autocomplete/SearchBox API
  //const callback = element.src.split(/.*callback=([^\&]+)/, 2).pop();
  //const [a, b] = callback.split('.');
  //window[a][b]([1, null, 0, null, null, [1]]);

  // Returns the element to be compliant with the appendChild API
  return element;
};

let map;
let panorama;

const panoramaElement = document.querySelector("#panorama");

const resetMapButton = document.querySelector("#reset-map");
const backToMapButton = document.querySelector("#back-to-map");

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 48.858441, lng: 2.294481},
          zoom: 3,
          streetViewControl: false
        });
        
        panorama = new google.maps.StreetViewPanorama(
          document.getElementById('panorama'), {
            position: {lat: 48.858441, lng: 2.294481},
            pov: {
              heading: 34,
              pitch: 10
            }
          });
        
        addMapListeners();

        panoramaElement.style.display = "none";
        backToMapButton.style.display = "none";
      }

function addMapListeners() {
  resetMapButton.addEventListener("click", resetMap);
  backToMapButton.addEventListener("click", backToMap);
}


function addMarkerOnMap(dream) {
  const marker = new google.maps.Marker({
    position: dream.coordinates,
    map: map,
    icon: dream.done ? "images/marker-done.png":"images/marker.png"
  });


  marker.addListener('click', function() {
  zoomOn(marker.getPosition());
  });

}

function zoomOn(position) {
  map.setZoom(20);
  map.setCenter(position);
  map.setMapTypeId("satellite");
}

function resetMap(){
  map.setZoom(3);
  map.setCenter({lat: 48.858441, lng: 2.294481});
  map.setMapTypeId("roadmap"); 
}


function backToMap(){
  panoramaElement.style.display = "none";
  backToMapButton.style.display = "none";
  resetMapButton.style.display = "block";
}

function visitDreamOnMap(position){
  panorama.setPosition(position);
  panoramaElement.style.display = "block";
  backToMapButton.style.display = "block";
  resetMapButton.style.display = "none";

}

export {initMap, addMarkerOnMap, visitDreamOnMap};