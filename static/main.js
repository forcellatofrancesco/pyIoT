const URL = "http://127.0.0.1:8000";
const TEMPERATURE_ELEMENT = document.getElementById("temperature");
const DAY_ELEMENT = document.getElementById("day");
const TIME_ELEMENT = document.getElementById("time");
const LIGHT_ELEMENT = document.getElementById("lights");

const LIGHT_ICON_ON = `<i class="bi bi-lightbulb-fill"></i>`;
const LIGHT_ICON_OFF = `<i class="bi bi-lightbulb"></i>`;
const LOADING_ICON = `<div class="spinner-grow" style="width: 1rem; height: 1rem;" role="status">
                            <span class="visually-hidden">Loading...</span>
                    </div>`;

const headers = {
    "Content-Type": "application/json",
};

let lights = {};

function getTemp() {
    fetch(URL + "/temperature")
        .then((response) => response.json())
        .then((json) => (TEMPERATURE_ELEMENT.innerHTML = json["temp"]))
        .catch((err) => console.log(err));
}

function getDay() {
    fetch(URL + "/day")
        .then((response) => response.json())
        .then((json) => (DAY_ELEMENT.innerHTML = json["day"]))
        .catch((err) => console.log(err));
}

function getTime() {
    fetch(URL + "/time")
        .then((response) => response.json())
        .then((json) => (TIME_ELEMENT.innerHTML = json["time"]))
        .catch((err) => console.log(err));
}

function getLights() {
    fetch(URL + "/lightbulb")
        .then((response) => response.json())
        .then((json) => {
            lights = json;
            let res = "";
            for ([key, value] of Object.entries(lights)) {
                let icon = getLightIcon(value.status);
                res += `
                <div class="row pb-3 justify-content-between">
                    <div class="col">
                        ${key}
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-outline-warning" onclick="switchLight('${key}')">
                            <span id="${key}-icon">${icon}</span>
                        </button>
                    </div>
                </div>`;
            }
            LIGHT_ELEMENT.innerHTML = res;
        })
        .catch((err) => console.log(err));
}

function switchLight(name) {
    let element = document.getElementById(name + "-icon");
    lights[name].status = !lights[name].status;
    element.innerHTML = LOADING_ICON;
    fetch(URL + "/lightbulb/" + name, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(lights[name]),
    })
        .then((response) => response.json())
        .then((json) => {
            lights[name] = json;
            element.innerHTML = getLightIcon(lights[name].status);
        })
        .catch((err) => console.error(err));
}

function getLightIcon(status) {
    return status ? LIGHT_ICON_ON : LIGHT_ICON_OFF;
}

// Fetch initial data

//getTemp();
getDay();
getTime();
getLights();
