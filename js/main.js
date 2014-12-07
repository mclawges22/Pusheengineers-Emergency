markers = [];
tweetTexts = [];

var todoCount = 1;

function addTodo() {
    var html = '';
    html += '<div class="todo"><p class="td1">' + (todoCount) + '. ';
    html += tweets.statuses[todoCount].user.name + '</p>';
    html += '<p class="td2">' + tweets.statuses[todoCount].created_at + '</p>';
    html += '<p class="td3">' + tweets.statuses[todoCount].text + '</p>';
    html += '<p class="td4">' + 'latitude:' + tweets.statuses[todoCount].coordinates[0] + ' longitude:' + tweets.statuses[todoCount].coordinates[1] + '</p>';
    $("#todolist").append(html);
    todoCount++;
    console.log(todoCount);
    }

//Marker = {};
//Marker.prototype.markers = [];
//Marker.prototype.clearMarkers = function() { ... };

function initialize() {

    var mapOptions = {
        center: { lat: 40.731090, lng: -73.992219 },
        zoom: 13,
        scrollwheel: false
    };
    var myLatlng = new google.maps.LatLng(40.731090, -73.992219);
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    var long_ass_tweet = "";
    $(tweets.statuses).each(function (key, value) {
        long_ass_tweet += value.text;

        var lon = value.coordinates[0];
        var lat = value.coordinates[1];

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon)
        });
        markers.push(marker);

        google.maps.event.addListener(marker, 'click', function () {
            console.log("on click of marker", marker);
            infowindow.open(map, marker);
        });
    });

    google.maps.event.addDomListener(window, 'load', initialize);
    countWords(long_ass_tweet);
    console.log("windows & markers", tweetTexts, markers);

    //var contentString = '<div id="content">' +
    //    '<div id="siteNotice">' +
    //    '</div>' +
    //    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
    //    '<div id="bodyContent">' +
    //    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    //    'sandstone rock formation in the southern part of the ' +
    //    '(last visited June 22, 2009).</p>' +
    //    '</div>' +
    //    '</div>';

}
google.maps.event.addDomListener(window, 'load', initialize);


/* DYNAMIC BAR CHART KEY */
function countWords(tweets) {
    wordCounts = {};
    wantedSupplies = [];
    var splitted = tweets.split(" ");
    $(splitted).each(function (index) {
        //  console.log("index", index);
        //  console.log(splitted[index], "splitted[index]");
        var word = splitted[index];
        if (wordCounts[word] == null) { // empty object. 
            wordCounts[word] = 1; //push first key value
            //   console.log(wordCounts, "<- wordcounts");
            if (splitted[index] != "#emergencySandy" && splitted[index] != "")
                console.log(splitted[index], "<-splitted[index])");
            wantedSupplies.push(splitted[index]);
        }
        else {
            wordCounts[word]++;
            //    wantedSuppliesCount.push(wordCounts[word]);
        }
    });

    // labeling the bars
    var totalTweets = 0;
    for (i = 0; i < wantedSupplies.length; i++) {
        if (wantedSupplies[i] != "#emergencySandy") {
            var currWord = wantedSupplies[i];
            console.log(currWord, "currWord");
            console.log("wantedSupplies[i]:", wantedSupplies[i]);
            console.log("wordcounts.currWord:", wordCounts[currWord]);
            totalTweets += wordCounts[currWord];

            var currBar = $('.bars')[i - 2];
            console.log(currBar, "currbar");
            $(currBar).children('p').text(wantedSupplies[i]);
        }
    }

    // getting percentage for each requested supply
    for (i = 2; i < wantedSupplies.length; i++) { // i=2 b/c excluding "" & "#emergencysandy"
        var currWord = wantedSupplies[i];
        console.log(wordCounts[currWord], "hi");
        var percentage = (wordCounts[currWord] / totalTweets) * 100;

        var currBar = $('.bars .bar')[i - 2];
        $(currBar).css("width", percentage + "%");
    }
    console.log(totalTweets);
}


// Sets the map on all markers in the array.
function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);


$(function () {
    var chkCount = 0;
    $('input.bars-chooser').change(function () {
        if (this.checked) {
            if (chkCount == 0) {
                clearMarkers();
            }
            chkCount++;
            var productNum = $(this).attr("value");
            console.log("product num", productNum);
            for (var i = 1; i < 4; i++) {
                if (productNum == 1)
                    createMarkers(0, 69, "Water");
                else if (productNum == 2)
                    createMarkers(70, 109, "Food");
                else if (productNum == 3)
                    createMarkers(110, 169, "Blankets");
                else if (productNum == 4)
                    createMarkers(170, 236, "Band-aids");
            }
        }
        else
            if (chkCount == 0)
                clearMarkers();
            else {
                chkCount--;
                var productNum = $(this).attr("value");
                console.log("product num", productNum);
                for (var i = 1; i < 4; i++) {
                    if (productNum == 1)
                        removeMarkers(0, 69);
                    else if (productNum == 2)
                        removeMarkers(70, 109);
                    else if (productNum == 3)
                        removeMarkers(110, 169);
                    else if (productNum == 4)
                        removeMarkers(170, 236);
                }
            }
    });
});

function createMarkers(min, max, resource) {
    console.log("IM HERE");
    // Info Window Content
    var infoWindowContent = '<div class="info_content">' +
        '<h3>'+resource+'</h3>' +
        '<button name="subject" onclick="addTodo()" class="add" value="HTML">Add to my to-do list</button>'
        +'</div>';
    console.log('***** ' + infoWindowContent);
        
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    for (var i = min; i < max; i++) {

        var lat = tweets.statuses[i].coordinates[1];
        var lon = tweets.statuses[i].coordinates[0];
        //console.log(lat, lon);
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            map: map
        });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent);
                infoWindow.open(map, marker);
            }
        })(marker, i));
        markers.push(marker);
    }
}

function removeMarkers() {
    clearMarkers();
    markers = [];
    var products = [];
    $('input.bars-chooser').each(function (key, value) {
        if (this.checked) { products.push(this.value); }
    });
    for (var i = 0; i < products.length; i++) {
        console.log("the datasets we want to add", products[i]);
        if (products[i] == 1)
            createMarkers(0, 69);
        else if (products[i] == 2)
            createMarkers(70, 109);
        else if (products[i] == 3)
            createMarkers(110, 169);
        else if (products[i] == 4)
            createMarkers(170, 236);

    }
}
