var express = require('express');
var serveStatic = require('serve-static');
var cors = require('cors');
var ip = require('ip');
var app = express();

var Vote = nuevaVotacion();
var currentClients = [];

console.log('Current vote id = ' + Vote['ID']);
setupExpress();

function setupExpress()
{
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({extended:false}));
  app.use(serveStatic('public/ftp'));



  // Router
  app.get('/getCurrentVoteID',function(req,res)
  {
    res.send(Vote['ID']);
  })
  app.get('/getCurrentVote', cors(), function(req,res)
  {
    res.send(JSON.stringify(Vote));
  });
  app.get('/nuevaVotacion',function(req,res){
    Vote = nuevaVotacion();
    logVoteStatus();
    res.send('Success');
  });
  app.post('/multiVotacion',function(req,res){
    console.log(req.body);
    Vote['aFavor']+=parseInt(req.body.aFavor);
    Vote['enContra']+=parseInt(req.body.enContra);
    Vote['abstenciones']+=parseInt(req.body.abstenciones);
    res.send('Success');

  });
  app.post('/registerUser',function(req,res)
  {
    console.log(req.body);
    var name = req.body.Nombre;
    var cantPaises = req.body.cantPaises
    if(currentClients.length>0)
    {
      if( !currentClients.find(function (cliente){
        if(cliente.Nombre === this.Nombre)
        {
          console.log("El cliente ya existe, actualizando cantPaises")
          cliente.cantPaises = this.cantPaises;
          return true;
        }
        else return false;
      },req.body))
      {
        currentClients.push(req.body);
      }
    }
    else{
      currentClients.push(req.body)
    }
    updateCantPaises();
    console.log("Clientes actuales:");
    console.log(currentClients);
    res.send('Success');
  });

  app.listen(3000, function(){
  	console.log('Server running at URL http://'+ ip.address() +':3000/');
  });
}

function logVoteStatus()
{
  console.log('ID: ' + Vote['ID']);
  console.log('A Favor: ' + Vote['aFavor']);
  console.log('En Contra: ' + Vote['enContra']);
  console.log('Abstenciones: ' + Vote['abstenciones']);
  console.log(currentClients);
}

function nuevaVotacion()
{
  // Random id
  var id = Math.round(Math.random() * Math.pow(10,4));
  // Get a new vote instance
  obj = createVotacion(id,getCantPaisesTotal(),0,0,0);
  return obj;
}

function getCantPaisesTotal()
{
  if(!currentClients || currentClients.length === 0 )
  {
    return 0;
  }
  else
  {
    var cantActual = 0;
    currentClients.forEach(function(clients)
    {
        cantActual += parseInt(clients.cantPaises);
    });
    console.log(cantActual);
    return cantActual;
  }
}

function updateCantPaises()
{
  Vote['cantPaises'] = parseInt(getCantPaisesTotal());
}

function createVotacion(id, cantPaises, aFavor, enContra, abstenciones)
{
  return {
    'ID':id,
    'cantPaises': cantPaises,
    'aFavor':aFavor,
    'enContra':enContra,
    'abstenciones':abstenciones
  };
}
