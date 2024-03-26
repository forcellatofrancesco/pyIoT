document.addEventListener("htmx:afterRequest", function (event) {
    let target = event.detail.target;
    let response = event.detail.xhr.response;
    let data = JSON.parse(response);
    switch (target.id) {
        case "time":
        case "day":
        case "temperature":
            target.innerHTML = data.data;
            break;
    }
});
