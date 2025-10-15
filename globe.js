const myGlobe = Globe()
  .globeImageUrl("//unpkg.com/three-globe/example/img/earth-day.jpg")
  .width(window.innerWidth)
  .height(window.innerHeight)(document.getElementById("globeViz"));

const controls = myGlobe.controls();
const myMarkers = [];
const myLabels = [];
controls.autoRotate = true;
controls.autoRotateSpeed = 0.1;

myGlobe.onGlobeClick(async ({ lat, lng }, event) => {
  let latFormat = lat.toFixed(4);
  let lngFormat = lng.toFixed(4);
  let myMarker = { lat, lng };

  // put these in a loop?

  let myLabel = {
    lat,
    lng,
    text: `
    LAT: ${latFormat},
    LON: ${lngFormat},
    ${await getGeoCode(lat, lng)},
    ${await getWeatherData(lat, lng)}`,
  };
  myMarkers.push(myMarker);
  myLabels.push(myLabel);

  myGlobe
    .pointsData(myMarkers)
    .pointColor(() => "red")
    .pointAltitude(0.1)
    .pointRadius(0.1);
  myGlobe
    .labelsData(myLabels)
    .labelColor(() => "black")
    .labelSize(1)
    .labelAltitude(0.05);
});

async function getGeoCode(_lat, _lon) {
  let api_key = "7d4399c94d084ca69570945562485ad3";

  let query = _lat + "," + _lon;
  let api_url = "https://api.opencagedata.com/geocode/v1/json";

  let request_url =
    api_url +
    "?" +
    "key=" +
    api_key +
    "&q=" +
    encodeURIComponent(query) +
    "&pretty=1" +
    "&no_annotations=1";

  try {
    const response = await fetch(request_url);
    const data = await response.json();
    if (!response.ok) {
      throw new Error("could not fetch Geocoding data.");
    }
    return data.results[0].formatted;
  } catch (error) {
    console.error(error);
  }
}

async function getWeatherData(_lat, _lon) {
  let api_key = "54bac3718c5f1056dd47aed11efe8ff7";
  let api_url = "https://api.openweathermap.org/data/2.5/weather";
  let request_url =
    api_url +
    "?lat=" +
    _lat +
    "&lon=" +
    _lon +
    "&appid=" +
    api_key +
    "&units=imperial";
  // console.log("getting weather data: " + request_url);
  try {
    const response = await fetch(request_url);
    const data = await response.json();
    if (!response.ok) {
      throw new Error("could not fetch Weather data.");
    }
    console.log("calling weather");
    // console.log(data);
    // console.log(`
    //   temperature: ${data.main.temp}
    //   humidity: ${data.main.humidity}
    //   `);
    return `-------------
      Temperature: ${data.main.temp}
      Humidity: ${data.main.humidity}
      `;
  } catch (error) {
    console.error(error);
  }
}
