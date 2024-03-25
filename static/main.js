const URL = "http://127.0.0.1:8000";
const TEMPERATURE_ELEMENT = document.getElementById("temperature");
const DAY_ELEMENT = document.getElementById("day");
const TIME_ELEMENT = document.getElementById("time");
const LIGHT_ELEMENT = document.getElementById("lights");

const LIGHT_ICON_ON = `<i class="bi bi-lightbulb-fill"></i>`;
const LIGHT_ICON_OFF = `<i class="bi bi-lightbulb"></i>`;

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
                let icon;
                if (value.status) {
                    icon = LIGHT_ICON_ON;
                } else {
                    icon = LIGHT_ICON_OFF;
                }
                res += `
                <div class="row pb-3">
                    <div class="col">
                        <span id="${key}-icon">${icon}</span>
                    </div>
                    <div class="col">
                        <button id="${key}" class="btn btn-primary" onclick="switchLight('${key}')">${key}</button>
                    </div>
                </div>`;
            }
            LIGHT_ELEMENT.innerHTML = res;
        })
        .catch((err) => console.log(err));
}

function switchLight(name) {
    lights[name].status = !lights[name].status;
    fetch(URL + "/lightbulb/" + name, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(lights[name]),
    })
        .then((response) => response.json())
        .then((json) => {
            lights[name] = json;
            let element = document.getElementById(name + "-icon");
            if (lights[name].status) {
                element.innerHTML = LIGHT_ICON_ON;
            } else {
                element.innerHTML = LIGHT_ICON_OFF;
            }
        })
        .catch((err) => console.error(err));
}

// END OF DEFINITIONS

getTemp();
getDay();
getTime();
getLights();
