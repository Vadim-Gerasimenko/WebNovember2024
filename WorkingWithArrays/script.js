(function () {
    "use strict";

    (function () {
        const numbers = [3, 4, 7, 8, 2, 2, 6, 11.1, 5, 14];
        console.log("Initial array: " + numbers);

        (function () {
            function sortNumbersByDescending(numbers) {
                function validateElementsTypes(array, correctType) {
                    if (numbers.some(number => (typeof number) !== correctType)) {
                        throw `At least one of the array elements is not a ${correctType}.`;
                    }
                }

                const numbersElementsType = "number";
                validateElementsTypes(numbers, numbersElementsType);

                numbers.sort((number1, number2) => number2 - number1);
            }

            try {
                sortNumbersByDescending(numbers);
                console.log("Sorted array in descending order: " + numbers);
            } catch (e) {
                console.log("Failed to sort array of numbers in descending order: " + e);
            }
        })();

        (function () {
            function validateSize(array, minElementsCount) {
                if (array.length < minElementsCount) {
                    throw `The array contains less than ${minElementsCount} elements. Current array size: ${array.length}.`;
                }
            }

            function getFirstElements(array, elementsCount) {
                validateSize(array, elementsCount);
                return array.slice(0, elementsCount);
            }

            function getLastElements(array, elementsCount) {
                validateSize(array, elementsCount);
                return array.slice(array.length - elementsCount);
            }

            function printSubarray(numbers, elementsCount, elementsGettingFunction, position) {
                try {
                    console.log(`Subarray of the ${position} ${elementsCount} elements: ${elementsGettingFunction(numbers, elementsCount)}`);
                } catch (e) {
                    console.log(`Failed to get subarray of the ${position} ${elementsCount} elements: ${e}`);
                }
            }

            const elementsCount = 5;

            printSubarray(numbers, elementsCount, getFirstElements, "first");
            printSubarray(numbers, elementsCount, getLastElements, "last");
        })();

        (function () {
            function getEvenNumbersSum(numbers) {
                const numbersType = "number";
                return numbers.filter(number => (typeof number) === numbersType && number % 2 === 0)
                    .reduce((result, number) => result + number, 0);
            }

            console.log("Sum of even numbers: " + getEvenNumbersSum(numbers));
        })();
    })();

    (function () {
        function createRange(startValue, elementsCount) {
            return Array(elementsCount)
                .fill(0, 0, elementsCount + 1)
                .map((number, index) => index + startValue);
        }

        const startValue = 1;
        const elementsCount = 100;

        const range = createRange(startValue, elementsCount);
        console.log(`Array of range from ${startValue} to ${startValue + elementsCount - 1}: ${range}`);

        (function () {
            function getEvenNumbersSquaresArray(numbers) {
                const numbersType = "number";
                return numbers.filter(number => (typeof number) === numbersType && number % 2 === 0)
                    .map(number => number * number);
            }

            console.log("Even numbers squares array: " + getEvenNumbersSquaresArray(range));
        })();
    })();
})();