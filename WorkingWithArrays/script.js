(function () {
    "use strict";

    const numbers = [3, 4, 7, 8, 2, 2, 6, 11.1, 5, 14];
    console.log("Initial array: " + numbers);

    function sortNumbersByDescending(numbers) {
        numbers.sort((number1, number2) => number2 - number1);
    }

    sortNumbersByDescending(numbers);
    console.log("Sorted array in descending order: " + numbers);

    function getFirstElements(array, elementsCount) {
        return array.slice(0, elementsCount);
    }

    function getLastElements(array, elementsCount) {
        return array.slice(-elementsCount);
    }

    function printSubarray(numbers, elementsCount, elementsGettingFunction, position) {
        console.log(`Subarray of the ${position} ${elementsCount} elements: ${elementsGettingFunction(numbers, elementsCount)}`);
    }

    const elementsCount = 5;

    printSubarray(numbers, elementsCount, getFirstElements, "first");
    printSubarray(numbers, elementsCount, getLastElements, "last");

    function getEvenNumbersSum(numbers) {
        return numbers
            .filter(number => number % 2 === 0)
            .reduce((evenNumbersSum, number) => evenNumbersSum + number, 0);
    }

    console.log("Sum of even numbers: " + getEvenNumbersSum(numbers));

    function createRange(startNumber, rangeLength) {
        return Array(rangeLength)
            .fill(0, 0, rangeLength + 1)
            .map((number, index) => index + startNumber);
    }

    const startNumber = 1;
    const rangeLength = 100;

    const range = createRange(startNumber, rangeLength);
    console.log(`Array of range from ${startNumber} to ${startNumber + rangeLength - 1}: ${range}`);

    function getEvenNumbersSquaresArray(numbers) {
        return numbers
            .filter(number => number % 2 === 0)
            .map(number => number * number);
    }

    console.log("Even numbers squares array: " + getEvenNumbersSquaresArray(range));
})();