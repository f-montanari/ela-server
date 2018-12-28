var express = require('express');
var serveStatic = require('serve-static');
var cors = require('cors');
var ip = require('ip');
var app = express();

var Vote = nuevaVotacion();
console.log('Current vote id = ' + Vote['ID']);
setupExpress();

function setupExpress()
{
  app.use(cors());
  app.use(serveStatic('public/ftp'));
  app.get('/getCurrentVoteID',function(req,res)
  {
    res.send(Vote['ID']);
  })
  app.get('/getCurrentVote', cors(), function(req,res)
  {
    res.send(JSON.stringify(Vote));
  });
  app.get('/addAFavor',function(req,res)
  {
    Vote['aFavor']+=1;
    logVoteStatus();
    res.send('Success');
  });
  app.get('/addEnContra',function(req,res)
  {
    Vote['enContra'] +=1;
    logVoteStatus();
    res.send('Success');
  });
  app.get('/addAbstencion',function(req,res)
  {
    Vote['abstenciones'] +=1;
    logVoteStatus();
    res.send('Success');
  });
  app.get('/nuevaVotacion',function(req,res){
    Vote = nuevaVotacion();
    logVoteStatus();
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
}

function nuevaVotacion()
{
  // Random id
  var id = Math.round(Math.random() * Math.pow(10,4));
  // Get a new vote instance
  obj = {
    'ID':id,
    'aFavor':0,
    'enContra':0,
    'abstenciones':0
  };
  return obj;
}
