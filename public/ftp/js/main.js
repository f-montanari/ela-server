// Code to setup pie chart.
var ctx = document.getElementById("myChart");
var endData = null;
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

fetchData(true);

// This function periodically gets data from server every second.
function fetchData(recursion) {
  var fetchedData = null;
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
    fetch("http://"+window.location.hostname+":3000/getUserStatus").then((response)=>{
      return response.json()}).then((jsonData) => {
          showUsers(jsonData);
    });
}

// Update pie chart dataset.
function showData(finalData)
{
  endData = finalData;
  myPieChart.data.datasets[0].data[0] = endData.aFavor;
  myPieChart.data.datasets[0].data[1] = endData.enContra;
  myPieChart.data.datasets[0].data[2] = endData.abstenciones;  
  myPieChart.update();
  document.querySelector('.cantTotalPaises').innerHTML = endData.cantPaises;
}

var cachedData;

function showUsers(data)
{
  // Clear list
  document.querySelector('.clientList').innerHTML="";
  // Add elements
  for(var i = 0;i<data.length;i++)
  {
      addElement(data[i].Nombre, data[i].voted);
  }
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
