const PASSWORD = "Pr3f3cts2026";

let currentUser = "";
let isAdmin = false;

let duties = JSON.parse(localStorage.getItem("duties")) || {
  "Toilet Duty": {capacity: 2, people: []},
  "Hallways Duty": {capacity: 5, people: []}
};

function login(){
  const name = document.getElementById("name").value.trim();
  const pass = document.getElementById("password").value;

  if(name.toLowerCase() === "admin"){
    if(pass === "HeadBoy" || pass === "HeadGirl"){
      currentUser = "Admin";
      isAdmin = true;
      start();
      return;
    }
  }

  if(pass === PASSWORD && name){
    currentUser = name;
    start();
  } else {
    alert("Wrong login details");
  }
}

function start(){
  document.getElementById("loginCard").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  document.getElementById("welcome").innerText = "Welcome " + currentUser;

  if(isAdmin){
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("roleBadge").innerHTML = "<b>ADMIN MODE</b>";
  }

  render();
}

function logout(){
  location.reload();
}

function addDuty(){
  const name = document.getElementById("dutyName").value;
  const cap = parseInt(document.getElementById("dutyCap").value);

  if(!name || !cap) return;

  duties[name] = {capacity: cap, people: []};
  save();
  render();
}

function assign(){
  const duty = document.getElementById("selectDuty").value;
  const name = document.getElementById("assignName").value;

  duties[duty].people.push(name);
  save();
  render();
}

function removePrefect(){
  const duty = document.getElementById("removeDuty").value;
  const name = document.getElementById("removeName").value;

  duties[duty].people = duties[duty].people.filter(p => p !== name);
  save();
  render();
}

function deleteDuty(){
  const duty = document.getElementById("deleteDuty").value;
  delete duties[duty];
  save();
  render();
}

function save(){
  localStorage.setItem("duties", JSON.stringify(duties));
}

function render(){

  let sel = document.getElementById("selectDuty");
  let rem = document.getElementById("removeDuty");
  let del = document.getElementById("deleteDuty");

  sel.innerHTML = "";
  rem.innerHTML = "";
  del.innerHTML = "";

  Object.keys(duties).forEach(d=>{
    sel.innerHTML += `<option>${d}</option>`;
    rem.innerHTML += `<option>${d}</option>`;
    del.innerHTML += `<option>${d}</option>`;
  });

  let all = "";

  Object.keys(duties).forEach(d=>{
    all += `
      <div class="dutyBox">
        <b>${d}</b><br>
        ${duties[d].people.join(", ") || "No assignments"}
        <br><small>${duties[d].people.length}/${duties[d].capacity}</small>
      </div>
    `;
  });

  document.getElementById("allDuties").innerHTML = all;

  let userView = "";

  Object.keys(duties).forEach(d=>{
    if(duties[d].people.includes(currentUser)){
      userView += `<div class="dutyBox"><b>${d}</b></div>`;
    }
  });

  document.getElementById("userDuties").innerHTML =
    userView || "No duties assigned";
}