function getLocation() {
    var query_string = {};
    var ciao = window.location.href;
    var url = window.location.search.substring(1);
    console.log("QueryString: "+url);
    var vars = ciao.split("?");
    
    var locationSelected = vars[vars.length-1];
    locationSelected = locationSelected.split("=");
    locationSelected = locationSelected[locationSelected.length-1];
    console.log("locationSelected: "+locationSelected);
    return locationSelected;
}

function clearServiceList() {
    console.log("Pulendo");
  $("#services").find("li").remove();
}

function addElement(element){
    
    console.log("element.service: " + element.service);
    
    $("#services").append(
       `

                <li>
                        <a href="/pages/singleservice.html?service=${element.service}">
                            <strong>${element.service}</strong>
                        </a>
                        <div>${element.description}</div>
                </li>

        ` 
    );
    
    
    
}

function updateServiceList(){
    console.log("SONO QUI");
    var locationSelected=getLocation();
    console.log("locationSelected" + locationSelected);
    fetch(`/serviceslocations?location=${locationSelected}`).then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log("Dovrei aver fetchato");
        clearServiceList();
        console.log("Data: " + data);
        data.map(/*function(currentValue, index, array){
            addElement(data[index]);
        }*/addElement);
    })
    
}

updateServiceList();