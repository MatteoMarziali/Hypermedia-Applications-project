$(document).ready(function(){
    
console.log("I'm ready to fuck");
    $("#link").on("click",function(){
        console.log("Fuck, you clicked me");
        $(".description").fadeIn();
        //$(".description").toggle();
    });
    
    //callback  $$("#link").on("click", callbackFunction);
    
    
    $("#send").on("click",sendClicked);
});


function sendClicked(){
    console.log("the button send has been clicked");
    
    //var textvalue;
       //local to this function
    window.textvalue=$("#mytextinput").val();
    
    console.log(window.textvalue);
    
    //let's put the input in the paragraph in html
    $(".description").fadeIn();
    $(".description").text(window.textvalue);
}