LS_SELECTED_NOTE="selected-note"



var html = `
  <div>
    <span>Some HTML here</span>
  </div>
`

// var noteHTML = `
// <div class="d-flex my-3">
//     <div id="{{ item }}" class="jumbotron w-100 py-5 mx-auto" onclick="uiViewNote('{{ item }}')">
// 		<div class="clickable">
//         	<h4>{{ item }}</h4>
// 		</div>
// 		<div class="note-content">
// 			<div class="hidden-note">
// 			</div>
// 		</div>
// 	</div>
// </div>
// `

var noteHTML = `
<li class="nav-item">
	<a class="nav-link" onclick="uiViewNote('{{ item }}')">{{ item }}</a>
</li>
`

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
	localStorage.setItem(LS_SELECTED_NOTE, title)
	apiCatNote(title, main, callbackViewNote)
}

function uiOpenBrowser() {
	apiOpenBrowser(localStorage.getItem(LS_SELECTED_NOTE))
}

function uiOpenVSCode() {
	apiOpenCode(localStorage.getItem(LS_SELECTED_NOTE))
}

function render() {
	uiListNotes()
	title = localStorage.getItem(LS_SELECTED_NOTE)
	uiViewNote(title)
}


search.onkeyup = function(){
    renderSearchNotes(search.value);
}

search.addEventListener("keyup", function(event){
    if (event.keyCode === 13) {
        renderHardSearchNotes(search.value)
    }
})