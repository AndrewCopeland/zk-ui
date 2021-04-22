URL = "http://localhost:5000/api"

function apiListNotes(search, callback){
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", callback);
	url = URL +  "/notes"
    if (search != "" && search != null) {
        url += "?search=" + search
    }
	oReq.open("GET", url);
	oReq.send();
}

function apiCatNote(title, parent, callback){	
	url = URL +  "/notes/" + title 
	getData(url, parent, callback)
}

function getData(url, parent, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        // only run if request is complete i.e. 4 == done
        if (xhr.readyState !== 4) return;
        if (xhr.status == 200) {
			callback(parent, xhr.responseText)
        } else {
            console.log('error', xhr);
        }
    };
    xhr.open('GET', url);
    xhr.send();
}

function apiOpenBrowser(title) {
    url = URL +  "/notes/" + title + "/open-browser"
    getData(url, null, function(parent, response){})
}

function apiOpenCode(title, parent, callback) {
    url = URL +  "/notes/" + title + "/open-code"
    getData(url, parent, callback)
}

function apiNewCode(title, parent, callback) {
    url = URL +  "/notes/" + title + "/new-code"
    getData(url, parent, callback)
}

function apiRemoveCode(title, parent, callback) {
    url = URL +  "/notes/" + title + "/remove"
    getData(url, parent, callback)
}

function apiLinkNotes(title, linkTitle, parent, callback) {
    url = URL +  "/notes/" + title + "/link/" + linkTitle
    getData(url, parent, callback)
}
 