LS_SELECTED_NOTE="selected-note"
LS_STATUS="status"
LS_SEARCH="search"

var noteHTML = `
<li id="{{ item }}" class="nav-item">
	<a class="nav-link note-item">{{ item }}</a>
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
	// console.log(response)
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

function getSelectedNote() {
	return localStorage.getItem(LS_SELECTED_NOTE)
}

function setSelectedNote(title) {
	previous = document.getElementById(localStorage.getItem(LS_SELECTED_NOTE))
	if (previous != null) {
		previous.classList.remove('selected-note')
	}
	localStorage.setItem(LS_SELECTED_NOTE, title)

	current = document.getElementById(title)
	if (current != null) {
		current.classList.add('selected-note')
	}
}

function getSelectedNoteFromURL() {
	parts = window.location.href.split("/")
	title = parts[parts.length - 1]
	if (title.endsWith(".md")) {
		return title
	}
	return null
}

function setSearch(currentSearch) {
	localStorage.setItem(LS_SEARCH, currentSearch)
}

function getSearch() {
	return localStorage.getItem(LS_SEARCH)
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
	parent.innerHTML = DOMPurify.sanitize(marked(content))
}

var callbackRemoveNote = function(parent, content) {
	parent.innerHTML = ""
	uiListNotes()
	alertfy.error("Note deleted")
}

var callbackLinkNote = function() {
	alertify.success("Linked notes")
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
	title = getSelectedNote()
	apiOpenCode(title, main, function() {
		uiListNotes();
		uiViewNote(title);
	})
}

function uiNewVSCode() {
	// prompt for note title
	alertify.prompt( 'New note', 'Title', ''
        , function(evt, value) { 
			apiNewCode(value, main, function() {
				uiListNotes();
				uiViewNote(value);
			})
		}
        , function() { 
			alertify.error('Cancel') 
	});
}

function uiRemoveNote() {
	title = getSelectedNote()
	alertify.confirm( 'Delete Note', 'Delete Note ' + title
	, function(evt, value) {
		apiRemoveCode(title, main, callbackRemoveNote)
		// apiNewCode(value, main, callbackNewVSCode)
	}
	, function() { 
		alertify.error('Cancel') 
	});
	
}

function uiRemoveLink() {
	alertify.error("Not implemented")
}

function uiLinkNote(title, link_title) {
	alertify.confirm( 'Link Notes', 'Link ' + title + ' & ' + link_title
	, function(evt, value) {
		apiLinkNotes(title, link_title, null, callbackLinkNote)
	}
	, function*() {
		alertify.error("Cancel")
	});
}

function render() {
	searchContent = getSearch()
	if (searchContent == "" || searchContent == null) {
		uiListNotes()
	} else {
		renderSearchNotes(searchContent)
	}
	
	title = getSelectedNoteFromURL()
	if (title != null) {
		setSelectedNote(title)
	} else {
		title = getSelectedNote()
	}
	uiViewNote(title)
}

search.addEventListener("keyup", function(event){
	renderSearchNotes(search.value)
	setSearch(search.value)
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


// When code is clicked copy to clipboard
document.addEventListener('click', function (event) {
	if (!event.target.matches('pre')) return;
	copyTextToClipboard(event.target.innerText)
	alertify.success("Copied to clipboard")
}, false);


// When a note is click select it
// or if shift it used link it
document.addEventListener('click', function (event) {
	if (!event.target.matches('a.note-item')) return;
	// console.log(event)

	// View the note if shift was not provided
	if(!event.shiftKey) {
		window.location.replace(event.target.innerText)
		return
	}

	// Link note if shift was provided
	selectedNote = getSelectedNote()
	if (selectedNote == null) {
		alertify.error("No selected note")
		return
	}

	uiLinkNote(selectedNote, event.target.innerText)
}, false);