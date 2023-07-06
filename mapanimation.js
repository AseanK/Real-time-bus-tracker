// API token
mapboxgl.accessToken = 'ENV_VAL'

// Creating default map using mapbox
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://style/mapbox/streets-v11',
    // Starting LngLat
    center: [-71.060081, 42.364554],
    zoom: 11
});

// Global marker value
// (Uncaught promise error when put inside the run function)
var marked = [];

// Fetching API to add values to dropdown
const select = document.getElementById("select")
const displayOption = async () => {
    var options = await getBusLocations();
        // Creates HTML option tags under the HTML select tag for every bus
        for (var bus in options) {
            const newOptions = document.createElement("option");
            newOptions.text = options[bus].id;
            newOptions.value = options[bus].id;
            select.appendChild(newOptions);
        };
};  displayOption();

// Displays and moves sepific selected marker
async function run(){
    var options = await getBusLocations();
    // Used to check if a marker already exist on the map
    var currentMarker = document.getElementsByClassName("mapboxgl-marker")

    // Currently selected bus from the dropdown
    var selectedBus = document.getElementById("select");
    var value = selectedBus.value;

    // Saves selected dropdown value as 'selected'
    var selected = options.find(bus => bus.id == value)
    // Checks and removes marker if already exist
    if (currentMarker.length !== 0) {
        marked.forEach((marker) =>{
            marker.remove();
        })
        marked.splice(0, marked.length)
    }

    // Popup value
    let popup = new mapboxgl.Popup({
        closeButton: false
    })
    .setHTML("Bus ID: " + selected.attributes.label + 
    "<hr/><p> Current Stop: " + selected.attributes.current_stop_sequence + 
    "</p><p>Occupancy: " + selected.attributes.occupancy_status + 
    "</p>")

    // Creates a marker and a popup on to the map with the corresponding info
    currentMap = new mapboxgl.Marker({
        color: "green",
    })  .setLngLat([selected.attributes.longitude,selected.attributes.latitude])
        .addTo(map)
        .setPopup(popup);

    marked.push(currentMap);

    //Updates the marker every 10sec
    setTimeout(run, 10000);
};

// Displays every marker on the API
const showAll = async () => {
    var options = await getBusLocations();

    // Used to check and update the button if pressed
    var check = document.getElementById("btn")

    // geoJSON object is needed for multiple markers and popups
    var geoJSON = {
        type:'FeatureCollection',
        features: []
    };
    // Create & push geoJSON
    for (var index in options){
    bus = options[index].attributes
    lngLat = [bus.longitude, bus.latitude];
    feature = {
        "type": 'Feature',
        "geometry": {
          "type": 'Point',
          "coordinates": lngLat,
        },
        "properties": {
          "title": bus.label,
          "description": " <hr/><p> Current Stop: " + bus.current_stop_sequence + "</p>" + "<p>Occupancy: " + bus.occupancy_status + "</p>"
        }
      };
    geoJSON.features.push(feature);
    };

    // Removes marker and updates button if value is off
    if (check.value == "off") {
        marked.forEach((marker) =>{
            marker.remove();
        })
        marked.splice(0, marked.length)
        check.value = "on"; 
        check.textContent = "Display All"
    } else {
        // Updates and displays marker with popup if the button value is on
        geoJSON.features.forEach((marker) => {
            let popup = new mapboxgl.Popup({
                closeButton: false
            })
            .setHTML('Bus ID: ' + marker.properties.title + marker.properties.description)

            let currentMarker = new mapboxgl.Marker({
                color: "green"
            })
                .setLngLat(marker.geometry.coordinates)
                .addTo(map)
                .setPopup(popup)
            marked.push(currentMarker);

        }); check.value = "off"; check.textContent = "Remove All"
    }
};  

// Request bus data from MBTA
async function getBusLocations(){
    //url containing buses info
    const url = 'https://api-v3.mbta.com/vehicles';
    //Waits for the url to finish and fetches it to response
    const response = await fetch(url);
    //saves response to .json file
    const json     = await response.json();
return json.data;
};
