"use strict";

(function () {
    function Animal(name) {
        this.name = name;
    }

    Animal.prototype.say = function () {
        console.log(`${this.name} издает звук.`);
    };

    function Dog(name) {
        Animal.call(this, name);
    }

    Object.setPrototypeOf(Dog.prototype, Animal.prototype);

    Dog.prototype.say = function () {
        console.log(`${this.name} лает.`);
    };

    function Cat(name) {
        Animal.call(this, name);
    }

    Object.setPrototypeOf(Cat.prototype, Animal.prototype);

    Cat.prototype.say = function () {
        console.log(`${this.name} мяукает.`);
    };

    console.log("Решение задачи с использованием конструкторов и прототипов:");

    new Dog("Шарик").say();
    new Cat("Барсик").say();
    new Animal("Дамбо").say();
})();