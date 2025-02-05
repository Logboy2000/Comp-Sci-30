// Look mom i commented my code for once

var arrA = new Array()
var arrB = new Array()


///// Searching Functions /////

/**
 * A linear search algorithm.
 * @param {Number[]} array 
 * @param {Number} targetValue 
 * @returns {Number} The index of the target value in the array or -1 if it is not found.
 */
function linearSearch(array, targetValue) {
    for (i = 0; i < array.length; i++) {
        if (array[i] == targetValue) {
            return i
        }
    }
    return -1 // Could not be found
}//end of linearSearch

/**
 * A binary search algorithm.
 * @param {Number[]} sorted 
 * @param {Number} targetValue 
 * @returns {Number} The index of the target value in the array or -1 if it is not found.
 */
function binarySearch(array, targetValue) {
    var sorted = bubbleSort(array);
    console.log("Sorted Array: ", sorted);
    var min = 0;
    var max = sorted.length - 1;
    while (min <= max) {
        var middle = Math.floor((min + max) / 2);

        if (sorted[middle] === targetValue) {
            return middle;
        }

        if (sorted[middle] < targetValue) {
            min = middle + 1;
        } else {
            max = middle - 1;
        }
    }

    return -1; // Target not found
}


///// Sorting Functions /////

/**
 * Does a bubble sort on 'array'
 * @param {Number[]} array Unsorted array
 * @returns {Number[]} Sorted array
 */
function bubbleSort(array) {
    sortedArray = array.slice()
    var temp
    var hasSwapped = true
    while (hasSwapped) {
        hasSwapped = false
        for (var i = 0; i < sortedArray.length; i++) {
            if (sortedArray[i] > sortedArray[i + 1]) {
                temp = sortedArray[i]
                sortedArray[i] = sortedArray[i + 1]
                sortedArray[i + 1] = temp
                hasSwapped = true
            }
        }
    }
    return sortedArray
}

/**
 * Returns an insertion sorted array
 * @param {Number[]} array The unsorted array
 * @returns {Number[]} The sorted array
 */
function insertionSort(array) {
    var sorted = array.slice()
    for (var i = 1; i < sorted.length; i++) {
        var temp = sorted[i]
        var j = i - 1
        while (sorted[j] > temp && j >= 0) {
            sorted[j + 1] = sorted[j]
            j -= 1
        }
        sorted[j + 1] = temp
    }
    return sorted
}//end of insertionSort

/**
 * Returns a selection sorted array
 * @param {Number[]} array The unsorted array
 * @returns {Number[]} The sorted array
 */
function selectionSort(array) {
    var sorted = array.slice()
    var min = 0
    for (var i = 0; i < sorted.length; i++) {
        for (var j = i; j < sorted.length; j++) { // Find smallest value
            if (sorted[j] < sorted[min]) {
                min = j
            }
        }
        // Swap the minimum element with the current element
        var temp = sorted[i]
        sorted[i] = sorted[min]
        sorted[min] = temp
    }
    return sorted
}//end of selectionSort

function quickSort(arr) {
    // NOT MINE
    if (arr.length <= 1) {
        return arr;
    }

    // Make a copy of the array to avoid modifying the original one
    const arrCopy = [...arr]; 

    // Choose pivot (we'll use the last element)
    const pivot = arrCopy[arrCopy.length - 1];
    const left = [];
    const right = [];

    // Partition the array into two subarrays: one with elements less than the pivot, and one with elements greater than the pivot
    for (let i = 0; i < arrCopy.length - 1; i++) {
        if (arrCopy[i] < pivot) {
            left.push(arrCopy[i]);
        } else {
            right.push(arrCopy[i]);
        }
    }

    // Recursively apply quickSort on the left and right subarrays, and concatenate them with the pivot in between
    return [...quickSort(left), pivot, ...quickSort(right)];
}


///// Merge Functions /////

function concatMerge(array1, array2) {
    var outputArray = array1.slice()
    var i
    for (i = 0; i < array2.length; i++) {
        outputArray[i + array1.length] = array2[i]
    }
    return outputArray
}//end of concatMerge

function interweavingMerge(array1, array2) {
    var outputArray = []
    var combinedLength = (array1.length + array2.length)
    for (var i = 0; i < combinedLength; i += 2) {
        outputArray[i] = array1[i / 2]
        outputArray[i + 1] = array2[i / 2]
    }
    return outputArray
}//end of interweavingMerge

///// Helper Functions /////
/**
 * Returns an integer between the min and max inclusivley
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
function randomRangeInt(min, max) {
    if (min == max) {
        return min
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Gets the first HTML element with from the given id
 * @param {String} id The id of the HTML element
 * @returns {HTMLElement} The HTML element
 */
function getElement(id) {
    return document.getElementById(id)
}

/**
 * Creates an array of specified length filled with random numbers within a given range.
 *
 * @param {number} length - The length of the array to be created.
 * @param {number} maxNumber - The maximum number (exclusive) for the random numbers.
 * @returns {number[]} An array of random numbers.
 */
function createRandomArray(length, minNumber, maxNumber) {
    var array = []
    for (i = 0; i < length; i++) {
        array[i] = randomRangeInt(minNumber, maxNumber)
    }
    return array
}

/**
 * Displays the elements of an array in the given HTML element.
 *
 * @param {Array} array The array that is displayed.
 * @param {string} elementID The ID of the HTML element where the array will be displayed.
 */
function displayArray(array, elementID) {
    var output = ''
    var element = getElement(elementID)
    for (i = 0; i < array.length; i++) {
        output += array[i] + ", "
    }// end of for
    element.innerText = output
}// end of displayArray