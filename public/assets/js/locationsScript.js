function addAllloc(location) {


	console.log("Adding all locations");

	$("#myloc").append(
		`
    <div>

       ${location.city}
	<div>
	<div>
	<a href="../pages/SingleLocation.html?city=${location.city}"> 
		<img src="${location.img}" style="width:100%"/> 
	</a>
	<div>

	 <div class="dividersolid wow fadeInDown"></div>  

	`
	);

}


function updateLocationsList() { //sends a request, gets the rsults, and then rewrites the table row by row
	console.log("sono nella update locations");
	fetch(`/locations`) //we draw again every time the UI, seems inefficient but it's not
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			data.map(addAllloc);
		});
}

function getSingleLocation() {
	fetch('/locations?city=${location.city}')
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			data.map(addloc);
		});
}

function addloc(location) {
	console.log("sono nella addloc");
}

function startup() {
	updateLocationsList();
}

startup();
