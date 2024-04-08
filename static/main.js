const URL = "http://127.0.0.1:8000";
const TEMPERATURE_ELEMENT = document.getElementById("temperature");
const DAY_ELEMENT = document.getElementById("day");
const TIME_ELEMENT = document.getElementById("time");

const LIGHT_ICON_ON = `<i class="bi bi-lightbulb-fill"></i>`;
const LIGHT_ICON_OFF = `<i class="bi bi-lightbulb"></i>`;
const LOADING_ICON = `<div class="spinner-grow" style="width: 1rem; height: 1rem;" role="status">
                            <span class="visually-hidden">Loading...</span>
                    </div>`;
const SECOND = 1000;

function getTemp() {
    fetch(URL + "/temperature")
        .then((response) => response.json())
        .then((json) => (TEMPERATURE_ELEMENT.innerHTML = json["data"]))
        .catch((err) => console.log(err));
}

function getDay() {
    fetch(URL + "/day")
        .then((response) => response.json())
        .then((json) => (DAY_ELEMENT.innerHTML = json["data"]))
        .catch((err) => console.log(err));
}

function getTime() {
    fetch(URL + "/time")
        .then((response) => response.json())
        .then((json) => (TIME_ELEMENT.innerHTML = json["data"]))
        .catch((err) => console.log(err));
}

function updateLight(lightbulb) {
    let element = document.getElementById("icon-" + lightbulb);
    element.innerHTML = LOADING_ICON;
    fetch(URL + "/lightbulb/" + lightbulb, {
        method: "PUT",
    })
        .then((response) => response.json())
        .then((json) => {
            let status = json["status"];
            if (status) {
                element.innerHTML = LIGHT_ICON_ON;
            } else {
                element.innerHTML = LIGHT_ICON_OFF;
            }
        })
        .catch((err) => console.log(err));
}

setInterval(getTime, SECOND);
setInterval(getTemp, SECOND * 5);
