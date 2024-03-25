const URL = "http://127.0.0.1:8000";
const temperature = document.getElementById("temperature");
const day = document.getElementById("day");
const time = document.getElementById("time");
const lightDIV = document.getElementById("lights");

const lightIconON = `<i class="bi bi-lightbulb-fill"></i>`;
const lightIconOFF = `<i class="bi bi-lightbulb"></i>`;

// let lightbulb = {
//     name: "Light 1",
//     status: false,
// };

let lights = {};

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

// function getLightbulb() {
//     fetch(URL + "/lightbulb")
//         .then((response) => response.json())
//         .then((json) => updateLightbulbDIV(json))
//         .catch((err) => console.log(err));
// }

function getLights() {
    fetch(URL + "/lightbulb")
        .then((response) => response.json())
        .then((json) => {
            lights = json;
            let res = "";
            for ([key, value] of Object.entries(lights)) {
                let icon;
                if (value["status"]) {
                    icon = lightIconON;
                } else {
                    icon = lightIconOFF;
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
            lightDIV.innerHTML = res;
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
                element.innerHTML = lightIconON;
            } else {
                element.innerHTML = lightIconOFF;
            }
        })
        .catch((err) => console.error(err));
}

// END OF DEFINITIONS

getTemp();
getDay();
getTime();
getLights();
