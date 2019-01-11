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
  dialog.querySelector('#settingsForm').submit();  
  dialog.close();
});
