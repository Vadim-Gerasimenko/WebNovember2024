"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const temperatureConversionForm = document.getElementById("temperature-conversion-form");
    const celsiusTemperatureInputField = document.getElementById("celsius-temperature-input-field");
    const convertedTemperatureBlock = document.getElementById("converted-temperature");

    const convertedToCelsiusTemperatureLabel = convertedTemperatureBlock.querySelector(".celsius-temperature");
    const convertedToKelvinTemperatureLabel = convertedTemperatureBlock.querySelector(".kelvin-temperature");
    const convertedToFahrenheitTemperatureLabel = convertedTemperatureBlock.querySelector(".fahrenheit-temperature");

    temperatureConversionForm.addEventListener("submit", function (e) {
        e.preventDefault();
        celsiusTemperatureInputField.classList.remove("empty-field", "incorrect-value");

        const inputCelsiusTemperature = celsiusTemperatureInputField.value.trim();

        if (inputCelsiusTemperature.length === 0) {
            celsiusTemperatureInputField.classList.add("empty-field");
            return;
        }

        const celsiusTemperature = Number(inputCelsiusTemperature);

        if (isNaN(celsiusTemperature)) {
            celsiusTemperatureInputField.classList.add("incorrect-value");
            return;
        }

        function convertCelsiusToKelvin(celsiusTemperature) {
            return celsiusTemperature + 273.15;
        }

        function convertCelsiusToFahrenheit(celsiusTemperature) {
            return celsiusTemperature * 1.8 + 32;
        }

        convertedToCelsiusTemperatureLabel.textContent = "Температура в Цельсиях: " + celsiusTemperature + " °C";
        convertedToKelvinTemperatureLabel.textContent = "Температура в Кельвинах: " + convertCelsiusToKelvin(celsiusTemperature) + " °K";
        convertedToFahrenheitTemperatureLabel.textContent = "Температура в Фаренгейтах: " + convertCelsiusToFahrenheit(celsiusTemperature) + " °F";
    });
});