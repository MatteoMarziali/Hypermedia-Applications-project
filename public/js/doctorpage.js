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


//variables that are storing the element

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
    
    
    
    
    //console.log("ciao");
    //console.log("Doctor id: "+URL.id);
    //console.log(HREF);
   //var idd=
//console.log("idd= "+getId());
    var iddd = getId();
    getDoctor(iddd);
    //assigning variables to containers in html
    
    //storing the doctor fullname and everything to use later on

    //doctorName.text(getId());



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


                
                
    
`
  );

 
    
   doctorName.text(doctor.name);
    doctorPosition.text("Position: "+doctor.position);
     let age = new Date().getFullYear() - doctor.date;
    doctorAge.text("Age:"+age);
    doctorLocation.text("Location: "+doctor.location);
    doctorEmail.text("Email: "+doctor.email);
    doctorService.text("Service: "+doctor.service);
    
   doctorImage.attr("src","img/team/"+doctor.id+".jpg");
   
    gotoProfile.attr("href","../singledoctor.html"+"?id="+doctor.id);

   doctorResponsible.text("Service responsible: "+doctor.responsible);
    
    
}







/*
var URL = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
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
    
    
  for (var i=0;i<vars.length;i++) {
      console.log("QueryString: "+vars[i]);
    var pair = vars[i].split("=");
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  //return query_string;
}();
*/
