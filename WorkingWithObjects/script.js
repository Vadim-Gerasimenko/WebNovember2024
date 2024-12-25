(function () {
    "use strict";

    const countries = [
        {
            name: "Russia",
            cities: [
                {
                    name: "Moscow",
                    population: 13149803
                },
                {
                    name: "Saint-Petersburg",
                    population: 5597763
                },
                {
                    name: "Novosibirsk",
                    population: 1633851
                },
                {
                    name: "Kazan",
                    population: 1308660
                }
            ]
        },
        {
            name: "Turkey",
            cities: [
                {
                    name: "Istanbul",
                    population: 10895272
                },
                {
                    name: "Antalya",
                    population: 1203994
                },
                {
                    name: "Kayseri",
                    population: 1061942
                }
            ]
        },
        {
            name: "France",
            cities: [
                {
                    name: "Paris",
                    population: 2206488
                },
                {
                    name: "Marseilles",
                    population: 861635
                },
                {
                    name: "Lyon",
                    population: 506615
                },
                {
                    name: "Strasbourg",
                    population: 277270
                }
            ]
        }
    ];

    console.log("Array of countries-objects: ");
    console.log(countries);

    function getCountriesWithMaxCitiesCount(countries) {
        return countries.filter(country => country.cities.length === Math.max(
            ...countries.map(country => country.cities.length))
        );
    }

    console.log("Countries with maximum number of cities:");
    console.log(getCountriesWithMaxCitiesCount(countries));

    function getCountriesPopulationInfo(countries) {
        return Object.fromEntries(countries.map(country => [
            country.name,
            country.cities.reduce((result, city) => result + city.population, 0)
        ]));
    }

    console.log(
        "An object with information about all countries, where " +
        "the key is the name of the country, " +
        "the value is the total number of people in the country:"
    );
    console.log(getCountriesPopulationInfo(countries));
})();