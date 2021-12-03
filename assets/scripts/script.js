document.querySelector(".search").addEventListener("submit", async (event) => {
  event.preventDefault();

  let input = document.querySelector("#local").value;
  if(input !== "") {
    clearInfo();
    warning("Carregando...");

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input)}&appid=c66ade162ec08601efc2c116686aab68&units=metric&lang=pt_br`;
    let results = await fetch(url);
    let json = await results.json();

    if(json.cod === 200) {
      showInfo({
        name: json.name,
        country: json.sys.country,
        temp: json.main.temp,
        tempSens: json.main.feels_like,
        tempMax: json.main.temp_max,
        tempMin: json.main.temp_min,
        tempIcon: json.weather[0].icon,
        tempDesc: json.weather[0].description,
        windSpeed: json.wind.speed,
        windDeg: json.wind.deg,
        humidity: json.main.humidity
      });
    } else {  
      clearInfo();
      warning("Localização não encontrada.")
    }
  }
});

function warning(msg) {
  let warning = document.querySelector(".warning");
  warning.style.visibility = "visible";
  warning.style.opacity = "1";
  warning.innerHTML = msg;
}

function showInfo(json) {
  warning("");

  // Definindo o período entre dia e noite com base no ícone usado
  let periodo = json.tempIcon[2] === "d" ? "dia":"noite";

  // Mudando para maiúscula a primeira letra da descrição
  let desc = JSON.stringify(json.tempDesc);
  desc = `"` + desc.charAt(1).toUpperCase() + desc.slice(2);
  json.tempDesc = JSON.parse(desc);

  // Local de busca
  document.querySelector(".info-local").innerHTML = `${json.name}, ${json.country}`;

  // Elementos do vento
  document.querySelector("#wind .display .info-data").innerHTML = `${json.windSpeed}`;
  document.querySelector(".wind .direction").style.transform = `rotate(${json.windDeg}deg)`;

  // Elementos da temperatura
  document.querySelector("#temp .display .info-data").innerHTML = `${json.temp}`;
  document.querySelector("#temp .temp-max .max-value").innerHTML = `${json.tempMax}<sup>°C</sup>`;
  document.querySelector("#temp .temp-min .min-value").innerHTML = `${json.tempMin}<sup>°C</sup>`;
  document.querySelector("#temp .thermometer #thermo").value = json.temp;

  // Elementos da umidade do ar
  document.querySelector("#humidity .display .info-data").innerHTML = `${json.humidity}`;
  document.querySelector("#air-humidity").value = json.humidity;
  
  // Info extra
  document.querySelector("#weather").setAttribute("src", `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
  document.querySelector(".extra-info-text .desc").innerHTML = json.tempDesc;
  document.querySelector(".extra-info-text .regular-text").innerHTML = `Atualmente é ${periodo} em ${json.name}, com uma sensação térmica de ${json.tempSens}<sup>°C</sup>`

  document.querySelector(".info").style.position = "unset";
  document.querySelector(".info").style.zIndex = 0;
  document.querySelector(".info").style.visibility = "visible";
  document.querySelector(".info").style.opacity = "1";
}

function clearInfo(){
  warning("");
  
  document.querySelector(".info").style.position = "absolute";
  document.querySelector(".info").style.zIndex = -1;
  document.querySelector(".info").style.visibility = "hidden";
  document.querySelector(".info").style.opacity = "0";
}
