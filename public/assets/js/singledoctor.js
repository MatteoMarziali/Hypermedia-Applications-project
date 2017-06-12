var doctorName;
var doctorDescription;
var doctorPosition;
var doctorImage;
var doctorLocation;
var doctorAge;
var doctorResponsible;
var doctorEmail;
var doctorService;

let start = 0;
let count = 10;
let sortby = "none";
let id = 1;  //default values

//variables that are storing the element

$(window).ready(function () { //jquery

  doctorName = $("#doctorname");
  doctorPosition = $("#doctorposition");
  doctorImage = $("#doctorimagesinglepage");
  doctorLocation = $("#doctorlocation");
  doctorAge = $("#doctorage");
  doctorResponsible = $("#doctorresponsible");
  doctorEmail = $("#doctoremail");
  doctorService = $("#doctorservice");


});

function getId() {
  var query_string = {};
  var ciao = window.location.href;
  var query = window.location.search.substring(1);
  console.log("QueryString: " + ciao);
  var vars = ciao.split("?");

  var id = vars[vars.length - 1];
  id = id.split("=");
  id = id[id.length - 1];
  console.log("id: " + id);
  return id;


}



function getDoctor(id) { //sends a request, gets the rsults, and then rewrites the table row by row
  fetch(`/doctors?start=${start}&limit=${count}&sort=${sortby}&id=${id}`) //we draw again every time the UI, seems inefficient but it's not
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.map(addDoctorInfo);
    }).then(function () {
      console.log("finito aggiungere roba dottore");
    });
};

function addDoctorFields(doctor) { //it gave me a big problem if I called this function addRow, it probably had a conflict with the call in anothe
  doctorName.text(doctor.name);
  doctorPosition.text("Position: " + doctor.position);

  //doctorImage.src("img/team/"+doctor.id+".jpg");
  doctorImage.attr("src", "/assets/img/doctors/" + doctor.id + ".jpg");
  doctorLocation.text("Location: " + doctor.location);

     let age = new Date().getFullYear() - doctor.date;
    doctorAge.text("Age: "+age);
    doctorEmail.text("Email: "+doctor.email);
    doctorService.text("Service: "+doctor.service);
    
   //doctorImage.attr("src","img/team/"+doctor.id+".jpg");
   //doctorLocation.text("Location: "+doctor.location);

   doctorResponsible.text("Service responsible: "+doctor.responsible);


}



function fetchDoctor() { //sends a request, gets the rsults, and then rewrites the table row by row
  var docId = getId();
  //console.log("id del dottore da fetchare:"+docId);

  fetch(`/doctors?start=${start}&limit=${count}&sort=${sortby}&id=${docId}`) //we draw again every time the UI, seems inefficient but it's not

    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.map(addDoctorFields);
      console.log("fetched doctor");
    }).then(function () {

      initCubePortfolio();


    });
}

function initCubePortfolio() {
  console.log("Executing cubeportfolio");

  var gridContainer = $('#grid-container'),
    filtersContainer = $('#filters-container');

  // init cubeportfolio
  gridContainer.cubeportfolio({

    defaultFilter: '*',

    animationType: 'sequentially',

    gapHorizontal: 50,

    gapVertical: 40,

    gridAdjustment: 'responsive',

    caption: 'fadeIn',

    displayType: 'lazyLoading',

    displayTypeSpeed: 100,

    // lightbox
    lightboxDelegate: '.cbp-lightbox',
    lightboxGallery: true,
    lightboxTitleSrc: 'data-title',
    lightboxShowCounter: true,

    // singlePage popup
    singlePageDelegate: '.cbp-singlePage',
    singlePageDeeplinking: true,
    singlePageStickyNavigation: true,
    singlePageShowCounter: true,
    singlePageCallback: function (url, element) {

      // to update singlePage content use the following method: this.updateSinglePage(yourContent)
      var t = this;

      $.ajax({
          url: url,
          type: 'GET',
          dataType: 'html',
          timeout: 5000
        })
        .done(function (result) {
          t.updateSinglePage(result);
        })
        .fail(function () {
          t.updateSinglePage("Error! Please refresh the page!");
        });

    },

    // singlePageInline
    singlePageInlineDelegate: '.cbp-singlePageInline',
    singlePageInlinePosition: 'above',
    singlePageInlineShowCounter: true,
    singlePageInlineInFocus: true,
    singlePageInlineCallback: function (url, element) {
      // to update singlePageInline content use the following method: this.updateSinglePageInline(yourContent)
    }
  });

  // add listener for filters click
  filtersContainer.on('click', '.cbp-filter-item', function (e) {

    var me = $(this),
      wrap;

    // get cubeportfolio data and check if is still animating (reposition) the items.
    if (!$.data(gridContainer[0], 'cubeportfolio').isAnimating) {

      if (filtersContainer.hasClass('cbp-l-filters-dropdown')) {
        wrap = $('.cbp-l-filters-dropdownWrap');

        wrap.find('.cbp-filter-item').removeClass('cbp-filter-item-active');

        wrap.find('.cbp-l-filters-dropdownHeader').text(me.text());

        me.addClass('cbp-filter-item-active');
      } else {
        me.addClass('cbp-filter-item-active').siblings().removeClass('cbp-filter-item-active');
      }

    }

    // filter the items
    gridContainer.cubeportfolio('filter', me.data('filter'), function () {});

  });

  // activate counter for filters
  gridContainer.cubeportfolio('showCounter', filtersContainer.find('.cbp-filter-item'));
}




function startUp() { //hides all the data that should not be presented

  fetchDoctor();
}


startUp();

