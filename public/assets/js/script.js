/* eslint-env browser */
console.log("# Starting up the application");

function clearTable() {
	$("#myrows").find("tr").remove();

}

function addRow(doctor) {
	console.log("Adding row");
	let age = new Date().getFullYear() - doctor.date; //getfullyear prende l'anno corrente della data corrente
	$("#myrows").append(
		`
    <tr>
       <td>${doctor.id}</td>
       <td>${doctor.name}</td>
       <td>${doctor.sex}</td>
       <td>${age}</td>
       <td>${doctor.phone}</td>
       <td>${doctor.email}</td>
       <td>${doctor.location}</td>
       <td>${doctor.area}</td>
       <td>${doctor.service}</td>
       <td><button onclick="deleteDoctor(${doctor.id})">X</button> </td>  //aggiunto per cancellare
    </ tr>
`
	);
}

function addRowloc(location) {


	console.log("Adding row");

	$("#myrowsloc").append(
		`
    <tr>
	 
       <td>${location.id}</td>
       <td>${location.city}</td>
       <td>${location.address}</td>
       <td>${location.cap}</td>
       <td>${location.phone}</td>
	   <td>${location.service1}</td>
	   <td>${location.service2}</td>
       <td>${location.service3}</td>
       <td>${location.service4}</td>
       <td>${location.service5}</td>
	   <td>${location.description}</td>
 
	</tr>
	`
	);

}





function deleteDoctor(id) { //funzione per cancellare doctors
	let idn = parseInt(id);
	fetch('/doctors/${idn}', {
			method: "DELETE"
		}).then(response => response.json())
		.then(response => {
			if (response.error === "400") {
				showResponse("KO");
			} else {
				showResponse("OK");

			}
		});
}

function deleteDoctor(id) {
	let idn = parseInt(id);
	fetch(`/doctors/${idn}`, {
			method: "DELETE"
		})
		.then(response => response.json())
		.then(response => {
			if (response.error === "400") {
				showResponse("KO");
			} else {
				showResponse("OK");
				updateDoctorsList();
			}
		});
}

function clickAddDoctor() {
	/* Disable button and show dialog for inserting doctor */
	$("#addDoctorButton").hide();
	$("#addDoctorFormDiv").show();
}

function showResponse(type /* OK, KO*/ ) { //manages all the actions when an answer comes back from the server
	$("#addDoctorFormDiv").hide();
	$(`#responseData${type}`).show();
	setTimeout(
		() => {
			$(`#responseData${type}`).hide();
			$("#addDoctorButton").show();
			updateDoctorsList();
			updateLocationsList();
		},
		2000
	);
}


window.showResponse = showResponse;

function formDataAsJSON(formData) {
	let x = {};
	for (var pair of formData.entries()) {
		x[pair[0]] = pair[1];
	}
	return JSON.stringify(x);
}

function clickSubmitDoctorData() {
	let headers = new Headers();
	headers.set("Content-Type", "application/json");

	let formdata = formDataAsJSON(new FormData(
		document.getElementById("adddoctorform")
	));

	fetch("/doctors", {
			method: "POST",
			body: formdata,
			headers: headers
		})
		.then(response => response.json())
		.then(response => {
			if (response.error === "400") {
				showResponse("KO");
			} else {
				showResponse("OK");
			}
		});
}

function clickCancelDoctorSubmit() {
	$("#addDoctorButton").show();
	$("#addDoctorFormDiv").hide();
}

/* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */

let start = 0;
let count = 10;
let sortby = "none"; /* Can be none, "+age", "-age"*/ //criteria for sorting, string variable

function setSort(x) { //these 3 functions are connected to the event of the buttons
	sortby = x;
	updateDoctorsList(); //they then invoke updatedoctorslist, that is meant to access the doctors on the server with the current criteria, the fetch..
}

function nextPage() {
	start = start + count;
	updateDoctorsList();
}

function previousPage() {
	if (start >= count) {
		start = start - count;
		updateDoctorsList();
	}
}

function updateDoctorsList() { //sends a request, gets the rsults, and then rewrites the table row by row
	fetch(`/doctors?start=${start}&limit=${count}&sort=${sortby}`) //we draw again every time the UI, seems inefficient but it's not
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			clearTable();
			data.map(addRow);
		});
}

function updateLocationsList() { //sends a request, gets the rsults, and then rewrites the table row by row
	console.log("sono nella update locations");
	fetch(`/locations?start=${start}&limit=${count}&sort=${sortby}`) //we draw again every time the UI, seems inefficient but it's not
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			clearTable();
			data.map(addRowloc);
		});
}


function startup() { //hides all the data that should not be presented
	$(`#responseDataOK`).hide();
	$(`#responseDataKO`).hide();
	$("#addDoctorFormDiv").hide();
	updateDoctorsList();
	updateLocationsList();
}

function showTextField() {
	$('#selectLocation').show();
}

startup();
