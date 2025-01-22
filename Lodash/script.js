(function () {
    "use strict";

    class Person {
        constructor(name, age) {
            this.name = name;
            this.age = age;
        }
    }

    function getAverageAge(persons) {
        return _.meanBy(persons, person => person.age);
    }

    function getPersonsBetween20And30YearsOrderedByAscending(persons) {
        return _.chain(persons)
            .filter(person => person.age >= 20 && person.age <= 30)
            .sortBy(person => person.age)
            .value();
    }

    function getUniqueNamesOfPersonsBetween20And30YearsOrderedByDescending(persons) {
        return _.chain(persons)
            .filter(person => person.age >= 20 && person.age <= 30)
            .orderBy("name", "desc")
            .map(person => person.name)
            .sortedUniq()
            .value();
    }

    function getObjectWithNamesAsKeysAndPersonsCountAsValues(persons) {
        return _.countBy(persons, "name");
    }

    const persons = [
        new Person("Vadim", 18),
        new Person("Anna", 34),
        new Person("Lora", 25),
        new Person("Svetlana", 14),
        new Person("Vitaly", 22),
        new Person("Ekaterina", 7),
        new Person("Adam", 33),
        new Person("Egor", 20),
        new Person("Sophia", 16),
        new Person("Egor", 24),
        new Person("Lora", 4),
        new Person("Sophia", 27),
        new Person("Sophia", 25)
    ];

    console.log("Список всех людей:");
    console.log(persons);

    console.log("Средний возраст: " + getAverageAge(persons));

    console.log("Список людей от 20 до 30 лет включительно, отсортированный по возрастанию возраста:");
    console.log(getPersonsBetween20And30YearsOrderedByAscending(persons));

    console.log("Уникальные имена людей от 20 до 30 лет включительно, отсортированные по убыванию:");
    console.log(getUniqueNamesOfPersonsBetween20And30YearsOrderedByDescending(persons));

    console.log("Объект, в котором ключи - имена людей, а значения – количества людей с этим именем:");
    console.log(getObjectWithNamesAsKeysAndPersonsCountAsValues(persons));
})();