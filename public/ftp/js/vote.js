var maxVotes = 0;
var currentVoteID;
var checkID;
var voted = false;
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

  // Avoid multiple instances of this setInterval (even if it's just onload).
  if(!checkID)
  {
    checkID = window.setInterval(() => {
      fetch("http://"+window.location.hostname+":3000/getCurrentVoteID").then((response)=>{
        return response.json()}).then((jsonData) => {
          updateID(jsonData)
        });
    }, 500);
  }
})

function updateID(jsonData)
{
    if(!currentVoteID)
    {
      currentVoteID = jsonData.ID;
      return;
    }

    if(currentVoteID != jsonData.ID)
    {
      // We're on a different votation, re-enable vote button.
      currentVoteID = jsonData.ID;
      document.querySelector('#enviarVoto').disabled = false;
    }
}

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
  var notification = document.querySelector('.mdl-js-snackbar');

  if(name === "")
  {
    dialog.showModal();
    return false;
  }

  if((aFavor+enContra+abstenciones) != maxVotes)
  {
    notification.MaterialSnackbar.showSnackbar(
    {
      message: 'El número de votos no corresponde con el número de votantes!'
    });
    return false;
  }

  notification.MaterialSnackbar.showSnackbar(
  {
    message: 'El voto fue enviado correctamente.'
  });
  
  document.querySelector('#enviarVoto').disabled = true;
  return true;
}
