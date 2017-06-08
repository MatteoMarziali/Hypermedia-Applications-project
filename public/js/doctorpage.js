var doctor_fullname;
var doctor_description;
var doctor_services;
var doctor_image;
var doctor_id;
var doctor_list;

//variables that are storing the element

$(window).ready(function () {   //jquery
    
    
    //console.log("ciao");
    //console.log("Doctor id: "+URL.id);
    //console.log(HREF);
   //var idd=
console.log("idd= "+getId());
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
