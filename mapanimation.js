//API token
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JlYW4iLCJhIjoiY2wyemR4aHd0MWUycjNjcGZkdGR6MDcxdiJ9.xxcZhJA4uVkMJE9Jxw1LoQ'

//Creating default map using mapbox
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://style/mapbox/streets-v11',
    //Starting LngLat
    center: [-71.060081, 42.364554],
    zoom: 11
});
//Creating marker before the run function
//(Uncaught promise error when put inside the run function)

//Fetching API to add values to dropdown available buses
const select = document.getElementById("select")
const displayOption = async () => {
    const options = await getBusLocations();
        //Creates option tags under the select tag for every bus
        for (var bus in options) {
            const newOptions = document.createElement("option");
            //console.log(options[bus].id);
            newOptions.text = options[bus].id;
            newOptions.value = options[bus].id;
            select.appendChild(newOptions);
        };
};  displayOption();

//Function to move the marker
async function run(){

    const options = await getBusLocations();

    //Currently selected bus from the dropdown
    var selectedBus = document.getElementById("select");
    var value = selectedBus.value;

    /*********************************************************
    This code can be used to get 'text' instead of the value
    var text = selectedBus.options[selectedBus.selectedIndex].text;
    **********************************************************/

    //Selected dropdown value is saved as 'selected'
    var selected = options.find(bus => bus.id == value)

    //Sets the LngLat value for currently selected bus
    //newMarker.push(selected.attributes.longitude, selected.attributes.latitude);
    //marker.setLngLat(newMarker);  
    var marker = new mapboxgl.Marker({
        color: "green",
    })  .setLngLat([selected.attributes.longitude, selected.attributes.latitude])
        .addTo(map);

    //Printing date and the newMarker to console tap
    console.log(new Date());

    //Updates the marker every 10sec
    setTimeout(run, 10000);
};

const showAll = async () => {
    var marked = []
    var options = await getBusLocations();
    var check = document.getElementById("btn")
    var allMarker = [];
    var geoJSON = {
        type:'FeatureCollection',
        features: []
    };
            for (var index in options){
            bus = options[index].attributes
            lngLat = [bus.longitude, bus.latitude];
            allMarker.push(lngLat);
    
            _feature = {
                "type": 'Feature',
                "geometry": {
                  "type": 'Point',
                  "coordinates": lngLat,
                },
                "properties": {
                  "title": bus.label,
                  "description": " // Current Stop: "+bus.current_stop_sequence+" // Occupancy: "+bus.occupancy_status
                }
              }
              if (check.value=="on") {
                check.value="off"
                geoJSON.features.push(_feature);
                geoJSON.features.forEach((marker) => {
                    marked.push = new mapboxgl.Marker({
                        color: "green",
                    })  .setLngLat(marker.geometry.coordinates)
                        .addTo(map);
                });
            } else if (check.value=="off") {
                marked.remove();
            } check.value="on"
            };

    const onOff = () => {
            console.log(geoJSON.features)
            
                
            }
        
    }

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
