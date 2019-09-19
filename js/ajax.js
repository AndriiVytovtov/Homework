let AJAX = {
    get: function(url, onresponse) {
        let request = new XMLHttpRequest();
        request.open("GET", url, true);

        request.onreadystatechange = function() {
            if(request.readyState != 4) return;
            onresponse(request.status, request.responseText);
        }

        request.send();
    },

    post: function(url, obj, onresponse) {
        let request = new XMLHttpRequest();
        request.open("POST", url, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        request.onreadystatechange = function() {
            if(request.readyState != 4) return;
            onresponse(request.status, request.responseText);
        }

        let params = [];
        for(let key in obj) {
            params.push(key+"="+encodeURIComponent(obj[key]));
        }

        request.send(params.join("&"));
    }
}