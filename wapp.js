// Set the favicon (i.e. shortcut icon) for the web page
var favicon = document.querySelector("link[rel~='icon']");
if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(favicon);
}
favicon.href = 'images/favicon.png';

// Execute after the browser has completely load all content
window.onload = function() {

    /* ---------- Helper Functions ---------- */

    // Set the Header Block's background image
    function setHeaderBlockBackground(returnedData) {
        var currentTime = new Date(returnedData.updateTime);
        var isDayTime = true;   // Initialise the boolean variable "isDayTime"
        if ((returnedData.icon >= 70) && (returnedData.icon <= 77)) {
            // Night-time weather icons
            isDayTime = false;
        }
        else {
            // Assuming daytime is from 6 a.m. to 7 p.m.
            // HKO Sunrise and Sunset Time API: ('https://data.weather.gov.hk/weatherAPI/opendata/opendata.php?dataType=SRS&rformat=json&year=' + currentYear)
            isDayTime = ((currentTime.getHours() > 6) && (currentTime.getHours() < 19));
        }
        var rainfall = returnedData.rainfall.data.find(region => region.place === "Yau Tsim Mong").max;

        // 0: Night time without rain; 1: Day time without rain; 2: Night time with rain; 3: Day ime with rain
        var weather = isDayTime + (rainfall > 0) * 2;
        if (weather == 0) {
            headerBlock.style.backgroundImage = "url('images/night-sky.jpg')";
            headerBlock.style.color = "white";
        }
        else if (weather == 1) {
            headerBlock.style.backgroundImage = "url('images/blue-sky.jpg')";
            headerBlock.style.color = "black";
        }
        else if (weather == 2) {
            headerBlock.style.backgroundImage = "url('images/water-drops-glass-night.jpg')";
            headerBlock.style.color = "white";
        }
        else if (weather == 3) {
            headerBlock.style.backgroundImage = "url('images/water-drops-glass-day.jpg')";
            headerBlock.style.color = "black";
        }
    }

    // Set the Header Block's weather icon
    function setWeatherIcon(returnedData, elementID) {
        var currentIcon = returnedData.icon;
        document.getElementById(elementID).src = "https://www.hko.gov.hk/images/HKOWxIconOutline/pic" + currentIcon + ".png";
    }

    // Set the temperature for both the Header Block and the Location Block
    function setTemperature(returnedData, location, elementID) {
        var currentTemperature = returnedData.temperature.data.find(region => region.place === location).value;
        document.getElementById(elementID).innerHTML = currentTemperature + '<sup style="font-size: 20px; vertical-align: super">°C</sup>';
    }

    // Set the Header Block's humidity
    function setHumidity(returnedData, elementID) {
        var currentHumidity = returnedData.humidity.data[0].value;
        document.getElementById(elementID).innerHTML = currentHumidity + '<span style="font-size: 20px">%</font>';
    }

    // Set the rainfall for both the Header Block and the Location Block
    function setRainfall(returnedData, location, elementID) {
        var currentRainfall = returnedData.rainfall.data.find(region => region.place === location).max;
        document.getElementById(elementID).innerHTML = currentRainfall + '<span style="font-size: 20px">mm</font>';
    }

    // Set the Header Block's UV Index
    var hasUV = false;
    function setUV(returnedData, elementID, elementIconID) {
        if (returnedData.uvindex == "") {
            hasUV = false;
        }
        else {
            hasUV = true;
        }
        if (hasUV == false) {
            document.getElementById(elementID).innerHTML = "0";
            // Hide the icon and UV index when UV data is not available
            document.getElementById(elementID).style.display = "none";
            document.getElementById(elementIconID).style.display = "none";

            // Increase the gap between elements when UV data is hidden
            if (window.innerWidth >= 750) {
                // Desktop browser
                document.getElementById("headerBlockWeatherIconContainerID").style.paddingLeft = "60px";
                document.getElementById("headerBlockTemperatureContainerID").style.paddingLeft = "60px";
                document.getElementById("headerBlockHumidityContainerID").style.paddingLeft = "60px";
                document.getElementById("headerBlockRainfallContainerID").style.paddingLeft = "60px";
            }
            else {
                // Mobile browser
                document.getElementById("headerBlockID").style.height = "250px";
                document.getElementById("headerBlockWeatherIconContainerID").style.paddingLeft = "10px";
                document.getElementById("headerBlockWeatherIconContainerID").style.float = "left";
                document.getElementById("headerBlockTemperatureContainerID").style.paddingRight = "10px";
                document.getElementById("headerBlockTemperatureContainerID").style.float = "right";
                document.getElementById("headerBlockHumidityContainerID").style.paddingLeft = "10px";
                document.getElementById("headerBlockHumidityContainerID").style.paddingTop = "15px";
                document.getElementById("headerBlockHumidityContainerID").style.float = "left";
                document.getElementById("headerBlockRainfallContainerID").style.paddingRight = "10px";
                document.getElementById("headerBlockRainfallContainerID").style.paddingTop = "15px";
                document.getElementById("headerBlockRainfallContainerID").style.float = "right";
            }
        }
        else {
            var currentUV = returnedData.uvindex.data[0].value;
            document.getElementById(elementID).innerHTML = currentUV;
        }
    }

    // Set the Header Block's last update time
    function setUpdate(returnedData, elementID) {
        var currentTime = new Date(returnedData.updateTime);
        document.getElementById(elementID).innerHTML = "Last Update: " + ("0" + currentTime.getHours()).slice(-2) + ":" + ("0" + currentTime.getMinutes()).slice(-2);
    }

    // Set the Header Block's warning message
    function setWarning(returnedData) {
        if (returnedData.warningMessage == "") {
            headerBlockWarningMessage.innerHTML = "Warning <br />" + '<ul style="font-weight: normal; font-style: italic; padding-left: 17px"> <li style="margin: 0px; padding: 0px">There is no warning message at the moment.</li> </ul>';
        }
        else {
            var currentWarning = returnedData.warningMessage;
            headerBlockWarningMessage.innerHTML = "Warning <br />";
            var warningList = document.createElement("ul");
            warningList.style.fontWeight = "normal";
            warningList.style.fontStyle = "italic";
            warningList.style.paddingLeft = "17px";
            for (var i = 0; i < currentWarning.length; i++) {
                var warningListItems = document.createElement("li");
                warningListItems.appendChild(document.createTextNode(currentWarning[i]));
                warningList.appendChild(warningListItems);
            }
            headerBlockWarningMessage.appendChild(warningList);
        }
        // Hide the warning message unless the "Warning" button was clicked
        headerBlockWarningMessage.style.display = "none";
    }

    // Show or hide the warning message depending on the weather
    function hideWarning(returnedData, elementID) {
        if (returnedData.warningMessage == "") {
            document.getElementById(elementID).style.display = "none";
        }
    }

    // Set the MyData Block's district information
    function setDistrict(returnedData, elementID) {
        if (returnedData.address.city_district) {
            var currentDistrict = returnedData.address.city_district;
        }
        else if (returnedData.address.county) {
            var currentDistrict = returnedData.address.county;
        }
        else {
            var currentDistrict = "Unknown";
        }
        document.getElementById(elementID).innerHTML = currentDistrict;
    }

    // Set the MyData Block's suburb information
    function setSuburb(returnedData, elementID) {
        if (returnedData.address.suburb) {
            var currentSuburb = returnedData.address.suburb;
        }
        else if (returnedData.address.borough) {
            var currentSuburb = returnedData.address.borough;
        }
        else if (returnedData.address.town) {
            var currentSuburb = returnedData.address.town;
        }
        else {
            var currentSuburb = "Unknown";
        }
        document.getElementById(elementID).innerHTML = currentSuburb;
    }

    // Set the MyData Block's rainfall information in the current district
    function setDistrictRainfall(returnedWeatherData, returnedLocationData, elementID) {
        // Get the current district
        if (returnedLocationData.address.city_district) {
            var currentDistrict = returnedLocationData.address.city_district;
        }
        else if (returnedLocationData.address.county) {
            var currentDistrict = returnedLocationData.address.county;
        }
        else {
            var currentDistrict = "Unknown";
        }

        if (returnedWeatherData.rainfall.data.find(region => region.place == currentDistrict)) {
            // Retain the word "District" in the district name for some particular locations like "Eastern District"
            var currentRainfall = returnedWeatherData.rainfall.data.find(region => region.place == currentDistrict).max;
        }
        else if (returnedWeatherData.rainfall.data.find(region => region.place == (currentDistrict.slice(0, currentDistrict.length - 9)))) {
            // Remove the word "District" in the district name for some particular locations like "Tsuen Wan District"
            var currentRainfall = returnedWeatherData.rainfall.data.find(region => region.place == (currentDistrict.slice(0, currentDistrict.length - 9))).max;
        }
        else if (currentDistrict == "Central and Western District") {
            // Change the "and" to "&" for "Central and Western District"
            var currentRainfall = returnedWeatherData.rainfall.data.find(region => region.place == "Central &amp; Western District").max;
        }
        else {
            document.getElementById(elementID).innerHTML = "N/A";
            return;
        }
        
        document.getElementById(elementID).innerHTML = currentRainfall + '<span style="font-size: 20px">mm</font>';
    }

    // Find the equirectangular distance between the current position and a particular weather station
    function getDistance(selfLatitude, selfLongitude, stationLatitude, stationLongitude) {
        var selfPhi = selfLatitude * Math.PI / 180;
        var selfLambda = selfLongitude * Math.PI / 180;
        var stationPhi = stationLatitude * Math.PI / 180;
        var stationLambda = stationLongitude * Math.PI / 180;
        const earthRadius = 6371; // Mean radius is 6,371 km

        var x = (stationLambda - selfLambda) * Math.cos((selfPhi + stationPhi) / 2);
        var y = (stationPhi - selfPhi);
        var d = Math.sqrt(x * x + y * y) * earthRadius;

        return d;
    }

    // Set the MyData Block's temperature information in the current district
    function setDistrictTemperature(returnedWeatherData, latitude, longitude, returnedStationData, elementID) {
        var availableWeatherStations = [];
        for (var i = 0; i < returnedWeatherData.temperature.data.length; i++) {
            availableWeatherStations[i] = returnedWeatherData.temperature.data[i].place;
        }

        // To handle the case where some weather stations may be temporarily unavailable 
        var allWeatherStations = [];
        var counter = 0;  
        for (var i = 0; i < returnedStationData.length; i++) {
            for (var j = 0; j < returnedWeatherData.temperature.data.length; j++) {
                if (returnedStationData[i].station_name_en == "Tsuen Wan") {
                    // To handle the discrepancy in weather stations' names appear in different APIs
                    returnedStationData[i].station_name_en = "Tsuen Wan Ho Koon";
                }
                if (returnedStationData[i].station_name_en == returnedWeatherData.temperature.data[j].place) {
                    allWeatherStations[counter] = returnedStationData[i];
                    counter++;
                }
            }
        }
        
        var distance = [];
        for (var i = 0; i < allWeatherStations.length; i++) {
            distance[i] = getDistance(latitude, longitude, allWeatherStations[i].latitude, allWeatherStations[i].longitude);
        }

        // Find the closest station
        var smallestDistance = 0;
        for (var i = 0; i < distance.length; i++) {
            if (distance[i] < distance[smallestDistance]) {
                smallestDistance = i;
            }
        }
        var currentStation = allWeatherStations[smallestDistance].station_name_en;
        
        setTemperature(returnedWeatherData, currentStation, elementID);
    }

    // Set the MyData Block's AQHI information in the current district
    function setDistrictAQHI(returnedAQHIData, latitude, longitude, returnedAQHIStationData, elementID, elementIconID) {
        var distance = [];
        for (var i = 0; i < returnedAQHIStationData.length; i++) {
            distance[i] = getDistance(latitude, longitude, returnedAQHIStationData[i].lat, returnedAQHIStationData[i].lng);
        }

        // Find the closest station
        var smallestDistance = 0;
        for (var i = 0; i < distance.length; i++) {
            if (distance[i] < distance[smallestDistance]) {
                smallestDistance = i;
            }
        }
        var currentStation = returnedAQHIStationData[smallestDistance].station;

        var currentAQHI = returnedAQHIData.find(region => region.station === currentStation).aqhi;
        var currentHealthRisk = returnedAQHIData.find(region => region.station === currentStation).health_risk;
        document.getElementById(elementID).innerHTML = '<div style="font-size: 20px">' + currentAQHI + '</div>' + '<div style="font-size: 15px">' + currentHealthRisk + '</div>';
        if (currentHealthRisk == "Low") {
            document.getElementById(elementIconID).src = 'images/aqhi-low.png';
        }
        else if (currentHealthRisk == "Moderate") {
            document.getElementById(elementIconID).src = 'images/aqhi-moderate.png';
        }
        else if (currentHealthRisk == "High") {
            document.getElementById(elementIconID).src = 'images/aqhi-high.png';
        }
        else if (currentHealthRisk == "Very High") {
            document.getElementById(elementIconID).src = 'images/aqhi-very_high.png';
        }
        else if (currentHealthRisk == "Serious") {
            document.getElementById(elementIconID).src = 'images/aqhi-serious.png';
        }
    }

    // Get the list of currently available weather stations
    function getWeatherStations(returnedData, elementID) {
        var weatherStations = [];
        for (var i = 0; i < returnedData.temperature.data.length; i++) {
            weatherStations[i] = returnedData.temperature.data[i].place;
        }

        weatherStations.sort();
            
        for (var i = 0; i < weatherStations.length; i++) {
            var locationOption = document.createElement("option");
            locationOption.value = weatherStations[i];
            locationOption.text = weatherStations[i];
            document.getElementById(elementID).appendChild(locationOption);
        }
    }

    // Set the 9-day Forecast Block's weather forecast
    function setForecast(returnedData, elementID) {
        var row = document.createElement("tr");
        document.getElementById(elementID).appendChild(row);
        for (var i = 0; i < 9; i++) {
            var column = document.createElement("td");
            column.className = "forecastBlockTableCell";

            var dayText = document.createTextNode((returnedData.weatherForecast[i].week).slice(0, 3) + " ");
            column.appendChild(dayText);
            var date = returnedData.weatherForecast[i].forecastDate;
            var dateText = document.createTextNode(date[6] + date[7] + "/" + date[4] + date[5]);
            column.appendChild(dateText);
            var weatherIcon = document.createElement("img");
            weatherIcon.style.display = "block";
            weatherIcon.src = "https://www.hko.gov.hk/images/HKOWxIconOutline/pic" + returnedData.weatherForecast[i].ForecastIcon + ".png";
            weatherIcon.style.maxWidth = "50px";
            weatherIcon.style.height = "auto";
            weatherIcon.style.marginLeft = "auto";
            weatherIcon.style.marginRight = "auto";
            column.appendChild(weatherIcon);
            var temperatureText = document.createTextNode(returnedData.weatherForecast[i].forecastMintemp.value + "-" + returnedData.weatherForecast[i].forecastMaxtemp.value + " °C");
            column.appendChild(temperatureText);
            var lineBreak = document.createElement("br");
            column.appendChild(lineBreak);
            var humidityText = document.createTextNode(returnedData.weatherForecast[i].forecastMinrh.value + "-" + returnedData.weatherForecast[i].forecastMaxrh.value + " %");
            column.appendChild(humidityText);

            row.appendChild(column);
        }
        document.getElementById(elementID).appendChild(row);
    }


    /* ---------- Grid Container ---------- */

    // contentID
    var content = document.createElement("div");
    content.id = "contentID";
    content.className = "gridContainer";

        /* ---------- Title ---------- */

        // titleID
        var title = document.createElement("div");  // Create div element
        title.id = "titleID";   // Set the element ID
        title.className = "gridHeader";
        var titleText = document.createTextNode("My Weather Portal");   // Create text node under the div element
        title.appendChild(titleText);   // Append text node to div
        content.appendChild(title);   // Append div element to document

        /* ---------- Header Block ---------- */

        // headerBlockID
        var headerBlock = document.createElement("div");
        headerBlock.id = "headerBlockID";
        headerBlock.className = "gridWide";

        // headerBlockLocationID
        var headerBlockLocation = document.createElement("div");
        headerBlockLocation.id = "headerBlockLocationID";
        var headerBlockLocationText = document.createTextNode("Hong Kong");
        headerBlockLocation.appendChild(headerBlockLocationText);
        headerBlock.appendChild(headerBlockLocation);

        // headerBlockWeatherIconContainerID
        var headerBlockWeatherIconContainer = document.createElement("table");
        headerBlockWeatherIconContainer.id = "headerBlockWeatherIconContainerID";
        headerBlock.appendChild(headerBlockWeatherIconContainer);
        var headerBlockWeatherIconContainerRow = document.createElement("tr");
        headerBlockWeatherIconContainer.appendChild(headerBlockWeatherIconContainerRow);

        // headerBlockWeatherIconID
        var headerBlockWeatherIconContainerColumnIcon = document.createElement("td");
        headerBlockWeatherIconContainerRow.appendChild(headerBlockWeatherIconContainerColumnIcon);
        var headerBlockWeatherIcon = document.createElement("img");
        headerBlockWeatherIcon.id = "headerBlockWeatherIconID";
        headerBlockWeatherIconContainerColumnIcon.appendChild(headerBlockWeatherIcon);

        // headerBlockTemperatureContainerID
        var headerBlockTemperatureContainer = document.createElement("table");
        headerBlockTemperatureContainer.id = "headerBlockTemperatureContainerID";
        headerBlock.appendChild(headerBlockTemperatureContainer);
        var headerBlockTemperatureContainerRow = document.createElement("tr");
        headerBlockTemperatureContainer.appendChild(headerBlockTemperatureContainerRow);

        // headerBlockTemperatureID
        var headerBlockTemperatureContainerColumnText = document.createElement("td");
        headerBlockTemperatureContainerRow.appendChild(headerBlockTemperatureContainerColumnText);
        var headerBlockTemperature = document.createElement("div");
        headerBlockTemperature.id = "headerBlockTemperatureID";
        headerBlockTemperatureContainerColumnText.appendChild(headerBlockTemperature);

        // headerBlockHumidityContainerID
        var headerBlockHumidityContainer = document.createElement("table");
        headerBlockHumidityContainer.id = "headerBlockHumidityContainerID";
        headerBlock.appendChild(headerBlockHumidityContainer);
        var headerBlockHumidityContainerRow = document.createElement("tr");
        headerBlockHumidityContainer.appendChild(headerBlockHumidityContainerRow);

        // headerBlockHumidityIconID
        var headerBlockHumidityContainerColumnIcon = document.createElement("td");
        headerBlockHumidityContainerRow.appendChild(headerBlockHumidityContainerColumnIcon);
        var headerBlockHumidityIcon = document.createElement("img");
        headerBlockHumidityIcon.id = "headerBlockHumidityIconID";
        headerBlockHumidityIcon.src = 'images/drop-48.png';
        headerBlockHumidityContainerColumnIcon.appendChild(headerBlockHumidityIcon);

        // headerBlockHumidityID
        var headerBlockHumidityContainerColumnText = document.createElement("td");
        headerBlockHumidityContainerRow.appendChild(headerBlockHumidityContainerColumnText);
        var headerBlockHumidity = document.createElement("div");
        headerBlockHumidity.id = "headerBlockHumidityID";
        headerBlockHumidityContainerColumnText.appendChild(headerBlockHumidity);

        // headerBlockRainfallContainerID
        var headerBlockRainfallContainer = document.createElement("table");
        headerBlockRainfallContainer.id = "headerBlockRainfallContainerID";
        headerBlock.appendChild(headerBlockRainfallContainer);
        var headerBlockRainfallContainerRow = document.createElement("tr");
        headerBlockRainfallContainer.appendChild(headerBlockRainfallContainerRow);

        // headerBlockRainfallIconID
        var headerBlockRainfallContainerColumnIcon = document.createElement("td");
        headerBlockRainfallContainerRow.appendChild(headerBlockRainfallContainerColumnIcon);
        var headerBlockRainfallIcon = document.createElement("img");
        headerBlockRainfallIcon.id = "headerBlockRainfallIconID";
        headerBlockRainfallIcon.src = 'images/rain-48.png';
        headerBlockRainfallContainerColumnIcon.appendChild(headerBlockRainfallIcon);

        // headerBlockRainfallID
        var headerBlockRainfallContainerColumnText = document.createElement("td");
        headerBlockRainfallContainerRow.appendChild(headerBlockRainfallContainerColumnText);
        var headerBlockRainfall = document.createElement("div");
        headerBlockRainfall.id = "headerBlockRainfallID";
        headerBlockRainfallContainerColumnText.appendChild(headerBlockRainfall);

        // headerBlockUVContainerID
        var headerBlockUVContainer = document.createElement("table");
        headerBlockUVContainer.id = "headerBlockUVContainerID";
        headerBlock.appendChild(headerBlockUVContainer);
        var headerBlockUVContainerRow = document.createElement("tr");
        headerBlockUVContainer.appendChild(headerBlockUVContainerRow);

        // headerBlockUVIconID
        var headerBlockUVContainerColumnIcon = document.createElement("td");
        headerBlockUVContainerRow.appendChild(headerBlockUVContainerColumnIcon);
        var headerBlockUVIcon = document.createElement("img");
        headerBlockUVIcon.id = "headerBlockUVIconID";
        headerBlockUVIcon.src = 'images/UVindex-48.png';
        headerBlockUVContainerColumnIcon.appendChild(headerBlockUVIcon);

        // headerBlockUVID
        var headerBlockUVContainerColumnText = document.createElement("td");
        headerBlockUVContainerRow.appendChild(headerBlockUVContainerColumnText);
        var headerBlockUV = document.createElement("div");
        headerBlockUV.id = "headerBlockUVID";
        headerBlockUVContainerColumnText.appendChild(headerBlockUV);

        // headerBlockUpdateID
        var headerBlockUpdate = document.createElement("div");
        headerBlockUpdate.id = "headerBlockUpdateID";
        headerBlock.appendChild(headerBlockUpdate);

        // headerBlockWarningID
        var headerBlockWarning = document.createElement("div");
        headerBlockWarning.id = "headerBlockWarningID";
        var headerBlockWarningText = document.createTextNode("Warning");
        headerBlockWarning.appendChild(headerBlockWarningText);
        headerBlock.appendChild(headerBlockWarning);

        // headerBlockWarningMessageID
        var headerBlockWarningMessage = document.createElement("div");
        headerBlockWarningMessage.id = "headerBlockWarningMessageID";
        headerBlock.appendChild(headerBlockWarningMessage);

        headerBlockWarning.onclick = function() {
            // Show warning
            headerBlockWarning.style.display = "none";
            headerBlockWarningMessage.style.display = "block";
        };
        headerBlockWarningMessage.onclick = function() {
            // Hide warning
            headerBlockWarningMessage.style.display = "none";
            headerBlockWarning.style.display = "block";
        };
        
        content.appendChild(headerBlock);


        /* ---------- MyData Block ---------- */

        // myDataBlockID
        var myDataBlock = document.createElement("div");
        myDataBlock.id = "myDataBlockID";
        myDataBlock.className = "gridMedium";

        // myDataBlockHeadingID
        var myDataBlockHeading = document.createElement("div");
        myDataBlockHeading.id = "myDataBlockHeadingID";
        var myDataBlockHeadingText = document.createTextNode("My Location");
        myDataBlockHeading.appendChild(myDataBlockHeadingText);
        myDataBlock.appendChild(myDataBlockHeading);

        // myDataBlockRegionContainerID
        var myDataBlockRegionContainer = document.createElement("div");
        myDataBlockRegionContainer.id = "myDataBlockRegionContainerID";
        myDataBlock.appendChild(myDataBlockRegionContainer);

        // myDataBlockDistrictID
        var myDataBlockDistrict = document.createElement("div");
        myDataBlockDistrict.id = "myDataBlockDistrictID";
        myDataBlockRegionContainer.appendChild(myDataBlockDistrict);

        // myDataBlockSuburbID
        var myDataBlockSuburb = document.createElement("div");
        myDataBlockSuburb.id = "myDataBlockSuburbID";
        myDataBlockRegionContainer.appendChild(myDataBlockSuburb);

        // myDataBlockTemperatureID
        var myDataBlockTemperature = document.createElement("div");
        myDataBlockTemperature.id = "myDataBlockTemperatureID";
        myDataBlock.appendChild(myDataBlockTemperature);

        var lineBreak = document.createElement("br");
        myDataBlock.appendChild(lineBreak);
        
        // myDataBlockRainfallContainerID
        var myDataBlockRainfallContainer = document.createElement("table");
        myDataBlockRainfallContainer.id = "myDataBlockRainfallContainerID";
        myDataBlock.appendChild(myDataBlockRainfallContainer);
        var myDataBlockRainfallContainerRow = document.createElement("tr");
        myDataBlockRainfallContainer.appendChild(myDataBlockRainfallContainerRow);

        // myDataBlockRainfallIconID
        var myDataBlockRainfallContainerColumnIcon = document.createElement("td");
        myDataBlockRainfallContainerRow.appendChild(myDataBlockRainfallContainerColumnIcon);
        var myDataBlockRainfallIcon = document.createElement("img");
        myDataBlockRainfallIcon.id = "myDataBlockRainfallIconID";
        myDataBlockRainfallIcon.src = 'images/rain-48.png'
        myDataBlockRainfallContainerColumnIcon.appendChild(myDataBlockRainfallIcon);

        // myDataBlockRainfallID
        var myDataBlockRainfallContainerColumnText = document.createElement("td");
        myDataBlockRainfallContainerRow.appendChild(myDataBlockRainfallContainerColumnText);
        var myDataBlockRainfall = document.createElement("div");
        myDataBlockRainfall.id = "myDataBlockRainfallID";
        myDataBlockRainfallContainerColumnText.appendChild(myDataBlockRainfall);

        // myDataBlockAQHIContainerID
        var myDataBlockAQHIContainer = document.createElement("table");
        myDataBlockAQHIContainer.id = "myDataBlockAQHIContainerID";
        myDataBlock.appendChild(myDataBlockAQHIContainer);
        var myDataBlockAQHIContainerRow = document.createElement("tr");
        myDataBlockAQHIContainer.appendChild(myDataBlockAQHIContainerRow);

        // myDataBlockAQHIIconID
        var myDataBlockAQHIContainerColumnIcon = document.createElement("td");
        myDataBlockAQHIContainerRow.appendChild(myDataBlockAQHIContainerColumnIcon);
        var myDataBlockAQHIIcon = document.createElement("img");
        myDataBlockAQHIIcon.id = "myDataBlockAQHIIconID";
        myDataBlockAQHIContainerColumnIcon.appendChild(myDataBlockAQHIIcon);

        // myDataBlockAQHIID
        var myDataBlockAQHIContainerColumnText = document.createElement("td");
        myDataBlockAQHIContainerRow.appendChild(myDataBlockAQHIContainerColumnText);
        var myDataBlockAQHI = document.createElement("div");
        myDataBlockAQHI.id = "myDataBlockAQHIID";
        myDataBlockAQHIContainerColumnText.appendChild(myDataBlockAQHI);

        content.appendChild(myDataBlock);


        /* ---------- Temperatures Block ---------- */

        // temperaturesBlockID
        var temperaturesBlock = document.createElement("div");
        temperaturesBlock.id = "temperaturesBlockID";
        temperaturesBlock.className = "gridSmall";

        // temperaturesBlockHeadingID
        var temperaturesBlockHeading = document.createElement("div");
        temperaturesBlockHeading.id = "temperaturesBlockHeadingID";
        var temperaturesBlockHeadingText = document.createTextNode("Temperatures");
        temperaturesBlockHeading.appendChild(temperaturesBlockHeadingText);
        temperaturesBlock.appendChild(temperaturesBlockHeading);

        // temperaturesBlockPromptID
        var temperaturesBlockPrompt = document.createElement("div");
        temperaturesBlockPrompt.id = "temperaturesBlockPromptID";
        var temperaturesBlockPromptText = document.createTextNode("Select the location");
        temperaturesBlockPrompt.appendChild(temperaturesBlockPromptText);
        temperaturesBlock.appendChild(temperaturesBlockPrompt);

        // temperaturesBlockDropdownID
        var temperaturesBlockDropdown = document.createElement("select");
        temperaturesBlockDropdown.id = "temperaturesBlockDropdownID";
        temperaturesBlock.appendChild(temperaturesBlockDropdown);
        temperaturesBlockDropdown.onchange = function() {
            setTemperature(returnedData_currentWeatherReport, temperaturesBlockDropdown.value, "temperaturesBlockTemperatureID");
        }

        // temperaturesBlockTemperatureID
        var temperaturesBlockTemperature = document.createElement("div");
        temperaturesBlockTemperature.id = "temperaturesBlockTemperatureID";
        temperaturesBlock.appendChild(temperaturesBlockTemperature);

        content.appendChild(temperaturesBlock);

        
        /* ---------- 9-day Weather Forecast Block ---------- */

        // forecastBlockID
        var forecastBlock = document.createElement("div");
        forecastBlock.id = "forecastBlockID";
        forecastBlock.className = "gridWide";
        
        // forecastBlockHeadingID
        var forecastBlockHeading = document.createElement("div");
        forecastBlockHeading.id = "forecastBlockHeadingID";
        var forecastBlockHeadingText = document.createTextNode("9-Day Forecast");
        forecastBlockHeading.appendChild(forecastBlockHeadingText);
        forecastBlock.appendChild(forecastBlockHeading);

        // forecastBlockTableContainerID
        // For creating a horizontally scrollable table
        var forecastBlockTableContainer = document.createElement("div");
        forecastBlockTableContainer.id = "forecastBlockTableContainerID";
        forecastBlock.appendChild(forecastBlockTableContainer);

        // forecastBlockTableID
        var forecastBlockTable = document.createElement("table");
        forecastBlockTable.id = "forecastBlockTableID";
        forecastBlockTableContainer.appendChild(forecastBlockTable);

        content.appendChild(forecastBlock);


    document.body.appendChild(content);


    /* ---------- Main ---------- */

    // Call HKO Current Weather Report API
    fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en', {method: 'get'})
        .then(response => {
            if (response.status == 200) {
                return response.json();
            }
            else {
                console.log("HTTP return status: " + response.status);
            }
        })
        .then(data => {
            returnedData_currentWeatherReport = data;
            
            // Header Block items
            setHeaderBlockBackground(returnedData_currentWeatherReport);
            setWeatherIcon(returnedData_currentWeatherReport, "headerBlockWeatherIconID");
            setTemperature(returnedData_currentWeatherReport, "Hong Kong Observatory", "headerBlockTemperatureID");
            setHumidity(returnedData_currentWeatherReport, "headerBlockHumidityID");
            setRainfall(returnedData_currentWeatherReport, "Yau Tsim Mong", "headerBlockRainfallID");
            setUV(returnedData_currentWeatherReport, "headerBlockUVID", "headerBlockUVIconID");
            setUpdate(returnedData_currentWeatherReport, "headerBlockUpdateID");
            setWarning(returnedData_currentWeatherReport);
            hideWarning(returnedData_currentWeatherReport, "headerBlockWarningID");

            // Temperature Block item
            getWeatherStations(returnedData_currentWeatherReport, "temperaturesBlockDropdownID");
        })
        .catch(err => {
            console.log(err);
            console.log("Fetch Error!");
        });

    // Call HTML5 GeoLocation API
    getPosition = function () {
        if (navigator.geolocation) {
            return new Promise(function (resolve, reject) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
        }
        else {
            return new Promise(resolve => resolve({}));
        }
    }
    getPosition()
        .then((position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            
            // Call Reverse Geocoding API
            fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + latitude + '&lon=' + longitude + '&zoom=18&addressdetails=1', {method: 'get'})
                .then(response => {
                    if (response.status == 200) {
                        return response.json();
                    }
                    else {
                        console.log("HTTP return status: " + response.status);
                    }
                })
                .then(data => {
                    returnedData_reverseGeocoding = data;

                    setDistrict(returnedData_reverseGeocoding, "myDataBlockDistrictID");
                    setSuburb(returnedData_reverseGeocoding, "myDataBlockSuburbID");
                    setDistrictRainfall(returnedData_currentWeatherReport, returnedData_reverseGeocoding, "myDataBlockRainfallID");

                    // Call OGCIO Weather Station Information API
                    fetch('https://ogciopsi.blob.core.windows.net/dataset/weather-station/weather-station-info.json', {method: 'get'})
                        .then(response => {
                            if (response.status == 200) {
                                return response.json();
                            }
                            else {
                                console.log("HTTP return status: " + response.status);
                            }
                        })
                        .then(data => {
                            returnedData_weatherStation = data;

                            setDistrictTemperature(returnedData_currentWeatherReport, latitude, longitude, returnedData_weatherStation, "myDataBlockTemperatureID");
                        })
                        .catch(err => {
                            console.log(err);
                            console.log("Fetch Error!");
                        });

                    // Air Quality Monitoring Station Information
                    returnedData_AQHIStation = JSON.parse('[{"station":"Central/Western","lat":22.284792,"lng":114.14413907799911},{"station":"Southern","lat":22.2479312,"lng":114.1601149},{"station":"Eastern","lat":22.2830774,"lng":114.21900057191323},{"station":"Kwun Tong","lat":22.3098052,"lng":114.2315367557473},{"station":"Sham Shui Po","lat":22.330405213400752,"lng":114.15939550471612},{"station":"Kwai Chung","lat":22.356942949999997,"lng":114.1293283974214},{"station":"Tsuen Wan","lat":22.371890560773316,"lng":114.11512300841532},{"station":"Tseung Kwan O","lat":22.31754838890652,"lng":114.2602613427978},{"station":"Yuen Long","lat":22.4449384,"lng":114.0228013},{"station":"Tuen Mun","lat":22.39139578334337,"lng":113.97736173910037},{"station":"Tung Chung","lat":22.289109238190928,"lng":113.94412689677011},{"station":"Tai Po","lat":22.45125422341408,"lng":114.16439708937546},{"station":"Sha Tin","lat":22.376768772361523,"lng":114.18537610046992},{"station":"North","lat":22.496930300000002,"lng":114.12833606569419},{"station":"Tap Mun","lat":22.471330169476424,"lng":114.36096390768151},{"station":"Causeway Bay","lat":22.28050141982767,"lng":114.18588316608526},{"station":"Central","lat":22.28185169591833,"lng":114.15807261990376},{"station":"Mong Kok","lat":22.322578835466118,"lng":114.16836839255906}]');
                    
                    // Call OGCIO AQHI API
                    fetch('https://dashboard.data.gov.hk/api/aqhi-individual?format=json', {method: 'get'})
                        .then(response => {
                            if (response.status == 200) {
                                return response.json();
                            }
                            else {
                                console.log("HTTP return status: " + response.status);
                            }
                        })
                        .then(data => {
                            returnedData_AQHI = data;

                            setDistrictAQHI(returnedData_AQHI, latitude, longitude, returnedData_AQHIStation, "myDataBlockAQHIID", "myDataBlockAQHIIconID");
                        })
                        .catch(err => {
                            console.log(err);
                            console.log("Fetch Error!");
                        });
                })
                .catch(err => {
                    console.log(err);
                    console.log("Fetch Error!");
                });
        })
        .catch((err) => {
            window.alert("Please allow this web page to access your location data.");
            location.reload();  // Refresh the page
            console.error(err.message);
        });

    // Call HKO 9-day Weather Forecast Report API
    fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en', {method: 'get'})
        .then(response => {
            if (response.status == 200) {
                return response.json();
            }
            else {
                console.log("HTTP return status: " + response.status);
            }
        })
        .then(data => {
            returnedData_9DayWeatherForecastReport = data;

            setForecast(returnedData_9DayWeatherForecastReport, "forecastBlockTableID");
        })
        .catch(err => {
            console.log(err);
            console.log("Fetch Error!");
        });


    /* ---------- Responsive Layout ---------- */

    // Optimal desktop browser should have at least 1000px of screen width

    const maxMobileResolution = 750;
    const mobileResolution = 300;

    if (window.innerWidth < maxMobileResolution) {
        // Mobile interface
        document.getElementById("contentID").style.maxWidth = "300px";

        document.getElementById("headerBlockID").style.height = "250px";
        document.getElementById("headerBlockWeatherIconContainerID").style.paddingLeft = "10px";
        document.getElementById("headerBlockWeatherIconContainerID").style.float = "left";
        document.getElementById("headerBlockTemperatureContainerID").style.paddingRight = "10px";
        document.getElementById("headerBlockTemperatureContainerID").style.float = "right";
        document.getElementById("headerBlockHumidityContainerID").style.paddingLeft = "10px";
        document.getElementById("headerBlockHumidityContainerID").style.paddingTop = "15px";
        document.getElementById("headerBlockHumidityContainerID").style.float = "left";
        document.getElementById("headerBlockRainfallContainerID").style.paddingRight = "10px";
        document.getElementById("headerBlockRainfallContainerID").style.paddingTop = "15px";
        document.getElementById("headerBlockRainfallContainerID").style.float = "right";
        document.getElementById("headerBlockUVContainerID").style.paddingLeft = "10px";
        document.getElementById("headerBlockUVContainerID").style.paddingTop = "15px";
        document.getElementById("headerBlockUVContainerID").style.float = "left";

        document.getElementById("myDataBlockID").style.height = "210px";
        document.getElementById("myDataBlockID").style.gridColumnEnd = "4";
        document.getElementById("myDataBlockRegionContainerID").style.display = "block";
        document.getElementById("myDataBlockRainfallContainerID").style.paddingLeft = "30px";
        document.getElementById("myDataBlockRainfallContainerID").style.verticalAlign = "top";
        document.getElementById("myDataBlockRainfallContainerID").style.display = "inline-block";
        document.getElementById("myDataBlockAQHIContainerID").style.paddingLeft = "30px";
        document.getElementById("myDataBlockAQHIContainerID").style.verticalAlign = "top";
        lineBreak.style.display = "none";

        document.getElementById("temperaturesBlockID").style.gridColumnStart = "1";
    }
    window.addEventListener("resize", function() {
        if (window.innerWidth < maxMobileResolution) {
            // Mobile interface
            document.getElementById("contentID").style.maxWidth = "300px";

            document.getElementById("headerBlockID").style.height = "250px";
            document.getElementById("headerBlockWeatherIconContainerID").style.paddingLeft = "10px";
            document.getElementById("headerBlockWeatherIconContainerID").style.float = "left";
            document.getElementById("headerBlockTemperatureContainerID").style.paddingRight = "10px";
            document.getElementById("headerBlockTemperatureContainerID").style.paddingLeft = "0px";
            document.getElementById("headerBlockTemperatureContainerID").style.float = "right";
            document.getElementById("headerBlockHumidityContainerID").style.paddingLeft = "10px";
            document.getElementById("headerBlockHumidityContainerID").style.paddingTop = "15px";
            document.getElementById("headerBlockHumidityContainerID").style.float = "left";
            document.getElementById("headerBlockRainfallContainerID").style.paddingRight = "10px";
            document.getElementById("headerBlockRainfallContainerID").style.paddingLeft = "0px";
            document.getElementById("headerBlockRainfallContainerID").style.paddingTop = "15px";
            document.getElementById("headerBlockRainfallContainerID").style.float = "right";
            if (hasUV) {
                document.getElementById("headerBlockUVContainerID").style.paddingLeft = "10px";
                document.getElementById("headerBlockUVContainerID").style.paddingTop = "15px";
                document.getElementById("headerBlockUVContainerID").style.float = "left";
            }

            document.getElementById("myDataBlockID").style.height = "210px";
            document.getElementById("myDataBlockID").style.gridColumnEnd = "4";
            document.getElementById("myDataBlockRegionContainerID").style.display = "block";
            document.getElementById("myDataBlockRainfallContainerID").style.paddingLeft = "30px";
            document.getElementById("myDataBlockRainfallContainerID").style.verticalAlign = "top";
            document.getElementById("myDataBlockRainfallContainerID").style.display = "inline-block";
            document.getElementById("myDataBlockAQHIContainerID").style.paddingLeft = "30px";
            document.getElementById("myDataBlockAQHIContainerID").style.verticalAlign = "top";
            lineBreak.style.display = "none";

            document.getElementById("temperaturesBlockID").style.gridColumnStart = "1";
        }
        else {
            // Desktop interface
            document.getElementById("contentID").style.maxWidth = "850px";

            document.getElementById("headerBlockID").style.height = "130px";
            if (hasUV == false) {
                // Increase the gap between elements when UV data is hidden
                document.getElementById("headerBlockWeatherIconContainerID").style.paddingLeft = "60px";
                document.getElementById("headerBlockTemperatureContainerID").style.paddingLeft = "60px";
                document.getElementById("headerBlockHumidityContainerID").style.paddingLeft = "60px";
                document.getElementById("headerBlockRainfallContainerID").style.paddingLeft = "60px";
            }
            else {
                document.getElementById("headerBlockWeatherIconContainerID").style.paddingLeft = "30px";
                document.getElementById("headerBlockTemperatureContainerID").style.paddingLeft = "30px";
                document.getElementById("headerBlockHumidityContainerID").style.paddingLeft = "30px";
                document.getElementById("headerBlockRainfallContainerID").style.paddingLeft = "30px";
            }
            document.getElementById("headerBlockWeatherIconContainerID").style.float = "none";
            document.getElementById("headerBlockTemperatureContainerID").style.paddingRight = "0px";
            document.getElementById("headerBlockTemperatureContainerID").style.float = "none";
            document.getElementById("headerBlockHumidityContainerID").style.paddingTop = "15px";
            document.getElementById("headerBlockHumidityContainerID").style.float = "none";
            document.getElementById("headerBlockRainfallContainerID").style.paddingRight = "0px";
            document.getElementById("headerBlockRainfallContainerID").style.paddingTop = "15px";
            document.getElementById("headerBlockRainfallContainerID").style.float = "none";
            document.getElementById("headerBlockUVContainerID").style.paddingLeft = "30px";
            document.getElementById("headerBlockUVContainerID").style.paddingTop = "0px";
            document.getElementById("headerBlockUVContainerID").style.float = "none";
            
            document.getElementById("myDataBlockID").style.height = "170px";
            document.getElementById("myDataBlockID").style.gridColumnEnd = "3";
            document.getElementById("myDataBlockRegionContainerID").style.display = "inline-block";
            document.getElementById("myDataBlockRainfallContainerID").style.paddingLeft = "60px";
            document.getElementById("myDataBlockRainfallContainerID").style.verticalAlign = "middle";
            document.getElementById("myDataBlockRainfallContainerID").style.display = "inline";
            document.getElementById("myDataBlockAQHIContainerID").style.paddingLeft = "60px";
            document.getElementById("myDataBlockAQHIContainerID").style.verticalAlign = "middle";
            lineBreak.style.display = "inline";
            
            document.getElementById("temperaturesBlockID").style.gridColumnStart = "3";
        }
    });

}