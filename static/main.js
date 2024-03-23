const URL = "http://127.0.0.1:8000";
const temperature = document.getElementById("temperature");
const day = document.getElementById("day");
const time = document.getElementById("time");
const lightDIV = document.getElementById("lightbulb");

let lightbulb = {
    name: "Light 1",
    status: false,
};

// Set request headers
const headers = {
    "Content-Type": "application/json",
};

function getTemp() {
    fetch(URL + "/temperature")
        .then((response) => response.json())
        .then((json) => (temperature.innerHTML = json["temp"]))
        .catch((err) => console.log(err));
}

function getDay() {
    fetch(URL + "/day")
        .then((response) => response.json())
        .then((json) => (day.innerHTML = json["day"]))
        .catch((err) => console.log(err));
}

function getTime() {
    fetch(URL + "/time")
        .then((response) => response.json())
        .then((json) => (time.innerHTML = json["time"]))
        .catch((err) => console.log(err));
}

function getLightbulb() {
    fetch(URL + "/lightbulb")
        .then((response) => response.json())
        .then((json) => updateLightbulbDIV(json))
        .catch((err) => console.log(err));
}

function updateLightbulb() {
    lightbulb.status = !lightbulb.status;
    fetch(URL + "/lightbulb", {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(lightbulb),
    })
        .then((response) => response.json())
        .then((json) => updateLightbulbDIV(json))
        .catch((err) => console.log(err));
}

function updateLightbulbDIV(json) {
    lightbulb = json;
    if (lightbulb.status) {
        lightDIV.innerHTML = `<i class="bi bi-lightbulb-fill"></i>`;
    } else {
        lightDIV.innerHTML = `<i class="bi bi-lightbulb"></i>`;
    }
}

// END OF DEFINITIONS

getTemp();
getDay();
getTime();
getLightbulb();
