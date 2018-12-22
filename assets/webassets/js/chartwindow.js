(function() {
  var config = {
    apiKey: "AIzaSyCn4BB_vF3RGD94YTXVWvH_IYI1SRgtY1Q",
    authDomain: "loan-managing.firebaseapp.com",
    databaseURL: "https://loan-managing.firebaseio.com",
    projectId: "loan-managing",
    storageBucket: "",
    messagingSenderId: "594006079124"
  };
  firebase.initializeApp(config);
})();

const swal = require("sweetalert");
const database = firebase.database();
var ref = database.ref("customerDetails");
var topamount = [];
var newarray = [];
var namearray = [];
var newnamearray = [];
var newarraytest = [];
var myChart = document.getElementById("myChart").getContext("2d");
const electron = require("electron");
const { ipcRenderer } = electron;

Chart.defaults.global.defaultFontSize = 12;
Chart.defaults.global.defaultFontColor = "#777";

if (navigator.onLine) {
  ref.on("value", item => {
    var customerDetails = item.val();
    var keys = Object.keys(customerDetails);
    keys.forEach(k => {
      var name = customerDetails[k].name;
      var amount = customerDetails[k].amount;
      topamount.push(amount);
      namearray.push(name);
    });
    topamount.sort((a, b) => {
      return b - a;
    });

    topamount.forEach(val => {
      keys.forEach(k => {
        var name = customerDetails[k].name;
        var amount = customerDetails[k].amount;
        if (val === amount) {
          newarraytest.push(name);
        }
      });
    });
    if (keys.length >= 10) {
      for (let i = 0; i < 10; i++) {
        newarray.push(topamount[i]);
        newnamearray.push(newarraytest[i]);
      }
    }
    let topamountChart = new Chart(myChart, {
      type: "bar",
      data: {
        labels: newnamearray,
        datasets: [
          {
            label: "Amount Given To Customer",
            data: newarray,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(85, 88, 255, 0.6)",
              "rgba(75, 192, 2, 0.6)",
              "rgba(120, 210, 132, 0.6)",
              "rgba(200, 190, 132, 0.6)"
            ],
            borderWidth: 1,
            borderColor: "#777",
            hoverBorderWidth: 2,
            hoverBorderColor: "#000"
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Top 10 Highest Amount Given To Customers",
          fontSize: 15
        },
        legend: {
          display: false
        }
      }
    });
    ipcRenderer.on("addeditem", () => {
      location.reload();
    });
  });
} else {
  swal("Internet Must Be Enabled", "Please enable Internet").then(value => {
    location.reload();
  });
}
