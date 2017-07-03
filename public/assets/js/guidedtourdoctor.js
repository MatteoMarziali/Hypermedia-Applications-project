var doctorName;
var doctorDescription;
var doctorPosition;
var doctorImage;
var doctorLocation;
var doctorAge;
var doctorResponsible;
var doctorEmail;
var doctorService;
var gotoProfile;



$(window).ready(function () {   //jquery
    
    doctorName = $("#doctorname");
    doctorPosition = $("#doctorposition");
    doctorImage=$("#doctorimage");
    doctorLocation=$("#doctorlocation");
     doctorAge=$("#doctorage");
 doctorResponsible=$("#doctorresponsible");
 doctorEmail=$("#doctoremail");
 doctorService=$("#doctorservice");
 gotoProfile=$("#gotoprofile");
    
    
 
    getDoctor(getId());

});

function getId() {
    var query_string = {};
    var ciao = window.location.href;
  var query = window.location.search.substring(1);
    console.log("QueryString: "+ciao);
  var vars = ciao.split("?");
    
    var id = vars[vars.length-1];
    id = id.split("=");
    id = id[id.length-1];
    console.log("id: "+id);
    return id;
    
    
}



function getDoctor(id) {  //sends a request, gets the rsults, and then rewrites the table row by row
  fetch(`/doctors?start=${start}&limit=${count}&sort=${sortby}&id=${id}`)   //we draw again every time the UI, seems inefficient but it's not
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.map(addDoctorInfo);
    }).then(function(){
      console.log("finito aggiungere roba dottore");
  });
};



function addDoctorInfo(doctor) {    //it gave me a big problem if I called this function addRow, it probably had a conflict with the call in another js
  console.log("addRow nel doctospage.js");
  //let age = new Date().getFullYear() - doctor.date;   //getfullyear prende l'anno corrente della data corrente
  $("#prova").append(
    `
<div>
To make an appointment with one of our doctor use the form:

</div>

<div class="col-md-4">
									<div class="wow lightSpeedIn" data-wow-delay="0.1s">
										<div class="cta-btn">
											<a href="/pages/reservationForm.html" class="btn btn-skin btn-lg">Book an appoinment</a>
										</div>
									</div>
								</div>
                
                
    
`
  );

 
    
   doctorName.text(doctor.name);
    doctorPosition.text("Position: "+doctor.position);
     let age = new Date().getFullYear() - doctor.date;
    doctorAge.text("Age:"+age);
    
    doctorLocation.text(doctor.location);
    doctorLocation.attr("href","/pages/SingleLocation.html?name="+doctor.location);
    
    doctorEmail.text("Email: "+doctor.email);
    
    doctorService.text(doctor.service);
    doctorService.attr("href","/pages/singleservice.html?name="+doctor.service);
    
    
    
   doctorImage.attr("src","/assets/img/doctors/"+doctor.id+".jpg");
   
    gotoProfile.attr("href","/pages/singledoctor.html"+"?id="+doctor.id);

   if(doctor.responsible!=="-"){
	doctorResponsible.text(doctor.responsible);
    doctorResponsible.attr("href","/pages/singleservice.html?name="+doctor.responsible);
    }
    
    
}



