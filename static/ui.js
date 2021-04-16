LS_SELECTED_NOTE="selected-note"
LS_STATUS="status"

var noteHTML = `
<li id="{{ item }}" class="nav-item">
	<a class="nav-link" onclick="uiViewNote('{{ item }}')">{{ item }}</a>
</li>
`

// document.onkeypress = function (e) {
//     // DOWN ARROW
// 	if (event.keyCode === 40) {
// 		renderKeySelectNote()
// 	}
// }


search = document.getElementById("notes-search")
main = document.getElementById("main")


// Generic functions
function renderComponent(parent, template, item) {
	innerHTML = template.replaceAll("{{ item }}", item)
	doc = new DOMParser().parseFromString(innerHTML, "text/html");
	body = doc.getRootNode().body
	parent.appendChild(body.firstChild)
}

function renderComponents(parent, template, response) {
	console.log(response)
	response.forEach(function (item, index) {
		// console.log(item, index);
		renderComponent(parent, template, item)
	});
}

function getCards() {
	return document.getElementById("cards")
}

function getLocalNotes() {
	return JSON.parse(localStorage.getItem("notes"))
}

function setSelectedNote(title) {
	previous = document.getElementById(localStorage.getItem(LS_SELECTED_NOTE))
	if (previous != null) {
		previous.classList.remove('selected-note')
	}
	localStorage.setItem(LS_SELECTED_NOTE, title)
	document.getElementById(title).classList.add('selected-note')
}

// Render functions
function renderListNotes() {
	cards = getCards()
	renderComponents(cards, noteHTML, JSON.parse(this.responseText))
	localStorage.setItem("notes", this.responseText)
}

function renderSearchNotes(search) {
	cards = getCards()
	cards.innerHTML = ""
	notes = getLocalNotes()

	notes.forEach(function (item, index){
		if (item.includes(search)) {
			renderComponent(cards, noteHTML, item)
		}
	})
}

function renderHardSearchNotes(search) {
	cards = getCards()
	cards.innerHTML = ""

	apiListNotes(search, renderListNotes)
}

function renderKeySelectNote() {
	cards = getCards()
	status = localStorage.getItem(LS_STATUS)
	if (status == "active") {
		current = document.getElementById(localStorage.getItem(LS_SELECTED_NOTE))

	}
	title = cards.firstChild.innerText
	uiViewNote(title)
	localStorage.setItem(LS_STATUS, 'active')
}

var callbackViewNote =  function(parent, content) {
	parent.innerHTML = markdown.toHTML(content)	
}


//  UI functions
function uiListNotes() {
	apiListNotes("", renderListNotes)
}

function uiSearchNotes() {
	renderSearchNotes(search.value)
}

function uiViewNote(title) {
	apiCatNote(title, main, callbackViewNote)
	setSelectedNote(title)
}

function uiOpenBrowser() {
	apiOpenBrowser(localStorage.getItem(LS_SELECTED_NOTE))
}

function uiOpenVSCode() {
	apiOpenCode(localStorage.getItem(LS_SELECTED_NOTE))
}

function uiNewVSCode() {
	alertify.prompt( 'New note', 'Title', ''
        , function(evt, value) { 
			apiNewCode(value)
		}
        , function() { 
			alertify.error('Cancel') 
	});
}

function render() {
	uiListNotes()
	title = localStorage.getItem(LS_SELECTED_NOTE)
	uiViewNote(title)
}

search.addEventListener("keyup", function(event){
	renderSearchNotes(search.value)
	// ENTER
    if (event.keyCode === 13) {
        renderHardSearchNotes(search.value)
    }
	// DOWN ARROW
	if (event.keyCode === 40) {
		renderKeySelectNote()
	}

	localStorage.setItem(LS_STATUS, 'inactive')
})
