function addServiceRow(service){
    console.log("Adding location");
    console.log("Service name: " + service.name);
    
    $("#serviceList").append( 
        `
        <li class = "serviceElement">
            <a href="/pages/singleservice.html?name=${service.name}">
            <h3>${service.name}</h3>
            <a href="/pages/singleservice.html?name=${service.name}">
                <div class="element">
                <img src="${service.img}" style="width:100%"/>
                </div>

        </li>
        `
    );
}

var name = "none";

function updateServicesList(){
    console.log("name: " + name);
    fetch(`/services?name=${name}`).then(function(response){
        return response.json();
    })
    .then(function(data){
        clearServiceList();
        data.map(addServiceRow);
    });
}

function clearServiceList(){
    $("#serviceList").find("li").remove();
}

updateServicesList();