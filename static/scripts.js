
/* simple scripts file for Themes.guide Bootstrap 4 theme templates */

// init Bootstrap tooltips & popovers

/* copy demo sources to clipboard */
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
  return false;
}


function settingsSubmit() {
    url = document.getElementById("settings-github-url").value
    dir = document.getElementById("settings-github-directory").value

    if (url == "" || url == null || url == undefined) {
        alertify.alert("Error", "Github URL is not set", function(){});
        return
    }

    
}
