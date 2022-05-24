//API token
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JlYW4iLCJhIjoiY2wyemR4aHd0MWUycjNjcGZkdGR6MDcxdiJ9.xxcZhJA4uVkMJE9Jxw1LoQ'

//Creating map using mapbox
var map = new mapboxgl.Map({
    container: 'map',
    //Map style provided by mapbox
    style: 'mapbox://style/mapbox/streets-v11',
    //Starting LngLat
    center: [-71.104081, 42.365554],
    //Starting zoom
    zoom: 12
})
/*Creating marker before the run function
(Uncaught promise error when put inside the run function)
*/
var marker = new mapboxgl.Marker()
    .setLngLat([null, null])
    .addTo(map);

//Function to move the marker
async function run(){
    //New marker array
    let newMarker = [];
    //Waits for the getBusLocation()
    const locations = await getBusLocations();
    //Pushing bus[0]'s longitude and latitude into the newMarker
    newMarker.push(locations[0].attributes.longitude);
    newMarker.push(locations[0].attributes.latitude);
    //setting marker to newMarker
    marker.setLngLat(newMarker);    
    //printing date and the newMarker to console tap
    console.log(new Date());
    console.log(newMarker);
    // timer, runs every 15sec
    setTimeout(run, 15000);

}

// Request bus data from MBTA
async function getBusLocations(){
    //url containing buses info
    const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
    //Waits for the url to finish and fetches it to response
    const response = await fetch(url);
    //saves response to .json file
    const json     = await response.json();
return json.data;
}
