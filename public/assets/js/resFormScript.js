$(document).ready(function () {
	$('input[type=submit]').click(function () {
		$('input[type=submit]').toggleClass('red');
	});
});

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

function updateBookingsList() {
	fetch(`/reservations`)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			data.map(addRow);
		});
}

updateBookingsList();
