let validated = false;
//calls form and all functions after window is loaded
window.onload=function(){
   const form = document.getElementById('formSubmit');
   const inputs = Array.from(document.getElementsByTagName("input"));
   //shows mission details once page is loaded, before forms are submitted
   mission();
   form.addEventListener("click", function() {
      event.preventDefault();
      //makes sure fields are filled in appropriately
      isFilled(inputs);
      //if minimum criteria are successfully passed, adjusts status to reflect responses
      if (validated){
         adjustStatus(inputs);
      }
   }); 
}

//validates all fields are appropriately filled out
function isFilled(fields) {
   //variables used to set conditions for adjustStatus function to run
   let filled = false;
   let valid = false;
   //if all fields are filled by user, no alerts
   if (fields.every(input => input.value !== "")) {
      event.preventDefault();
      filled = true;
   // sets alert if a field is left blank
   } else {
      alert("All fields must be filled");
      event.preventDefault();
   }
   // if a field is not an expected value (string or number for appropriate field)
   // an alert is raised
   if (!isNaN(fields[0].value) || !isNaN(fields[1].value)|| isNaN(fields[2].value) || isNaN(fields[3].value)){
      alert("Enter valid name in Pilot or Co-pilot fields and/or a valid number in Fuel Level and Cargo Mass fields");
      event.preventDefault();
   } else {
      valid = true;
   }
   if(valid && filled){
      validated = true;
   }
};

// updates launch status based on user response to form. This includes edge cases 
// if user changes responses but still fails criteria or switches between failing criteria and
// successfully meeting criteria
function adjustStatus(response){
   const itemChecklist = document.getElementById('faultyItems');
   const finalStatus = document.getElementById('launchStatus');
   const statPilot = document.getElementById('pilotStatus');
   const statCoPilot = document.getElementById('copilotStatus');
   const statFuel = document.getElementById('fuelStatus');
   const statMass = document.getElementById('cargoStatus');
   //assume no launch if all fields are not correct or are blank for any reason
   itemChecklist.style.visibility = 'visible';
   finalStatus.innerHTML = "Shuttle is not ready for launch!";
   finalStatus.style.color = "red";
   //adjusts fuel response if failing criteria
   if(response[2].value < 10000 && response[3].value <= 10000){
      statFuel.innerHTML = "Fuel level low";
      statMass.innerHTML = "Cargo mass low enough for launch"
   } 
   //adjusts mass response if failing criteria
   if(response[3].value > 10000 && response[2].value >= 10000){
      statMass.innerHTML = "Thrust to mass ratio to low";
      statFuel.innerHTML = "Fuel level high enough for launch"
   } 
   //adjusts mass and fuel responses if failing criteria
   if(response[2].value < 10000 && response[3].value > 10000){
      statMass.innerHTML = "Thrust to mass ratio to low";
      statFuel.innerHTML = "Fuel level low";
   }
   //adjusts status to ready if all criteria successfully met
   if(response[2].value >= 10000 && response[3].value <= 10000){
      finalStatus.style.color = 'green';
      finalStatus.innerHTML = "Shuttle is ready for launch";
      statPilot.innerHTML = `Pilot ${response[0].value} Ready`;
      statCoPilot.innerHTML = `Pilot ${response[1].value} Ready`;
      itemChecklist.style.visibility = 'hidden';
      statFuel.innerHTML = "Fuel level high enough for launch";
      statMass.innerHTML = "Cargo mass low enough for launch"
   }
   //do not need to adjust pilot/copilot responses since they must be successfully
   //pass criteria to pass initial validation in isFilled
}

//fetches mission data using async function
async function mission() {
   const response = await fetch("https://handlers.education.launchcode.org/static/planets.json");
   const data = await response.json();
   //sets html location and randomizes json data collected
   const missionLoc = document.getElementById("missionTarget");
   let index = Math.floor(Math.random()*data.length);
   missionLoc.innerHTML = `<h2>Mission Destination</h2>
      <ol>
         <li>Name: ${data[index].name}</li>
         <li>Diameter: ${data[index].diameter}</li>
         <li>Star: ${data[index].star}</li>
         <li>Distance from Earth: ${data[index].distance}</li>
         <li>Number of Moons: ${data[index].moons}</li>
      </ol>
      <img src="${data[index].image}">
      `;
};