console.log('Info getting started');
window.setInterval(function(){
  var win = document.getElementById('data');
  var info = win.contentDocument.body.innerHTML;
  try
  {
  var data = JSON.parse(info);
  console.log(JSON.stringify(data));
  document.getElementById('aFavor').innerHTML = data['aFavor'];
  document.getElementById('enContra').innerHTML = data['enContra'];
  document.getElementById('abstenciones').innerHTML = data['abstenciones'];
  win.src = win.src;
  }
  catch(e)
  {
  return;
  }
},300);
