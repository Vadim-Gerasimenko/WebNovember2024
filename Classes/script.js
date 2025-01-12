(function () {
    "use strict";

    (function () {
        function Animal(name) {
            this.name = name;

            Animal.prototype.say = function () {
                console.log(`${this.name} издает звук.`);
            };
        }

        function Dog(name) {
            Animal.call(this, name);

            Dog.prototype.say = function () {
                console.log(`${name} лает.`);
            };
        }

        Object.setPrototypeOf(Dog.prototype, Animal.prototype);

        function Cat(name) {
            Animal.call(this, name);

            Cat.prototype.say = function () {
                console.log(`${name} мяукает.`);
            };
        }

        Object.setPrototypeOf(Cat.prototype, Animal.prototype);

        console.log("Решение задачи с использованием конструкторов и прототипов:");
        new Dog("Шарик").say();
        new Cat("Барсик").say();
        new Animal("Дамбо").say();
    })();
})();