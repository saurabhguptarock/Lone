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
var currentdate = document.getElementById("currentdate");
const name = document.querySelector(".name");
const address = document.querySelector(".address");
const phoneno = document.querySelector(".phoneno");
const interest = document.querySelector(".interest");
const amount = document.querySelector(".amount");
const timegiven = document.querySelector(".timegiven");
var dateObject = {};
var date = new Date();
const swal = require("sweetalert");
var database = firebase.database();
var ref = database.ref("customerDetails");

document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  submitData();
});

dateObject.dd = date.getDate();
dateObject.mm = date.getMonth() + 1;
dateObject.yy = date.getFullYear();
dateObject.hour = date.getHours();
dateObject.min = date.getMinutes();

currentdate.value = `${dateObject.dd}/${dateObject.mm}/${dateObject.yy} ${
  dateObject.hour
}:${dateObject.min}`;
if (navigator.onLine) {
  function submitData() {
    if (name.value.length < 1) {
      swal("Name should not be empty.");
      return;
    }
    if (address.value.length < 1) {
      swal("Address Should not be empty.");
      return;
    }
    if (interest.value.length < 1) {
      swal("Interest should not be empty.");
      return;
    }
    if (phoneno.value.length < 10) {
      swal("Phone no should be 10 Digit Long.");
      return;
    }
    if (phoneno.value.length > 10) {
      swal("Phone no cannot be greater than 10 Digit.");
      return;
    }
    if (amount.value.length < 1) {
      swal("Amount given should not be empty.");
      return;
    }
    if (timegiven.value.length < 1) {
      swal("Time given cannot be Empty");
      return;
    }
    var data = {
      name: name.value,
      address: address.value,
      phoneno: phoneno.value,
      interest: interest.value,
      amount: amount.value,
      date: dateObject,
      timegiven: timegiven.value
    };
    ref.push(data);
    ipcRenderer.send("addeditem");
    clearEntry();
  }
} else {
  swal("Internet Must Be Enabled", "Please enable Internet").then(value => {
    location.reload();
  });
}

function clearEntry() {
  name.value = null;
  address.value = null;
  phoneno.value = null;
  interest.value = null;
  amount.value = null;
  timegiven.value = null;
}
