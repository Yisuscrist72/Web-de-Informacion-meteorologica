/*BUSCA USANDO EL NOMBRE DE UNA CIUDAD (por ejemplo, athens) O UN NOMBRE DE CIUDAD SEPARADO POR COMA JUNTO CON EL CÓDIGO DEL PAÍS (por ejemplo, athens,gr)*/

// Selección de elementos del DOM
const form = document.querySelector(".primera_seccion form"); // Formulario de búsqueda
const input = document.querySelector(".primera_seccion input"); // Campo de entrada para la ciudad
const msg = document.querySelector(".primera_seccion .msg"); // Mensaje de error o información
const list = document.querySelector(".segunda_seccion .cities"); // Lista donde se mostrarán las ciudades buscadas

// Clave API para OpenWeatherMap
const apiKey = "6a9b8a5f27c70505cfc12db66f1781ec";

// Evento que se ejecuta al enviar el formulario
form.addEventListener("submit", e => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    const inputVal = input.value.trim(); // Obtiene el valor ingresado en el campo de entrada y elimina espacios en blanco

    // Validación: Si el campo está vacío, muestra un mensaje de error
    if (!inputVal) {
        msg.textContent = "Por favor, ingresa el nombre de una ciudad.";
        return;
    }

    // Verifica si la ciudad ya fue buscada
    const existingCity = Array.from(list.querySelectorAll(".city")).find(item => {
        const cityName = item.querySelector(".city-name span").textContent.toLowerCase();
        return cityName === inputVal.toLowerCase();
    });

    if (existingCity) {
        msg.textContent = "Ya has buscado esta ciudad."; // Mensaje si la ciudad ya está en la lista
        return;
    }

    // Construcción de la URL para la API de OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    // Llamada a la API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ciudad no encontrada"); // Lanza un error si la ciudad no existe
            }
            return response.json(); // Convierte la respuesta en JSON
        })
        .then(data => {
            // Desestructuración de los datos obtenidos de la API
            const { main, name, sys, weather, timezone, rain, snow } = data;

            // URL del icono del clima
            const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

            // Conversión de la zona horaria (timezone) de segundos a horas
            const timezoneOffset = timezone / 3600; // Divide los segundos entre 3600 para obtener horas
            const timezoneString = `UTC${timezoneOffset >= 0 ? "+" : ""}${timezoneOffset}`; // Formato UTC±X

            // Obtención de datos de lluvia y nieve
            const rainVolume = rain ? rain["1h"] || rain["3h"] : 0; // Volumen de lluvia en mm (última hora o últimas 3 horas)
            const snowVolume = snow ? snow["1h"] || snow["3h"] : 0; // Volumen de nieve en mm (última hora o últimas 3 horas)

            // Creación de un nuevo elemento de lista para mostrar la ciudad
            const li = document.createElement("li");
            li.classList.add("city"); // Clase CSS para el estilo

            // Plantilla HTML para mostrar los datos de la ciudad
            const markup = `
                <h2 class="city-name" data-name="${name},${sys.country}">
                    <span>${name}</span>
                    <sup>${sys.country}</sup>
                </h2>
                <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
                <div class="city-timezone">Zona horaria: ${timezoneString}</div>
                <div class="city-rain">Lluvia: ${rainVolume} mm</div>
                <div class="city-snow">Nieve: ${snowVolume} mm</div>
                <figure>
                    <img class="city-icon" src="${icon}" alt="${weather[0]["main"]}">
                    <figcaption>${weather[0]["description"]}</figcaption>
                </figure>`;
            li.innerHTML = markup; // Inserta el contenido HTML en el elemento de lista
            list.appendChild(li); // Añade el elemento de lista a la lista de ciudades
        })
        .catch(() => {
            msg.textContent = "Por favor, busca una ciudad válida."; // Mensaje de error si ocurre un problema
        });

    // Limpia el mensaje, reinicia el formulario y enfoca el campo de entrada
    msg.textContent = "";
    form.reset();
    input.focus();
});