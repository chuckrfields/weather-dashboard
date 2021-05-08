var openWeatherMapAPI = '41dcd9d8063f4abb3ee28c6c6fbc6354';
var geocodeAPI ='423944751040149669013x70740';
var citiesContainerEL = document.querySelector("#cities-container");
var weatherContainerEL = document.querySelector("#weather-container");
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
    weatherContainerEL.textContent = "";
    cityTitleEL.textContent = "";

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

var getCityForecast = function(city) {
    // get five-day forecast for city
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=41dcd9d8063f4abb3ee28c6c6fbc6354";
    fetch(apiURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    // console.log(data);
                    displayForecast(data);
                });
            }
            else {
                alert("Unable to get forecast for " + city);
            }
        })
        .catch(function(error) {
            // 404 error returned
            alert("Unable to connect to OpenWeatherMap.org");
        });
}

var displayWeather = function(city, data) {
    console.log(data);
    // weatherContainerEL.textContent = "";
    // cityTitleEL.textContent = "";

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
    console.log(today);
    console.log(data.current.weather[0].icon);
    // citySearchTerm.textContent = city + ' (' + today + ') ' 
    var cityHeading = document.createElement('h1');
    cityHeading.textContent = city + ' (' + today + ') ' ;
    cityHeading.setAttribute("class", "subtitle");
    
    var weatherImage = document.createElement("img");
    var iconURL = 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png';
    weatherImage.setAttribute("src", iconURL);
    weatherImage.setAttribute("class", "weather-icon");
    console.log(iconURL);
    // cityHeading.appendChild(weatherImage);
    cityTitleEL.appendChild(cityHeading);
    cityTitleEL.appendChild(weatherImage);
    // weatherIcon.innerHTML = icon;

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
    var currentHumidity = document.createElement('p');
    currentHumidity.textContent = "Humidity: " + data.current.humidity + ' %';
    cityTitleEL.appendChild(currentHumidity);

    // uv index
    var currentUV = document.createElement('p');
    currentUV.textContent = "UV Index: " + data.current.uvi;
    cityTitleEL.appendChild(currentUV);

}

var displayForecast = function(forecast) {
    console.log(forecast);
    weatherContainerEL.textContent = "";

    // check if api returned forecast
    if (forecast.length === 0) {
        weatherContainerEL.textContent = "No forecast found";
        return;
    }

    // loop through 5-day forecast

}

getCityCoordinates("Indianapolis");