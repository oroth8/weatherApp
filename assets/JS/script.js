$(document).ready(function () {

    var cities = [];

    $("#btn").on("click", function (event) {
        event.preventDefault();
        var userInput = $("#search").val().toUpperCase().trim();
        newBtn = $("<button>");
        newBtn.attr("class", "list-group-item list-group-item-action");
        newBtn.attr("type", "button");
        newBtn.attr("id", "btnLi");
        newBtn.text(userInput);
        $(".list-group").append(newBtn);
        cities.push(userInput);
        displayWeather(userInput);
        displayForecast(userInput);

        cities = [];
    });

    $(document).on("click", ".list-group-item", activeBtn);

    function activeBtn() {
        $(".list-group-item").attr("class", "list-group-item list-group-item-action");
        $(this).attr("class", "list-group-item list-group-item-action active");
        displayWeather($(this).text());
        displayForecast($(this).text());
    }

    function displayWeather(city) {
        var APIKey = "0802b43ec08a1502c85c76efb5c718a5";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
        // We then created an AJAX call
        $.ajax({url: queryURL, method: "GET"}).then(function (response) {

            var tempK = response.main.temp;
            var tempCalc = ((tempK - 273.15) * 9 / 5 + 32).toFixed(0);

            var tempKH = response.main.temp_max;
            var tempCalcH = ((tempK - 273.15) * 9 / 5 + 32).toFixed(0);

            var tempKL = response.main.temp_min;
            var tempCalcL = ((tempK - 273.15) * 9 / 5 + 32).toFixed(0);

            var cityH1 = $("<h1>").text(city);
            var temp = $("<h4>").text("Current Temperature: " + tempCalc + "F");
            temp.attr("id", "temp");
            var tempH = $("<h4>").text("High: " + tempCalc + "F");
            var tempL = $("<h4>").text("Low: " + tempCalc + "F");
            var humidity = $("<h4>").text("Humidity: " + response.main.humidity + "%");
            var wind = $("<h4>").text("Wind Speed: " + response.wind.speed + " MPH");

            $("#dayW").empty();

            displayDate();
            displayUV(response.coord.lon, response.coord.lat);

            $("#dayW").append(cityH1);
            $("#dayW").append(temp);
            $("#dayW").append(tempH);
            $("#dayW").append(tempL);
            $("#dayW").append(humidity);
            $("#dayW").append(wind);


        });
    }
    function displayForecast(city) {
        $("#forecastContainer").attr("style", "visibility: visible;");
        var fiveDay = new Date();
        var month = fiveDay.getMonth() + 1;
        var today = fiveDay.getDate();
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var APIKey = "0802b43ec08a1502c85c76efb5c718a5";
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
        // We then created an AJAX call
        $.ajax({url: queryURL, method: "GET"}).then(function (response) {
            var dayCount = 0;
            for (var i = 0; i < response.list.length; i += 4) {

                var tempK = response.list[i].main.temp;
                var tempCalc = ((tempK - 273.15) * 9 / 5 + 32).toFixed(0);

                var temp = $("<h6>").text("Temp: " + tempCalc + " F");
                var humidity = $("<h6>").text(response.list[i].main.humidity + " %");
                var wind = $("<h6>").text(response.list[i].wind.speed + " MPH");

                $("#box" + dayCount).empty();

                display5Days(dayCount);

                $("#box" + dayCount).append(temp);
                $("#box" + dayCount).append(humidity);
                $("#box" + dayCount).append(wind);

                displayIcon(dayCount, response.list[i].weather[0].description);

                dayCount++;
            }

        })
    }


    function displayDate() {
        var fullDate = new Date();
        var dateH2 = $("<h2>");
        dateH2.text("Today's Date: " + (
            fullDate.getMonth() + 1
        ) + "/" + (
            fullDate.getDate()
        ) + "/" + (
            fullDate.getFullYear()
        ));
        $("#dayW").append(dateH2);


    }

    function display5Days(day) {
        let days = [];
        let daysRequired = 7

        for (let i = 1; i <= daysRequired; i++) { // 'dddd, Do MMMM YYYY'
            days.push(moment().add(i, 'days').format('dddd, Do'))
        }
        $("#box" + day).append(days[day]);
    }

    $("#btn").on("click", function () {
        var lastInput = $("#search").val().toUpperCase().trim();
        localStorage.setItem("LastSearch", lastInput);
    })

    function displayLastSearch() {
        lastSearch = localStorage.getItem("LastSearch");
        $("#search").val(lastSearch);
    }
    displayLastSearch();

    function displayUV(lon, lat) {
        var APIKey = "0802b43ec08a1502c85c76efb5c718a5";
        var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
        // We then created an AJAX call
        $.ajax({url: queryURL, method: "GET"}).then(function (response) {

            var uvIndex = response.value;

            $("#temp").append($("<span id=UV></span>"));

            uvDisplay = $("<h1 id=uv-val>").text("UV Index: " + uvIndex);
            $("#UV").append(uvDisplay);

            if (uvIndex <= 4) {
                $("#uv-val").attr("style", "color: #28a745;");
            } else if (uvIndex > 4 && uvIndex <= 7) {
                $("#uv-val").attr("style", "color: #ffc107;");
            } else if (uvIndex > 7) {
                $("#uv-val").attr("style", "color: #dc3545;");
            }
        });
    }
    function displayIcon(boxNum, code) {
        iconDiv = $("<div id=icon><img id=wicon" + boxNum + " src= alt=Weather icon></div>");
        $("#box" + boxNum).append(iconDiv);

        var iconCode;

        if (code == "clear sky") {
            iconCode = "01d";
        } else if (code == "few clouds") {
            iconCode = "02d";
        } else if (code == "scattered clouds") {
            iconCode = "03d";
        } else if (code == "broken clouds") {
            iconCode = "04d";
        } else if (code == "shower rain") {
            iconCode = "09d";
        } else if (code == "rain") {
            iconCode = "10d";
        } else if (code == "thunderstorm") {
            iconCode = "11d";
        } else if (code == "snow") {
            iconCode = "13d";
        } else {
            iconCode = "50d"
        }

        var iconurl = "https://openweathermap.org/img/w/" + iconCode + ".png";

        $('#wicon' + boxNum).attr('src', iconurl);
    }
});
