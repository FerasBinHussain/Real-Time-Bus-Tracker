// Bus markers list.
let busMarkers = [];
// Bus popups list.
let busPopups = [];

// Mapbox token.
mapboxgl.accessToken = 'pk.eyJ1IjoiZmVyYXNiaW5odXNzYWluIiwiYSI6ImNreTZ6a2l6YzEwdTUyb3B2a3dvaXJlb2MifQ.Qn43SmOoRMx3As49TmyUgA';

// This is the map instance.
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-71.104081, 42.365554],
  zoom: 14,
});


async function Start(){
    // Get bus data.    
	const locations = await getBusLocations();
    let busLocations = [];
    locations.forEach(element => {
        let bus = {
            lng: element.attributes.longitude,
            lat: element.attributes.latitude,
            label: element.attributes.label
        }
        busLocations.push(bus);
    });
   
    // Check if we need to update or add new markers. 
    if (busMarkers.length > 0 ) {
        UpdateBusMarker(busLocations);
    }else {
        CreateBusMarker(busLocations);
    }

	// timer
	setTimeout(Start, 15000);
}

function CreateBusMarker(busLocations){
    // Create new markers list to be added to DOM.
    let newMarkers = new Array (busLocations.length);
    // create the popup
    let newPopup = new Array(newMarkers.length);

    // Add markers to the map.
    for (let index = 0; index < newMarkers.length; index++) {
        
        // Get current element.
        const element = busLocations[index];

        // Create a DOM element for each marker.
        const el = document.createElement('div');
        el.className = 'marker';
        el.id = 'm' + index;

        // Create popup for each marker. 
        newPopup[index] = new mapboxgl.Popup({ offset: 25 }).setText(element.label);
        // Add markers to the map.
        new mapboxgl.Marker(el)
        .setLngLat([element.lng , element.lat])
        .setPopup( newPopup[index]) // add popup
        .addTo(map)
        .togglePopup();

        // Keep old Bus markers and popups. 
        busMarkers.push(element);
        busPopups.push(newPopup[index]);
    }
}

function UpdateBusMarker(busLocations){
    // Delete all current markers to add the updated ones to the DOM. 
    for (let index = 0; index < busMarkers.length; index++) {
        var elem = document.getElementById("m"+index);
        elem.parentNode.removeChild(elem);
        busPopups[index].remove();
    }

    // Free markers and popups lists to start over. 
    busMarkers = [];
    busPopups = [];

    // Create the updated Bus Markers.
    CreateBusMarker(busLocations)
}

// Request bus data from MBTA.
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

// Start app 
Start();