var serviceName;
var serviceDoctorId;
//TODO: ADD THE LOCATIONS
var serviceDescription;
var serviceImage;
var serviceImage2;
var serviceTitle;

$(window).ready(function(){
    serviceName = $("#servicename");
    serviceDoctorId = $("#servicedoctortid");
    serviceDescription = $("#servicedescription");
    serviceImage = $("#serviceimage");
    serviceImage2 = $("#serviceimg");
    serviceTitle = $("#servicetitle")
});

function insertDoctor(id){
    fetch(`/doctors?id=${id}`).then(function(response){
        return response.json();
    })
    .then(function(data){
        $("#doctorsNameDiv").append(`<a href="../pages/singledoctor.html?id=${id}">${data[0].name}</a>`);
    });
}

function insertLocations(name){
    fetch(`/serviceslocations?service=${name}`).then(function(response){
        return response.json();
    })
    .then(function(data){
        data.map(function(currentValue, index, array){
            console.log("Data: " + data);
            console.log("Index: " + index);
            console.log("Data[index]: " + data[index]);
            console.log("Data[index].location: " + data[index].location);
            $("#locations").append(`<li><a href="../pages/SingleLocation.html?city=${data[index].location}">${data[index].location}</a></li>`);  
        });
    });
}

function addSingleServiceInfo(service){

    $("#serviceimg").append(`<img src="${service.img}" style="width:100%"/> `);
    
    $("#servicetitle").append(`${service.name}`);
    
    
    $("#servicename").append(`<h1>${service.name}</h1>`);
    $("#servicedescription").append(`${service.description}`);
    
    $("#singleservice").append(
    	`  
     <div>
        <h2 class="h-bold wow pulse" data-wow-delay="0.1s">${service.name}</h2>
        <div id="servicedescription" class="wow fadeInUpBig" data-wow-delay="0.1s">${service.description}</div>
        
       	<div class="dividersolid wow fadeInDown"></div>  

     </div>
     <h4><strong>Important information:</strong></h4>

	 <div>
      <strong>Service:</strong> ${service.name}
	 <div>

	 <div id="doctorsNameDiv"> 
      <strong>Referring doctor:</strong>
	 </div>
	 <div>
      <strong>Locations where the service is delivered:</strong>
        <ul id="locations">

        </ul>
	 </div>

    <div id="prova" class="cbp-l-member-info">
        <br>

    <div id="ordercontainer" class="cbp-l-filters-alignLeft">
        <div id="responsib" data-filter="*" class="cbp-filter-item wow fadeInLeftBig"
			 data-wow-delay="0.2s"><span ><a href="/pages/doctorsinservice.html?service=${service.name}">Click to show all the doctors delivering this service</a></span> 
        </div>
    </div>
                        
    </div>
	`
    );
    insertDoctor(service.referring_doctor_id);
    insertLocations(service.name);
}



function getService(){
    console.log("Sono nella service");
    var query_string = {};
    var url = window.location.href;  //the entire url of the window
    var query = window.location.search.substring(1);  //it extracts the question mark
    console.log("QueryString: " + url);
    console.log("Query: " + query);
    var vars = url.split("?");
    
    var service = vars[vars.length - 1];
    service = service.split("=");
    service = service[service.length - 1]; //it should now have the name of the service
    return decodeURI(service);
}



function fetchService(){
    var service = getService();
    console.log("SONO NELLA FETCH E HO SERVICE = " + service);
    fetch(`/services?name=${service}`).then(
        function(response){
            return response.json();
        }
    )
    .then(function(data){
        data.map(addSingleServiceInfo); 
        console.log("Added service");
    })/*.then(fetch(`/serviceslocations?service=${service}`).then(
            function(response){
                return response.json();
            }
        ).then(function(data){
            data.map(addLocationListElement)
            console.log("Added locations");         
    }))*/;
}

fetchService();