var openWeatherMapAPI = '41dcd9d8063f4abb3ee28c6c6fbc6354';
var geocodeAPI ='423944751040149669013x70740';
var citiesContainerEL = document.querySelector("#cities-container");
var weatherContainerEL = document.querySelector("#weather-container");
var forecastContainerEL = document.querySelector("#forecast-container");
var cityFormEL = document.querySelector("#city-form");
var cityTitleEL  = document.querySelector("#city-title");
var cityNameEL = document.querySelector("#cityname");

var formSubmitHander = function(event) {
    event.preventDefault();
    /*
    event.preventDefault() stops the browser from performing the default action the event wants it to do. 
    In the case of submitting a form, it prevents the browser from sending the form's input data to a URL, 
    as we'll handle what happens with the form input data ourselves in JavaScript.
    */
    weatherContainerEL.textContent = "";
    cityTitleEL.textContent = "";
    forecastContainerEL.textContent = "";

    var cityname = cityNameEL.value.trim();
    if (cityname) {
        // format city name - Capitalize first letter of word(s) in city name
        var cityWords = cityname.toLowerCase().split(' ');
        for (var i = 0; i < cityWords.length; i++) {
            cityWords[i] = cityWords[i].charAt(0).toUpperCase() + cityWords[i].substring(1);
        }
        cityname = cityWords.join(' ');
        getCityCoordinates(cityname);
        cityNameEL.value = '';
    }
    else {
        alert("Please enter a city");
    }
}

cityFormEL.addEventListener("submit", formSubmitHander);


var getCityCoordinates = function(city) {

    var apiURL = "https://geocode.xyz/" + city + "?geoit=JSON&auth=" + geocodeAPI;
    console.log(apiURL);
    fetch(apiURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                     console.log(data);
                    var lat = data.latt;
                    var long = data.longt;

                    if (lat == "0.00000" && long == "0.00000") {
                        alert(city + " not found!");
                        return;
                    }
                    getCityWeather(lat, long, city);
                });
            }
            else {
                alert("Unable to get weather for " + city);
            }
        })
        .catch(function(error) {
            // 404 error returned
            alert("Unable to connect to OpenWeatherMap.org");
        });
};

var getUVIndexColorClass = function(uvIndex) {
    if (uvIndex < 3) {
        return "favorable";
    }
    else if (uvIndex <8) {
        return "moderate";
    }
    else {
        return "severe";
    }
}

var getCityWeather = function(lat, long, city) {
    // get current weather conditions for city
    // var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=41dcd9d8063f4abb3ee28c6c6fbc6354";
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&APPID=" + openWeatherMapAPI;
    fetch(apiURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    // console.log(data);
                    displayWeather(city, data);
                });
            }
            else {
                alert("Unable to get weather for " + city);
            }
        })
        .catch(function(error) {
            // 404 error returned
            alert("Unable to connect to OpenWeatherMap.org");
        });
};

// var getCityForecast = function(city) {
//     // get five-day forecast for city
//     var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=41dcd9d8063f4abb3ee28c6c6fbc6354";
//     fetch(apiURL)
//         .then(function(response) {
//             if (response.ok) {
//                 response.json().then(function(data) {
//                     // console.log(data);
//                     displayForecast(data);
//                 });
//             }
//             else {
//                 alert("Unable to get forecast for " + city);
//             }
//         })
//         .catch(function(error) {
//             // 404 error returned
//             alert("Unable to connect to OpenWeatherMap.org");
//         });
// }

var displayWeather = function(city, data) {
    console.log(data);

    // check if api returned forecast
    if (data.length === 0) {
        weatherContainerEL.textContent = "No weather found";
        return;
    }

    // loop current weather
    // city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, 
    // and the UV index (color that indicates whether the conditions are favorable, moderate, or severe)
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    // console.log(today);
    // console.log(data.current.weather[0].icon);
    // citySearchTerm.textContent = city + ' (' + today + ') ' 
    var cityHeading = document.createElement('h1');
    cityHeading.textContent = city + ' (' + today + ') ' ;
    cityHeading.setAttribute("class", "subtitle");
    
    var weatherImage = document.createElement("img");
    var iconURL = 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png';
    weatherImage.setAttribute("src", iconURL);
    weatherImage.setAttribute("class", "weather-icon");
    // console.log(iconURL);
    cityTitleEL.appendChild(cityHeading);
    cityTitleEL.appendChild(weatherImage);

    //temperature
    var currentTemperatureEL = document.createElement("p");
    var tempKelvin = data.current.temp;
    var currentTempF = (tempKelvin - 273.15) * (9/5) + 32;
    currentTemperatureEL.textContent = "Temp: " + currentTempF.toFixed(2) + "˚ F";
    cityTitleEL.appendChild(currentTemperatureEL);

    // wind
    var currentWindEL = document.createElement("p");
    currentWindEL.textContent = "Wind: " + data.current.wind_speed + ' MPH';
    cityTitleEL.appendChild(currentWindEL);

    // humidity
    var currentHumidityEL = document.createElement('p');
    currentHumidityEL.textContent = "Humidity: " + data.current.humidity + ' %';
    cityTitleEL.appendChild(currentHumidityEL);

    // uv index
    var currentUVDiv = document.createElement('div');
    var currentUV = data.current.uvi;
    var currentUVEL = document.createElement('label');
    var currentUVLevelEL = document.createElement('label');
    currentUVEL.textContent = "UV Index: "
    currentUVLevelEL.textContent = currentUV;
    currentUVLevelEL.setAttribute("class", getUVIndexColorClass(currentUV));
    currentUVLevelEL.setAttribute("padding", "5px");
    currentUVDiv.appendChild(currentUVEL);
    currentUVDiv.appendChild(currentUVLevelEL);
    cityTitleEL.appendChild(currentUVDiv);
    cityTitleEL.appendChild(document.createElement("p"));

    displayForecast(data);
}

var displayForecast = function(data) {
    // console.log(data);
    forecastContainerEL.textContent = "";
    var containerEL = document.createElement("div");
    containerEL.setAttribute("class", "container");
    var rowEL = document.createElement("div");
    rowEL.setAttribute("class", "row");

    // check if api returned forecast
    if (data.length === 0) {
        forecastContainerEL.textContent = "No forecast found";
        return;
    }

    // loop through 5-day forecast in daily array
    var dailyArr = data.daily;
    // console.log(dailyArr);
    for (var i = 0; i< 5; i++) {
        console.log(dailyArr[i]);
        // get date
        var date = dailyArr[i].dt;
        var convertedDate = new Date(date * 1000).toLocaleString();
        // console.log(date);

        var randomFormat = 'MM/DD/YYYY';
        var convertedForecastDate = moment(convertedDate, randomFormat);
        console.log(convertedForecastDate.format('MM/DD/YYYY'));

        console.log(dailyArr[i].weather[0].icon);

        //forecastContainerEL

        var colEL = document.createElement("div");
        colEL.setAttribute("class", "col col-md-2.5");
        var cardEL = document.createElement("div");
        cardEL.classList = "card text-white bg-secondary mb-3";
        var cardHeaderEL = document.createElement("div");
        cardHeaderEL.setAttribute("class", "card-header");
        cardHeaderEL.textContent = convertedForecastDate.format('MM/DD/YYYY');

        var cardBodyEL = document.createElement("div");
        cardBodyEL.setAttribute("class", "card-body");

        //icon
        var weatherImage = document.createElement("img");
        var iconURL = 'http://openweathermap.org/img/wn/' + dailyArr[i].weather[0].icon + '@2x.png';
        weatherImage.setAttribute("src", iconURL);
        weatherImage.setAttribute("class", "weather-icon");
        // console.log(iconURL);
        cardBodyEL.appendChild(weatherImage);

        //temperature
        var forecastTemperatureEL = document.createElement("p");
        var tempKelvin = dailyArr[i].temp.day;
        var forecastTempF = (tempKelvin - 273.15) * (9/5) + 32;
        forecastTemperatureEL.textContent = "Temp: " + forecastTempF.toFixed(2) + "˚ F";
        cardBodyEL.appendChild(forecastTemperatureEL);

        // wind
        var forecastWindEL = document.createElement("p");
        var windSpeed = dailyArr[i].wind_speed; 
        forecastWindEL.textContent = "Wind: " + windSpeed.toFixed(2) + ' MPH';
        cardBodyEL.appendChild(forecastWindEL);

         // humidity
        var forecastHumidityEL = document.createElement('p');
        forecastHumidityEL.textContent = "Humidity: " + dailyArr[i].humidity + ' %';
        cardBodyEL.appendChild(forecastHumidityEL);

        cardEL.appendChild(cardHeaderEL);
        cardEL.appendChild(cardBodyEL);
        colEL.appendChild(cardEL);

        rowEL.appendChild(colEL);
    }
    
    containerEL.appendChild(rowEL);

    forecastContainerEL.appendChild(containerEL);
}

getCityCoordinates("Indianapolis");