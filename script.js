/*BUSCA USANDO EL NOMBRE DE UNA CIUDAD (por ejemplo, athens) O UN NOMBRE DE CIUDAD SEPARADO POR COMA JUNTO CON EL CÓDIGO DEL PAÍS (por ejemplo, athens,gr)*/
const form = document.querySelector(".primera_seccion form");
const input = document.querySelector(".primera_seccion input");
const msg = document.querySelector(".primera_seccion .msg");
const list = document.querySelector(".segunda_seccion .cities");
/*PON TU PROPIA CLAVE AQUÍ - REGISTRARSE EN OPENWEATHERMAP PARA OBTENER UNA CLAVE API GRATUITA. https://home.openweathermap.org/users/sign_up
SUSCRÍBETE AQUÍ: https://home.openweathermap.org/users/sign_up*/
const apiKey = "6a9b8a5f27c70505cfc12db66f1781ec";

form.addEventListener("submit", e => {
    e.preventDefault();
    const inputVal = input.value.trim();

    if (!inputVal) {
        msg.textContent = "Por favor, ingresa el nombre de una ciudad.";
        return;
    }

    const existingCity = Array.from(list.querySelectorAll(".city")).find(item => {
        const cityName = item.querySelector(".city-name span").textContent.toLowerCase();
        return cityName === inputVal.toLowerCase();
    });

    if (existingCity) {
        msg.textContent = "Ya has buscado esta ciudad.";
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ciudad no encontrada");
            }
            return response.json();
        })
        .then(data => {
            const { main, name, sys, weather } = data;
            const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

            const li = document.createElement("li");
            li.classList.add("city");
            const markup = `
                <h2 class="city-name" data-name="${name},${sys.country}">
                    <span>${name}</span>
                    <sup>${sys.country}</sup>
                </h2>
                <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
                <figure>
                    <img class="city-icon" src="${icon}" alt="${weather[0]["main"]}">
                    <figcaption>${weather[0]["description"]}</figcaption>
                </figure>`;
            li.innerHTML = markup;
            list.appendChild(li);
        })
        .catch(() => {
            msg.textContent = "Por favor, busca una ciudad válida.";
        });

    msg.textContent = "";
    form.reset();
    input.focus();
});