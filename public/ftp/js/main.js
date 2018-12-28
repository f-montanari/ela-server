var ctx = document.getElementById("myChart");
var endData = null;
var chartData = {
  labels:["A Favor", "En Contra", "Abstenciones"],
  datasets:[{
    label: '# Nº de votos',
    data: [0, 0, 0],
    backgroundColor: [
      'green',
      'red',
      'yellow'
    ],
    borderColor: [
      'black',
      'black',
      'black'
    ],
    borderWidth: 1
  }]
};

var myPieChart = new Chart(ctx,{
  type: 'pie',
  data: chartData,
  options: Chart.defaults.pie
});

fetchData(true);

function fetchData(recursion) {
  var fetchedData = null;
  fetch("http://"+window.location.hostname+":3000/getCurrentVote").then((response)=>{
    return response.json()}).then((jsonData) => {
      fetchedData = jsonData;
      if(recursion)
      {
        // Avoid recursion.
        setInterval(()=>{this.fetchData(false)},1000);
      }
      showData(fetchedData);
    });
}
function showData(finalData)
{
  endData = finalData;
  myPieChart.data.datasets[0].data[0] = endData.aFavor;
  myPieChart.data.datasets[0].data[1] = endData.enContra;
  myPieChart.data.datasets[0].data[2] = endData.abstenciones;
  myPieChart.update();
}
