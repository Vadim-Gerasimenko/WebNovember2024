document.addEventListener("DOMContentLoaded", function () {
    const temperatureConversionForm = document.getElementById("temperature-conversion-form");
    const temperatureInputField = document.getElementById("temperature-input-field");
    const convertedTemperature = document.getElementById("converted-temperature");

    temperatureConversionForm.addEventListener("submit", function (e) {
        e.preventDefault();
        temperatureInputField.classList.remove("empty-field");
        temperatureInputField.classList.remove("incorrect-value");

        const inputTemperature = temperatureInputField.value.trim();

        if (inputTemperature.length === 0) {
            temperatureInputField.classList.add("empty-field");
            return;
        }

        const celsiusTemperature = Number(inputTemperature);

        if (isNaN(celsiusTemperature) === true) {
            temperatureInputField.classList.add("incorrect-value");
            return;
        }

        const convertCelsiusToKelvin = temperature => temperature + 273.15;
        const convertCelsiusToFahrenheit = temperature => temperature * 1.8 + 32;

        convertedTemperature.querySelector(".celsius-temperature").textContent =
            "Температура в Цельсиях: " + celsiusTemperature + " °C";
        convertedTemperature.querySelector(".kelvin-temperature").textContent =
            "Температура в Кельвинах: " + convertCelsiusToKelvin(celsiusTemperature) + " °K";
        convertedTemperature.querySelector(".fahrenheit-temperature").textContent =
            "Температура в Фаренгейтах: " + convertCelsiusToFahrenheit(celsiusTemperature) + " °F";
    });
});