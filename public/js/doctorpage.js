var doctorName;
var doctorDescription;
var doctorPosition;
var doctorImage;
var doctor_id;
var doctor_list;

//variables that are storing the element

$(window).ready(function () {   //jquery
    
    doctorName = $("#doctorname");
    doctorPosition = $("#doctorposition");
    doctorImage=$("#doctorimage");
    
    
    
    
    //console.log("ciao");
    //console.log("Doctor id: "+URL.id);
    //console.log(HREF);
   //var idd=
//console.log("idd= "+getId());
    var iddd = getId();
    getDoctor(iddd);
    //assigning variables to containers in html
    
    //storing the doctor fullname and everything to use later on





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
${doctor.id} e poi ${doctor.service}   e poi ${doctor.name}



dsrgdrgdgdrc ciaaooo
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum, perspiciatis, corporis, iusto a saepe iste ea odit quas fugit amet nisi adipisci excepturi ipsam quae asperiores sit blanditiis sunt ducimus magni eos non et quos dignissimos quaerat aspernatur. Enim, temporibus, ullam, vitae, accusantium veniam ut odio magni nobis animi ratione eaque at aliquam eos error quas eum unde laudantium quisquam dolores voluptas velit corporis fuga! Error, soluta, consequatur, excepturi earum laudantium ab magnam vitae eligendi consectetur dicta quo nesciunt eveniet facere iusto praesentium aliquid impedit tempora nobis deleniti fugiat corporis maiores cupiditate provident veritatis quod odio nulla vel ratione quas.
	</div>
                
                
    
`
  );
    
   doctorName.text(doctor.name);
    doctorPosition.text(doctor.service);
    
    //doctorImage.src("img/team/"+doctor.id+".jpg");
   doctorImage.attr("src","img/team/"+doctor.id+".jpg");
    
    
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
