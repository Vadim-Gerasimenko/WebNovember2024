"use strict";

(function () {
    class Animal {
        constructor(name) {
            this.name = name;
        }

        say() {
            console.log(`${this.name} издает звук.`);
        }
    }

    class Dog extends Animal {
        say() {
            console.log(`${this.name} лает.`);
        }
    }

    class Cat extends Animal {
        say() {
            console.log(`${this.name} мяукает.`);
        }
    }

    console.log("Решение задачи с использованием классов ES6:");

    new Dog("Шарик").say();
    new Cat("Барсик").say();
    new Animal("Дамбо").say();
})();