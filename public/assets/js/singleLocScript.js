function addLocFields(location) {

	$("#loctitle").append(`${location.city}`);

	$("#loc1").append(`${location.city}`);
	$("#loc2").append(`${location.description}`);

	$("#myloc").append(
		`

	<div> 
		<img src="${location.img}" style="width:100%"/> 
	</div>

	 <div class="dividersolid wow fadeInDown"></div>  

	 <div>
      Location: ${location.city}
	 <div>

	<div> 
      Address: ${location.address}
	 <div>
	 <div>
      Cap: ${location.cap}
	 <div>
	 <div>
      Phone: ${location.phone}
	 <div>
	<div>
		<a href="/pages/servicesgroup.html?location=${location.city}"> 
			<strong>
			Click here to find the services provided in this location
			</strong>
		</a>
	</div>
	 <div>
	 Check out were you can find us!
	 </div>
	 <div>
		<iframe src="${location.map}" width="600" height="400" frameborder="0" style="width:100%" ></iframe>
	</div>

	`
	);
}

function getLoc() {
	var query_string = {};
	var url = window.location.href;
	var query = window.location.search.substring(1);
	console.log("QueryString: " + url);
	var vars = url.split("?");

	var loc = vars[vars.length - 1];
	loc = loc.split("=");
	loc = loc[loc.length - 1];

	return loc;


}

function fetchLocation() { //sends a request, gets the rsults, and then rewrites the table row by row
	var locc = getLoc();
	//console.log("id del dottore da fetchare:"+docId);

	fetch(`/locations?city=${locc}`) //we draw again every time the UI, seems inefficient but it's not

		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			data.map(addLocFields);
			console.log("fetched location");
		});
}

function startUp() { //hides all the data that should not be presented

	fetchLocation();
}


startUp();
