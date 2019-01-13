var maxVotes = 0;

// Settings dialog setup.
var dialog = document.querySelector('dialog');
var showDialogButton = document.querySelector('#show-dialog');
if (! dialog.showModal) {
  dialogPolyfill.registerDialog(dialog);
}
showDialogButton.addEventListener('click', function() {
  dialog.showModal();
});
dialog.querySelector('.close').addEventListener('click', function() {
  dialog.close();
});
dialog.querySelector('.submit').addEventListener('click', function(){
  var nameField = document.querySelector('#nombreActual');
  nameField.value = dialog.querySelector('#Nombre').value;
  maxVotes = dialog.querySelector("#cantPaises").value;
  dialog.querySelector('#settingsForm').submit();
  dialog.close();
});

window.addEventListener('load', function () {
  // Show config when first loaded.
  dialog.showModal();
})

function hideDrawer()
{
  document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer();
}

function validateForm()
{
  var name = parseInt(document.forms["VoteData"]["Nombre"].value);
  var aFavor = parseInt(document.forms["VoteData"]["aFavor"].value);
  var enContra = parseInt(document.forms["VoteData"]["enContra"].value);
  var abstenciones = parseInt(document.forms["VoteData"]["abstenciones"].value);

  if(name === "")
  {
    dialog.showModal();
    return false;
  }

  if((aFavor+enContra+abstenciones) != maxVotes)
  {
    var notification = document.querySelector('.mdl-js-snackbar');
    notification.MaterialSnackbar.showSnackbar(
    {
      message: 'El número de votos no corresponde con el número de votantes!'
    }
    );
      return false;
  }
}
