const URL = "http://127.0.0.1:8000";
const temperature = document.getElementById("temperature");
const day = document.getElementById("day");
const time = document.getElementById("time");
updateTemp();
updateDay();
updateTime();

function updateTemp() {
    fetch(URL + "/temperature")
        .then((response) => response.json())
        .then((json) => (temperature.innerHTML = json["temp"]))
        .catch((err) => console.log(err));
}

function updateDay() {
    fetch(URL + "/day")
        .then((response) => response.json())
        .then((json) => (day.innerHTML = json["day"]))
        .catch((err) => console.log(err));
}

function updateTime() {
    fetch(URL + "/time")
        .then((response) => response.json())
        .then((json) => (time.innerHTML = json["time"]))
        .catch((err) => console.log(err));
}
