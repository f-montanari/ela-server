var express = require('express');
var serveStatic = require('serve-static');
var cors = require('cors');
var ip = require('ip');
var fs = require('fs');
var app = express();

var Vote = nuevaVotacion();
var currentClients = [];

console.log('Current vote id = ' + Vote['ID']);
setupExpress();

fs.access('voteResults.csv', fs.constants.F_OK, (err) => {
  fs.appendFile('voteResults.csv',"A Favor, En Contra, Abstenciones, Resultado\n", (err) => {
    if (err) { throw err; };
    console.log('El archivo voteResults.csv fue creado satisfactoriamente');
  });
});

function setupExpress()
{
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({extended:false}));
  app.use(serveStatic('public/ftp'));
  
  // Router
  app.get('/getCurrentVoteID',function(req,res)
  {
    var obj = { 'ID' : Vote['ID']};
    res.send(JSON.stringify(obj));
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
    for (var i = 0; i < currentClients.length; i++) {
      if(currentClients[i].Nombre === req.body.Nombre)
      {
        // We found the client, did he vote?
        if(!currentClients[i].voted)
        {
          Vote['aFavor']+=parseInt(req.body.aFavor);
          Vote['enContra']+=parseInt(req.body.enContra);
          Vote['abstenciones']+=parseInt(req.body.abstenciones);
          currentClients[i].voted = true;
          checkVoteStatus();
        }
        break;
      }
    }

    res.send('Success');

  });
  app.post('/registerUser',function(req,res)
  {
    registerUser(req,res);
  });

  app.get('/getUserStatus',function(req,res)
  {
    res.send(JSON.stringify(currentClients));
  });

  app.get('/resetClients', function(req,res)
  {
    currentClients = [];
    res.send("Success");
  });

  app.listen(3000, function(){
  	console.log('Servidor funcionando en URL http://'+ ip.address() +':3000/');
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

  resetClientVoteStatus();

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

function registerUser(req, res)
{
  console.log(req.body);
  var name = req.body.Nombre;
  var cantPaises = req.body.cantPaises;
  var user = {
    'Nombre':name,
    'cantPaises':cantPaises,
    'voted':false
  };
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
      currentClients.push(user);
    }
  }
  else{
    currentClients.push(user)
  }
  updateCantPaises();
  console.log("Clientes actuales:");
  console.log(currentClients);
  res.send('Success');
}

function resetClientVoteStatus()
{
  if(!currentClients)
  {
    // isn't initialized yet, return.
    return;
  }
  for (var i = 0; i < currentClients.length; i++) {
    currentClients[i].voted = false;
  }
}

function checkVoteStatus()
{
  var voted = 0;
  for (var i = 0; i < currentClients.length; i++) {
    if (currentClients[i].voted)
    {
      voted +=1;
    }
  }
  if (currentClients.length === voted)
  {
    writeVoteResults();
  }
}

function voteToCsv()
{
  return "" + Vote['aFavor'] + "," + Vote['enContra'] + "," + Vote['abstenciones'] + "," + decideResult() + "\n";
}

function writeVoteResults()
{
  fs.appendFile('voteResults.csv', voteToCsv(), (err) => {
    if (err) { throw err; };
    console.log('Se ha actualizado el historial de votos satisfactoriamente');
  });
}

function decideResult()
{
  var result = "";

  if(Vote['aFavor'] > Vote['enContra'] && Vote['aFavor'] > Vote['abstenciones'])
  {
    result = "Aprobada";
  }
  else if(Vote['enContra'] > Vote['aFavor'] && Vote['enContra'] > Vote['abstenciones'])
  {
    result = "Reprobada";
  }
  else if(Vote['abstenciones'] > Vote['aFavor'] && Vote['abstenciones'] > Vote['enContra'])
  {
    result = "Mayoría de Abstenciones";
  }
  else if(Vote['aFavor'] == Vote['enContra'])
  {
    result = "Empate";
  }
  else
  {
    result = "Indefinido"
  }
  return result;
}
