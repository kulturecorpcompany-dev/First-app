const PASSWORD = "Pr3f3cts2026";

let currentUser = "";
let isAdmin = false;

let duties = JSON.parse(localStorage.getItem("duties")) || {};
let requests = JSON.parse(localStorage.getItem("requests")) || [];

const prefects = [
  "Leeroy","Xola","Siya","Vuyo","Caleb","Akhanyile",
  "Bok","Liyema","Leeshay","Amy","Tania","Lumena",
  "Shawn","Sameer","Inga","Lizalise","Kamva","Karley-leigh"
];

function save(){
  localStorage.setItem("duties", JSON.stringify(duties));
  localStorage.setItem("requests", JSON.stringify(requests));
}

function login(){
  const name = document.getElementById("name").value;
  const pass = document.getElementById("password").value;

  if(name.toLowerCase() === "admin" && pass === "HeadBoy"){
    isAdmin = true;
    currentUser = "Admin";
  }
  else if(pass === PASSWORD){
    currentUser = name;
  } else {
    alert("Wrong login");
    return;
  }

  start();
}

function start(){
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  document.getElementById("welcome").innerText = "Welcome " + currentUser;

  if(isAdmin){
    document.getElementById("adminPanel").style.display = "block";
  }

  sel.innerHTML += `<option value="${d}">${d}</option>`;
  loadDropdowns();
  render();
}

function logout(){
  location.reload();
}

function createDuty(){
  const name = document.getElementById("dutyName").value;
  if(!name) return;

  duties[name] = [];
  save();
  render();
  loadDropdowns();
}

function assignDuty(){
  const duty = document.getElementById("dutySelect").value;
  const person = document.getElementById("prefectSelect").value;

  requests.push({
    duty,
    person,
    status: "pending"
  });

  save();
  render();
}

function forceAssign(){
  const duty = document.getElementById("forceDuty").value;
  const person = document.getElementById("forcePrefect").value;

  duties[duty].push(person);
  save();
  render();
}

function respond(index, accept){
  let req = requests[index];

  if(accept){
    duties[req.duty].push(req.person);
    req.status = "accepted";
  } else {
    req.status = "declined";
  }

  save();
  render();
}

function assign(){
  const duty = document.getElementById("selectDuty").value;
  const name = document.getElementById("assignName").value;

  if(!name || !duty) return;

  // Prevent duplicate inside SAME duty only
  if(duties[duty].people.includes(name)){
    alert("Already assigned to this duty");
    return;
  }

  // Capacity check still useful
  if(duties[duty].people.length >= duties[duty].capacity){
    alert("Duty is full");
    return;
  }

  duties[duty].people.push(name);
  save();
  render();
}

function loadDropdowns(){
  let d1 = document.getElementById("dutySelect");
  let d2 = document.getElementById("forceDuty");
  let p1 = document.getElementById("prefectSelect");
  let p2 = document.getElementById("forcePrefect");

  d1.innerHTML = d2.innerHTML = "";
  p1.innerHTML = p2.innerHTML = "";

  Object.keys(duties).forEach(d=>{
    d1.innerHTML += `<option>${d}</option>`;
    d2.innerHTML += `<option>${d}</option>`;
  });

  prefects.forEach(p=>{
    p1.innerHTML += `<option>${p}</option>`;
    p2.innerHTML += `<option>${p}</option>`;
  });
}

function render(){

  let all = "";

  Object.keys(duties).forEach(d=>{
    all += `
      <div class="dutyBox">
        <b>${d}</b><br>
        ${duties[d].join(", ") || "No assignments"}
      </div>
    `;
  });

  document.getElementById("allDuties").innerHTML = all;

  let userView = "";

  Object.keys(duties).forEach(d=>{
    if(duties[d].includes(currentUser)){
      userView += `<div class="dutyBox"><b>${d}</b></div>`;
    }
  });

  document.getElementById("userDuties").innerHTML =
    userView || "No duties assigned";

  let pending = "";

  requests.forEach((r,i)=>{
    if(r.status === "pending"){
      pending += `
        <div class="dutyBox">
          ${r.person} → ${r.duty}
          <br>
          <button onclick="respond(${i}, true)">Accept</button>
          <button onclick="respond(${i}, false)">Decline</button>
        </div>
      `;
    }
  });

  document.getElementById("pendingList").innerHTML = pending;
}