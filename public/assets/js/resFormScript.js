$(document).ready(function () {
	$('input[type=submit]').click(function () {
		$('input[type=submit]').toggleClass('red');
	});
});

//this method returns the fields insert for each person (x) that has filled the form 
function formDataAsJSON(formData) {
	let x = {};
	for (var pair of formData.entries()) {
		x[pair[0]] = pair[1];
	}
	console.log(pair[0]);
	console.log(pair[1]);
	console.log(x);
	return JSON.stringify(x);
}

//This is the method to make the post of the data filled in the form and show them on screen by calling 
//UpdateBookingsList()
function clickSubmitData() {
	let headers = new Headers();
	headers.set("Content-Type", "application/json");

	let formdata = formDataAsJSON(new FormData(
		document.getElementById("resform")
	));

	fetch("/reservations", {
			method: "POST",
			body: formdata,
			headers: headers
		})
		.then(response => response.json())


	updateBookingsList();
	console.log("ho eseguito la post");
	alert("Request sent successfully!");
}

//This function fills the table of bookings taking updated info from the database through the function 
// updateBookingsList() which is the caller
function addRow(booking) {
	console.log("Adding row");
	$("#myrows").append(
		`
    <tr>
       <td>${booking.id}</td>
       <td>${booking.name}</td>
    </ tr>
`
	);
}

//
function updateBookingsList() {
	fetch(`/reservations`)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			data.map(addRow);
		});
}
