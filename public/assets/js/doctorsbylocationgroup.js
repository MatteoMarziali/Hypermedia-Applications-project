

let start = 0;
let count = 10;
let sortby = "none"; /* Can be none, "+age", "-age", "name"*/    //criteria for sorting, string variable


function clearList() {
  $("#ul-dottori").find("li").remove();
}



function addRow(doctor) {
  console.log("Adding row");
  let age = new Date().getFullYear() - doctor.date;   //getfullyear prende l'anno corrente della data corrente
  $("#ul-dottori").append(
    `

                <li class="cbp-item psychiatrist" >
                        <a href="/pages/guidedtourdoctor.html?id=${doctor.id}" class="cbp-caption cbp-singlePage">
                            <div class="cbp-caption-defaultWrap">
                                <img src="/assets/img/doctors/${doctor.id}.jpg" alt="" width="100%">
                            </div>
                            <div class="cbp-caption-activeWrap">
                                <div class="cbp-l-caption-alignCenter">
                                    <div class="cbp-l-caption-body">
                                        <div class="cbp-l-caption-text">OPEN GUIDED TOUR</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                        <a href="/pages/guidedtourdoctor.html?id=${doctor.id}" class="cbp-singlePage cbp-l-grid-team-name">${doctor.name}</a>
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
    
    
    fetch(`/doctors?start=${start}&limit=${count}&sort=${sortby}&location=${getLocationName()}`)
    
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      clearList();
      data.map(addRow);
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


function getLocationName() {
  var query_string = {};
  var ciao = window.location.href;
  var query = window.location.search.substring(1);
  console.log("QueryString: " + ciao);
  var vars = ciao.split("?");

  var location = vars[vars.length - 1];
  location = location.split("=");
  location = location[location.length - 1];
  console.log("location name: " + location);
    
    console.log("I got the location:"+location);
    
  return location;

}


function startup() {   //hides all the data that should not be presented

  updateDoctorsList();
}

startup();
