/*
*-------------------------------------------------------------------------------------------------------------------------
*   The script to get all Locations and with a link on the image, when a location is clicked, 
    the link with the query string containing information about which location we chose is opened
    displaying all doctors working in that location
   
*/

function addLocation(location) {


	console.log("Adding all locations");

	$("#loc").append(
		`
    <div class="floating-box col-lg-4 col-md-4 col-sm-6 col-xs-12 col-xxs-12" href="/pages/doctorsbylocationgroup.html?location=${location.city}">
    <div>
       ${location.city}
	<div>

	<a href="/pages/doctorsbylocationgroup.html?location=${location.city}"> 
		<img src="${location.img}"  style="width:100%" /> 
	</a>
</div>

	 

	`
	);

}


function loadLocations() { //sends a request, gets the rsults, and then rewrites the table row by row
	
	fetch(`/locations`) //we draw again every time the UI, seems inefficient but it's not
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			data.map(addLocation);
		});
}


function startUp() {
	loadLocations();
}

startUp();