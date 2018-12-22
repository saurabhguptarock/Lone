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

const database = firebase.database();
var ref = database.ref("customerDetails");
const electron = require("electron");
const { ipcRenderer } = electron;
var table = document.getElementsByTagName("tbody")[0];
var key_var = [];
const swal = require("sweetalert");
var alldates = [];

if (navigator.onLine) {
  ref.on("value", item => {
    var customerDetails = item.val();
    var keys = Object.keys(customerDetails);
    keys.forEach((k, i) => {
      var name = customerDetails[k].name;
      var address = customerDetails[k].address;
      var interest = customerDetails[k].interest;
      var phoneno = customerDetails[k].phoneno;
      var amount = customerDetails[k].amount;
      var dateObject = customerDetails[k].date;
      var timegiven = customerDetails[k].timegiven;
      key_var.push(k);
      alldates.push(dateObject);
      var newRow = table.insertRow(i);
      var cell1 = newRow.insertCell(0);
      var cell2 = newRow.insertCell(1);
      var cell3 = newRow.insertCell(2);
      var cell4 = newRow.insertCell(3);
      var cell5 = newRow.insertCell(4);
      var cell6 = newRow.insertCell(5);
      var cell7 = newRow.insertCell(6);
      var cell8 = newRow.insertCell(7);
      cell1.innerHTML = i + 1;
      cell2.innerHTML = name;
      cell3.innerHTML = address;
      cell4.innerHTML = phoneno;
      cell5.innerHTML = `${dateObject.dd}/${dateObject.mm}/${dateObject.yy} ${
        dateObject.hour
      }:${dateObject.min}`;
      cell6.innerHTML = interest;
      cell8.innerHTML = `${amount} <i class="fas fa-user-edit icon-edit"
     onclick="edit_entry(${i})"></i> 
    <i class="fas fa-trash-alt icon-del"
     onclick="delete_entry(${i})"></i>`;
      cell7.innerHTML = timegiven;
    });
    $("#myTable").DataTable();
    ipcRenderer.on("addeditem", () => {
      location.reload();
    });
    checkTime();
  });

  function edit_entry(i) {
    ipcRenderer.send("showdetails", key_var[i]);
  }
  function delete_entry(i) {
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        ref.on("value", item => {
          var customerDetails = item.val();
          var name = customerDetails[key_var[i]].name;
          swal(`${name} has been deleted!`, {
            icon: "success"
          }).then(value => {
            ref.child(key_var[i]).remove();
            ipcRenderer.send("deletedEntry");
            location.reload();
          });
        });
      }
    });
  }
  function checkTime() {
    for (let i = 0; i < key_var.length; i++) {
      var date2 = new Date();
      var date1 = new Date(
        `${alldates[i].dd}/${alldates[i].mm}/${alldates[i].yy}`
      );
      ref.on("value", item => {
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 300 * 365 * 24)) - 11;
        var customerDetails = item.val();
        var timeGiven = customerDetails[key_var[i]].timegiven;
        if (diffDays > timeGiven) {
          table.children.item(i).classList.add("tablecol");
          var tableid = document.querySelectorAll(".tablecol");
          tableid.item(i).style.backgroundColor = "red";
        }
      });
    }
  }
} else {
  swal("Internet Must Be Enabled", "Please enable Internet").then(value => {
    location.reload();
  });
}
