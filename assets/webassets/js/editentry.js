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

const electron = require("electron");
const { ipcRenderer } = electron;
const database = firebase.database();
const swal = require("sweetalert");
var ename = document.querySelector(".name");
var eaddress = document.querySelector(".address");
var ephoneno = document.querySelector(".phoneno");
var einterest = document.querySelector(".interest");
var eamount = document.querySelector(".amount");
var etimegiven = document.querySelector(".timegiven");
var ref = database.ref("customerDetails");
var thatDate;
var key_fn;

document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  changeData();
});

document.getElementById("changebtn").addEventListener("click", () => {
  changeData();
});

ipcRenderer.on("showdetails", (e, k) => {
  if (navigator.onLine) {
    ref.on("value", item => {
      var customerDetails = item.val();
      var name = customerDetails[k].name;
      var address = customerDetails[k].address;
      var interest = customerDetails[k].interest;
      var phoneno = customerDetails[k].phoneno;
      var amount = customerDetails[k].amount;
      var timegiven = customerDetails[k].timegiven;
      thatDate = customerDetails[k].date;
      key_fn = k;
      ename.value = name;
      eaddress.value = address;
      einterest.value = interest;
      ephoneno.value = phoneno;
      eamount.value = amount;
      etimegiven.value = timegiven;
    });
  } else {
    swal("Internet Must Be Enabled", "Please enable Internet").then(value => {
      location.reload();
    });
  }
});

function changeData() {
  if (ename.value.length < 1) {
    swal("Name should not be empty.");
    return;
  }
  if (eaddress.value.length < 1) {
    swal("Address Should not be empty.");
    return;
  }
  if (einterest.value.length < 1) {
    swal("Interest should not be empty.");
    return;
  }
  if (ephoneno.value.length < 10) {
    swal("Phone no should be 10 Digit Long.");
    return;
  }
  if (ephoneno.value.length > 10) {
    swal("Phone no cannot be greater than 10 Digit.");
    return;
  }
  if (eamount.value.length < 1) {
    swal("Amount given should not be empty.");
    return;
  }
  if (etimegiven.value.length < 1) {
    swal("Time given cannot be Empty");
    return;
  }
  var data = {
    name: ename.value,
    address: eaddress.value,
    phoneno: ephoneno.value,
    interest: einterest.value,
    amount: eamount.value,
    date: thatDate,
    timegiven: etimegiven.value
  };
  var updates = {};
  updates["/" + key_fn] = data;
  ref.update(updates);
  ipcRenderer.send("addeditem");
}
