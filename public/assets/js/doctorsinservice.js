let start = 0;
let count = 10;
let sortby = "none";


function clearList() {
  $("#ul-dottori").find("li").remove();
}



function addDoctor(doctor) {
  console.log("Adding row");
  let age = new Date().getFullYear() - doctor.date;   //getfullyear prende l'anno corrente della data corrente
  $("#ul-dottori").append(
    `

                <li class="cbp-item psychiatrist" >
                        <a href="/pages/guidedtourdoctor.html?id=${doctor.idd}" class="cbp-caption cbp-singlePage">
                            <div class="cbp-caption-defaultWrap">
                                <img src="/assets/img/doctors/${doctor.idd}.jpg" alt="" width="100%">
                            </div>
                            <div class="cbp-caption-activeWrap">
                                <div class="cbp-l-caption-alignCenter">
                                    <div class="cbp-l-caption-body">
                                        <div class="cbp-l-caption-text">OPEN GUIDED TOUR</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                        <a href="/pages/guidedtourdoctor.html?id=${doctor.idd}" class="cbp-singlePage cbp-l-grid-team-name">${doctor.name}</a>
                        <div class="cbp-l-grid-team-position">${doctor.position}</div>
                    </li>          
    
`
  );
}


function setSort(x) {  
    sortby = x;
 
    jQuery("#grid-container").cubeportfolio('destroy');
  updateDoctorsList(); 

//they then invoke updatedoctorslist, that is meant to access the doctors on the server with the current criteria, the fetch..
}


function updateDoctorsList() {  //sends a request, gets the rsults, and then rewrites the table row by row
    
    
    fetch(`/doctors?start=${start}&limit=${count}&sort=${sortby}&service=${getServiceName()}`)
    
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      clearList();
      data.map(addDoctor);
    }).then(function(){
      
        //init doctors plugin to display them properly
      initCubePortfolio();
      
  });
}

function initCubePortfolio(){
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
            .done(function(result) {
                t.updateSinglePage(result);
            })
            .fail(function() {
                t.updateSinglePage("Error! Please refresh the page!");
            });

        },

        // singlePageInline
        singlePageInlineDelegate: '.cbp-singlePageInline',
        singlePageInlinePosition: 'above',
        singlePageInlineShowCounter: true,
        singlePageInlineInFocus: true,
        singlePageInlineCallback: function(url, element) {
            // to update singlePageInline content use the following method: this.updateSinglePageInline(yourContent)
        }
    });

    // add listener for filters click
    filtersContainer.on('click', '.cbp-filter-item', function (e) {

        var me = $(this), wrap;

        // get cubeportfolio data and check if is still animating (reposition) the items.
        if ( !$.data(gridContainer[0], 'cubeportfolio').isAnimating ) {

            if ( filtersContainer.hasClass('cbp-l-filters-dropdown') ) {
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

function setDynamicTitle(){
    var service=getServiceName();
    var splitspaces=service.split("%20");
    var servwithspaces="";
    for(var i=0;i<splitspaces.length;i++){
    servwithspaces=servwithspaces+splitspaces[i]+" ";
        }
    $("#title").text("Doctors operating in "+servwithspaces);
}


function getServiceName() {
  var query_string = {};
  var ciao = window.location.href;
  var query = window.location.search.substring(1);
  console.log("QueryString: " + ciao);
  var vars = ciao.split("?");

  var service = vars[vars.length - 1];
  service = service.split("=");
  service = service[service.length - 1];
  console.log("service name: " + service);
    
    console.log("I got the service:"+service);
    
  return service;

}


function startup() {   //hides all the data that should not be presented

  updateDoctorsList();
  setDynamicTitle();
}

startup();