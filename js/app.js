//app.js
var _isApplied = false;
//
function initApp() {
    // Define a click binding for all anchors in the page
    $("a").on("click", function(event) {

        // Prevent the usual navigation behavior
        event.preventDefault();
        event.stopPropagation(); 

        if (options && options.currentparkinglot.oid && _isApplied) {
            if (this.attributes["data-icon"]) {
                var next = this.attributes["data-icon"].value == 'grid' ? "#report" : "#lists";
                next = this.attributes["data-icon"].value == 'gear' ? "#setup" : next;
                next = this.attributes["data-icon"].value == 'star' ? "#lists" : next;
                setPage(next, options.currentparkinglot.parking_nm, true);

                $("a").removeClass('ui-btn-active');
                $(this).addClass('ui-btn-active');
            }
        } else {
            alert('대상이 선택되지 않았습니다.');
            return;
        }

    });

    $('#plusone').on('click', function(e) {
        addVehicles(1);
    });

    $('#minusone').on('click', function(e) {
        if (options.currentparkinglot.vehicles > 0)
            addVehicles(-1);

    });
}

function initParkingLot() {

    $.ajax({
        type: "POST",
        url: options.editinfo.featurelayerurl + "/query",
        data: {
            f: "json",
            where: "1=1",
            returnGeometry: false,
            outFields: "*",
            orderByFields : options.editinfo.editfields.namefield
        }

    })
        .done(function(data) {

            var features = JSON.parse(data).features;
            setSelectionList(features);
        });


}

function setPage(next, c, isRefresh) {
    if (isRefresh) {
        getCurrentParkingInfo(c);
    }

    var options = {
        transition: "slide",
        reverse: false,
        changeHash: false
    };

    $(':mobile-pagecontainer').pagecontainer('change', next, options);

}

function setSelectionList(features) {
    if (features) {
        var selectlist = '<select name="select-choice-0" id="select-choice-1">';
        selectlist += '<option value="no_select">주차장 선택...</option>';

        for (var i = 0; i < features.length; i++) {
            selectlist += ' <option value=' + features[i].attributes[options.editinfo.editfields.namefield] + '>' + features[i].attributes[options.editinfo.editfields.namefield] + '</option>';
        }

        //selectlist += '<option value="rush">주차장 B</option>';
        selectlist += '</select>';

        $('#parkinglotlist').append(selectlist);

        $('#select-choice-1').on('change', function() {

            if (this.selectedIndex === 0) {
                options.currentparkinglot.isApplied = false;
                alert('대상 주차장을 선택해 주세요.');
                return;
            } else {
                getCurrentParkingInfo($("#select-choice-1 option:selected").text());
                _isApplied = false;
            }

        });
    }

}

function getCurrentParkingInfo(c) {
    $.ajax({
        type: "POST",
        url: options.editinfo.featurelayerurl + "/query",
        data: {
            f: "json",
            where: options.editinfo.editfields.namefield + "='" + c + "'",
            returnGeometry: false,
            outFields: "*"
        }

    })
        .done(function(data) {
            if (data) {

                var feature = JSON.parse(data).features[0];

                if(feature){
                     options.currentparkinglot.oid = feature.attributes[options.editinfo.editfields.oidfield];
                    options.currentparkinglot.parking_nm = feature.attributes[options.editinfo.editfields.namefield];

                    options.currentparkinglot.vehicles = feature.attributes[options.editinfo.editfields.vehiclefield];
                    options.currentparkinglot.capacity = feature.attributes[options.editinfo.editfields.capacityfield];

                    updatePagesInfo(); 
                }
               


            } else {
                alert('정보를 찾을 수 없습니다.');
            }

        });
}

function applyParkingLot() {
    if (options && options.currentparkinglot.oid) {
        console.log(options.currentparkinglot.oid + " 로 설정...");

        $('#currentParkingLot').text(options.currentparkinglot.parking_nm);
        $('#currentNum').text(options.currentparkinglot.vehicles);

        _isApplied = true;
        setPage('#report', options.currentparkinglot.parking_nm, true);
    }
}

function addVehicles(gap) {
    var url = options.editinfo.featurelayerurl + '/applyEdits';

    //over capacity return;
    if (options && options.currentparkinglot.capacity && options.currentparkinglot.capacity < (options.currentparkinglot.vehicles + gap)) {
        alert('최대 수용량을 초과하였습니다.');
        return;
    }

    options.currentparkinglot.vehicles = options.currentparkinglot.vehicles + gap;
    // Send the data using post
    var posting = $.post(url, {
        f: 'json',
        updates: '[ {"attributes": {' + options.editinfo.editfields.oidfield + ': ' + options.currentparkinglot.oid + ', ' + options.editinfo.editfields.vehiclefield + ': ' + (options.currentparkinglot.vehicles) + '} } ]'
    });
    // Put the results in a div
    posting.done(function(data) {
        //$('#currentNum').text(options.currentparkinglot.vehicles);
        getCurrentStatus();
    });

    // Put the results in a div
    posting.fail(function(error) {
        console.log(error);
    });
}

function getCurrentStatus() {
    if (options && options.currentparkinglot.parking_nm) {
        $.ajax({
            type: "POST",
            url: options.editinfo.featurelayerurl + "/query",
            data: {
                f: "json",
                where: options.editinfo.editfields.namefield + "='" + options.currentparkinglot.parking_nm + "'",
                returnGeometry: false,
                outFields: "*"
            }

        })
            .done(function(data) {
                if (data) {
                    var feature = JSON.parse(data).features[0];

                    if (options.currentparkinglot.oid == feature.attributes[options.editinfo.editfields.oidfield]) {
                        options.currentparkinglot.vehicles = feature.attributes[options.editinfo.editfields.vehiclefield];
                        //options.currentparkinglot.capacity = feature.attributes[options.editinfo.editfields.capacityfield];
                    } else {
                        console.log('id doesnot matched.');
                        return;
                    }
                    updatePagesInfo();
                } else {
                    alert('정보를 찾을 수 없습니다.');
                }

            });
    }
}

function updatePagesInfo() {
    //setup pages
    var innerhtml = "<p>대상 :" + options.currentparkinglot.parking_nm + "</p>";
    innerhtml += "<p>총주차 : " + options.currentparkinglot.capacity + "</p>";
    innerhtml += "<p>현주차 : " + options.currentparkinglot.vehicles + "</p>";

    $('#setupinfo').html(innerhtml);

    //report pages
    $('#currentNum').text(options.currentparkinglot.vehicles);
    $('#capacityNum').text(options.currentparkinglot.capacity);
    
}

function openPopup() {
    if (options && options.currentparkinglot.oid) {
        $('#txtCapacity').val(options.currentparkinglot.capacity);
        $('#txtVehicles').val(options.currentparkinglot.vehicles);

        $('#updatePopup').popup("open", null);
    } else {
        alert('대상을 먼저 선택해 주십시오.');
        return;
    }

}
//일괄데이터 갱
function applyFeatureData() {
    var url = options.editinfo.featurelayerurl + '/applyEdits';

    //over capacity return;
    if (options && options.currentparkinglot.oid) {

        // Send the data using post
        var posting = $.post(url, {
            f: 'json',
            updates: '[ {"attributes": {' + options.editinfo.editfields.oidfield + ': ' + options.currentparkinglot.oid + ', ' + options.editinfo.editfields.vehiclefield + ': ' + ($('#txtVehicles').val()) + '} } ]'
        });
        // Put the results in a div
        posting.done(function(data) {
            //$('#currentNum').text(options.currentparkinglot.vehicles);
            getCurrentStatus();
            $('#updatePopup').popup('close', null);
        });

        // Put the results in a div
        posting.fail(function(error) {
            console.log(error);
            $('#updatePopup').popup('close', null);
        });
    }

}