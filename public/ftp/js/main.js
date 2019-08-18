var lblAFavor = document.getElementById("lblAFavor");
var lblEnContra = document.getElementById("lblEnContra");

// Code to setup pie chart.
var ctx = document.getElementById("myChart");
var finalData = null;
var chartData = {
  labels:["A Favor", "En Contra", "Abstenciones"],
  datasets:[{
    label: '# Nº de votos',
    data: [0, 0, 0],
    backgroundColor: [
      '#72C740',
      '#DD0033',
      '#E4D549'
    ],
    borderColor: [
      'rgba(0,0,0,0.2)',
      'rgba(0,0,0,0.2)',
      'rgba(0,0,0,0.2)'
    ],
    borderWidth: 1
  }]
};

var myPieChart = new Chart(ctx,{
  type: 'pie',
  data: chartData,
  options: {
    responsive:true,
    aspectRatio:1,
    animation: {
      duration:500
    }
  }
});

document.querySelector('#newVote').addEventListener('mousedown', () =>{
  isNewVote = true;
});

fetchData(true);

// This function periodically gets data from server every second.
function fetchData(recursion) {
  var fetchedData = null;
  fetch("http://"+window.location.hostname+":3000/getUserStatus").then((response)=>{
      return response.json()}).then((jsonData) => {
          showUsers(jsonData);
    });
  fetch("http://"+window.location.hostname+":3000/getCurrentVote").then((response)=>{
    return response.json()}).then((jsonData) => {
      fetchedData = jsonData;
      if(recursion)
      {
        // Avoid recursion.
        setInterval(()=>{this.fetchData(false)},500);
      }
      showData(fetchedData);
    });
}

var readyToShowVote = false;
var isNewVote = true;

// Update pie chart dataset.
function showData(finalData)
{
  if(readyToShowVote === true || isNewVote === true)
  {
    // Update pie chart
    myPieChart.data.datasets[0].data[0] = finalData.aFavor;
    myPieChart.data.datasets[0].data[1] = finalData.enContra;
    myPieChart.data.datasets[0].data[2] = finalData.abstenciones;
    myPieChart.update();

    // Update labels
    lblAFavor.innerHTML = finalData.aFavor;
    lblEnContra.innerHTML = finalData.enContra;

    readyToShowVote = false;
    isNewVote = false;
  }
  document.querySelector('.cantTotalPaises').innerHTML = finalData.cantPaises;
}

function showUsers(data)
{
  var votedCount = 0;
  // Clear list
  document.querySelector('.clientList').innerHTML="";

  // Add elements
  for(var i = 0;i<data.length;i++)
  {
      addElement(data[i].Nombre, data[i].voted);
      if(data[i].voted)
      {
        votedCount+=1;
      }
  }

  // Check if everyone's voted yet
  if(votedCount === data.length)
  {
    readyToShowVote = true;
  }
  else
  {
    readyToShowVote = false;
  }
}

function updateChart()
{
  myPieChart.updateChart();
}

function addElement(nombre, ready)
{
  var node = document.createElement("li");
  var name = document.createTextNode(nombre);
  node.appendChild(name);
  node.classList.add("mdl-list__item");
  if(ready)
  {
    node.classList.add("ready");
  }
  else
  {
    node.classList.add("notReady");
  }
  document.getElementById('clientList').appendChild(node);
}
