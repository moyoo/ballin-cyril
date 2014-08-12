//app.js
var testcnt = 0;

function initApp()
{
// Define a click binding for all anchors in the page
    $("a").on("click", function(event) {

        // Prevent the usual navigation behavior
        event.preventDefault();
        event.stopPropagation(); // stop the click from bubbling

        if(options && options.currentparkinglot.oid && options.currentparkinglot.isApplied)
        {
        	 if (this.attributes["data-icon"]) 
        	 { 
			    var next = this.attributes["data-icon"].value == 'grid' ? "#report" : "#lists";
			    next = this.attributes["data-icon"].value == 'gear' ? "#setup" : next;
			    next = this.attributes["data-icon"].value == 'star' ? "#lists" : next;
	        	setPage(next, options.currentparkinglot.parking_nm, true);

	            $("a").removeClass('ui-btn-active');
	            $(this).addClass('ui-btn-active');
        	}
        }else
        {
        	alert('대상이 선택되지 않았습니다.'); return;
        }

    });

    $('#plusone').on('click', function(e) {
        addVehicles(1);
    });

    $('#minusone').on('click', function(e) {
    	if(options.currentparkinglot.vehicles > 0 )
    	 	addVehicles(-1);
    	 
    });
}

function initParkingLot()
{
 	
 	$.ajax({
	 		type: "POST",
		    url: options.editinfo.featurelayerurl + "/query",
		    data: { f: "json", 
		  			where: "1=1",
		  			returnGeometry: false,
		  			outFields : "*"
		  		}
		  
		   })
		   .done(function( data ) {
		     
		     var features = JSON.parse(data).features;
			setSelectionList(features);
		   } 
		 );


}

function setPage(next, c, isRefresh)
{
	if(isRefresh)
	{
		 getCurrentParkingInfo(c);	
	}
    var options = {
        transition: "slide",
        reverse: false,
        changeHash: false
    };
 
    $(':mobile-pagecontainer').pagecontainer('change', next, options);

}

function setSelectionList(features)
{
	if (features)
	{
		var selectlist = '<select name="select-choice-0" id="select-choice-1">';
	 	selectlist += '<option value="no_select">주차장 선택...</option>';

		for (var i =0 ; i < features.length ; i++)
		{
			selectlist += ' <option value=' + features[i].attributes[options.editinfo.editfields.namefield]+'>'+features[i].attributes[options.editinfo.editfields.namefield] +'</option>';
		}
		
		//selectlist += '<option value="rush">주차장 B</option>';
		selectlist += '</select>';

		$('#parkinglotlist').append(selectlist);

		$('#select-choice-1').on('change', function(){

			if(this.selectedIndex === 0)
			{
				options.currentparkinglot.isApplied = false;
				alert('대상 주차장을 선택해 주세요.');
				return;
			}
			else
			{
				getCurrentParkingInfo(this.options[this.selectedIndex].value);
			}
			 
      });
	}

}

function getCurrentParkingInfo(c)
{
 	$.ajax({
 		type: "POST",
	    url: options.editinfo.featurelayerurl + "/query",
	    data: { f: "json", 
	  			where: options.editinfo.editfields.namefield + "='" + c  + "'",
	  			returnGeometry: false,
	  			outFields : "*"
	  		}
	  
	   })
	   .done(function( data ) {
	   	   if(data)
	   	   {
	   	   	  var feature = JSON.parse(data).features[0];

	   	   	  options.currentparkinglot.oid = feature.attributes[options.editinfo.editfields.oidfield];
	   	   	  options.currentparkinglot.parking_nm = feature.attributes[options.editinfo.editfields.namefield];
	   	   	   
	   	   	  options.currentparkinglot.vehicles = feature.attributes[options.editinfo.editfields.vehiclefield];
	   	   	  options.currentparkinglot.capacity = feature.attributes[options.editinfo.editfields.capacity];

		      var innerhtml = "<p>대상 :" + feature.attributes[options.editinfo.editfields.namefield] + "</p>";
	          innerhtml +=  "<p>수용대수 : " + feature.attributes[options.editinfo.editfields.capacity] + "</p>";
	          innerhtml +=  "<p>주차대수 : " + feature.attributes[options.editinfo.editfields.vehiclefield] + "</p>";
	          $('#setupinfo').html(innerhtml);

	   	   }else
	   	   {
	   	   		alert('정보를 찾을 수 없습니다.');
	   	   }
	
	   }
	 );
}

function applyParkingLot()
{
	if(options && options.currentparkinglot.oid)
	{
		console.log(options.currentparkinglot.oid + " 로 설정...");
		
		$('#currentParkingLot').text(options.currentparkinglot.parking_nm);
		$('#currentNum').text(options.currentparkinglot.vehicles);

		options.currentparkinglot.isApplied = true;
		setPage('#report', options.currentparkinglot.parking_nm, true);
	}
}

function addVehicles(gap)
{
	var url = options.editinfo.featurelayerurl + '/applyEdits';

    options.currentparkinglot.vehicles = options.currentparkinglot.vehicles + gap;
    // Send the data using post
    var posting = $.post(url, {
        f: 'json',
        updates: '[ {"attributes": {' + options.editinfo.editfields.oidfield + ': '+ options.currentparkinglot.oid+', ' + options.editinfo.editfields.vehiclefield + ': ' + (options.currentparkinglot.vehicles) + '} } ]'
    });
    // Put the results in a div
    posting.done(function(data) {
        $('#currentNum').text(options.currentparkinglot.vehicles);
    });

    // Put the results in a div
    posting.fail(function(error) {
        console.log(error);
    });
}