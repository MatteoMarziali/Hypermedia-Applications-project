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
		.then(response => {
			if (response.error === "400") {
				showResponse("KO");
			} else {
				showResponse("OK");
			}
		});

	console.log("ho eseguito la post");
	alert("Request sent successfully!");
}
