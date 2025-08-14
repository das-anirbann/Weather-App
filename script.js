const apiKey = "bfd23b8aa8ea3f47553737840bb4369d";
const apiUrl= "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchButton = document.querySelector(".search-btn");
const WeatherIcon = document.querySelector(".Weather-icon");
const suggestionsDiv = document.querySelector(".suggestions");
const geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q="
const clearBtn = document.querySelector(".clear-btn");
const weatherDiv = document.querySelector(".Weather");
const errorDiv = document.querySelector(".error");
const searchInput = document.querySelector(".search input");
let currentSuggestionIndex = -1;

const cities = [];

    async function checkWeather(city) {
            if(!city || city.trim() === ""){
                errorDiv.innerHTML = "<p> please enter a city name first</p>";
                errorDiv.style.display = "block";
                weatherDiv.style.display = "none";
                return;
                
            }
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`)
    if(response.status == 404){
        errorDiv.innerHTML = "<p>Invalid city name </p>";
        errorDiv.style.display = "block";
        weatherDiv.style.display = "none";
        return;
    }
    const data = await response.json();
    if(data.cod && data.cod === "404"){
               errorDiv.innerHTML = "<p>Invalid city name </p>";
               document.querySelector(".error").style.display="block";
               document.querySelector(".Weather").style.display="none";
               return;
        }
    else{

       
            
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        if(data.weather[0].main === "Clear"){
            WeatherIcon.src = "images/clear.png";
        }
                else if(data.weather[0].main === "Clouds"){
            WeatherIcon.src = "images/cloudy.png";
        }
                else if(data.weather[0].main === "Rain"){
            WeatherIcon.src = "images/rainy-day.png";
        }
                else if(data.weather[0].main === "Drizzle"){
            WeatherIcon.src = "images/drizzle.png";
        }
                else if(data.weather[0].main === "Mist"){
            WeatherIcon.src = "images/mist.png";
        }
                else if(data.weather[0].main === "Snow"){
            WeatherIcon.src = "images/Clouds.png";
        }
                else {
            WeatherIcon.src = "images/default.png";
        }

        document.querySelector(".Weather").style.display = "block";
        document.querySelector(".error").style.display="none";
        document.querySelector(".clear-btn").style.display="flex";
        weatherDiv.classList.remove("blur");    
    }
    }
//search button click
searchButton.addEventListener("click", ()=> {
    checkWeather(searchBox.value.trim());
    suggestionsDiv.innerHTML = "";
});

//keyboard events
searchBox.addEventListener("keyup", (event)=>{
    if(event.key === "ArrowDown" || event.key ==="ArrowUp"){
        return;
    }
    if(event.key === "Enter"){
        event.preventDefault();
        if(currentSuggestionIndex < 0){ 
          checkWeather(searchBox.value.trim());
          suggestionsDiv.innerHTML = "";
    }
   return;
   }
   showSuggestions(searchBox.value.trim());
});

//keyboard navigation for suggestions
searchBox.addEventListener("keydown", (event)=>{
    const items = suggestionsDiv.querySelectorAll(".suggestions-item");
    if(items.length === 0){
        return;
    }
    if(event.key === "ArrowDown"){
        event.preventDefault();
        currentSuggestionIndex = (currentSuggestionIndex + 1) % items.length;
        HighlightSuggestion(items);
    }
    else if(event.key === "ArrowUp"){
        event.preventDefault();
        currentSuggestionIndex = (currentSuggestionIndex -1 + items.length)% items.length;
        HighlightSuggestion(items);
    }
    else if(event.key === "Enter" && currentSuggestionIndex >= 0 ){
        event.preventDefault();
        searchBox.value = items[currentSuggestionIndex].textContent;
        suggestionsDiv.innerHTML ="";
        checkWeather(searchBox.value.trim());
        currentSuggestionIndex = -1;
    }
});

function HighlightSuggestion(items){
    items.forEach((item, index)=>{
        if(index === currentSuggestionIndex){
            item.classList.add("highlight");
        }else{
            item.classList.remove("highlight");
        }
    });
}

async function showSuggestions(input){
    suggestionsDiv.innerHTML ="";
    currentSuggestionIndex = -1;
    if(!input){
      return;
    }
try{
     const res = await fetch(`${geoUrl}${encodeURIComponent(input)}&limit=5&appid=${apiKey}`);
     const data = await res.json();

     if(data.length === 0){
        suggestionsDiv.style.display ="none";
        return;
     }

//     suggestionsDiv.innerHTML= "";

     data.forEach(place => {
        const cityName = `${place.name},${place.state || ""}, ${place.country}`;
        const div = document.createElement("div");
        div.classList.add("suggestions-item");
        div.textContent = cityName;
        div.addEventListener("click", () => {
            searchBox.value = place.name;
            suggestionsDiv.innerHTML = "";
            checkWeather(place.name);
        });
        suggestionsDiv.appendChild(div);
    });
    suggestionsDiv.style.display= "block";
}catch(error){
    console.error("error fetching suggestions", error);
}
}

clearBtn.addEventListener("click",()=>{
    searchBox.value = "";
    suggestionsDiv.innerHTML ="";
    suggestionsDiv.style.display = "none";
    weatherDiv.style.display = "none";
    errorDiv.style.display = "none";
    clearBtn.style.display="none";
    searchBox.focus();
});
searchBox.addEventListener("input",()=>{
    const value = searchBox.value.trim();

    if(value!== ""){
        
        clearBtn.style.display = "flex";
        suggestionsDiv.style.display = "block";
        weatherDiv.classList.add("blur");

    }else{

      clearBtn.style.display = "none";
      suggestionsDiv.innerHTML = "";
      suggestionsDiv.style.display = "none";
      weatherDiv.style.display = "none";
      errorDiv.style.display = "none";
      weatherDiv.classList.remove("blur");
    }
});
searchBox.addEventListener("focus", ()=>{
    if (errorDiv.style.display === "block" && errorDiv.textContent.includes("please enter a city name first")){
        errorDiv.style.display= "none";
    }
})