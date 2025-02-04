// Look mom i commented my code for once

var arrA = new Array()
var arrB = new Array()

/**
 * This function is called automatically when the page body is loaded.
 */
function loaded() {
    console.log('loaded!')
}// end of loaded

/**
 * Randomises arrays a and b and displays it
 */
function newArrays() {
    var arrayASize = parseInt(getElement('arrayASize').value);
    var arrayAMin = parseInt(getElement('arrayAMin').value);
    var arrayAMax = parseInt(getElement('arrayAMax').value);
    arrA = createRandomArray(arrayASize, arrayAMin, arrayAMax);

    var arrayBSize = parseInt(getElement('arrayBSize').value);
    var arrayBMin = parseInt(getElement('arrayBMin').value);
    var arrayBMax = parseInt(getElement('arrayBMax').value);
    arrB = createRandomArray(arrayBSize, arrayBMin, arrayBMax);

    displayArray(arrA, "originalA");
    displayArray(arrB, "originalB");
}

///// Button Functions /////

/**
 * Linear searches for a value in array a.
 */
function linearSearchButton() {
    var value = parseInt(getElement("searchInputField").value)
    var result = linearSearch(arrA, value)
    if (result == -1) {
        alert("Value not found in array")
    } else {
        alert("Value found at index: " + result)
    }
}

/**
 * Binary searches for a value in array a.
 */
function binarySearchButton() {
    var value = parseInt(getElement("searchInputField").value)
    var result = binarySearch(arrA, value)
    if (result == -1) {
        alert("Value not found in array")
    } else {
        alert("Value found at index: " + result)
    }
}

/**
 * Preforms a bubble sort on array a an displays the sorted array
 */
function bubbleSortButton() {
    var startTime = performance.now()
    var sorted = bubbleSort(arrA)
    var endTime = performance.now()
    var time = endTime - startTime
    getElement('bubbleTime').innerText = time
    displayArray(sorted, "bubble")
}

/**
 * Preforms an insertion sort on array a an displays the sorted array
 */
function insertionSortButton() {
    var startTime = performance.now()
    var sorted = insertionSort(arrA)
    var endTime = performance.now()
    var time = endTime - startTime
    getElement('insertionTime').innerText = time
    displayArray(sorted, "insertion")
}
/**
 * Preforms a selection sort on array a an displays the sorted array
 */
function selectionSortButton() {
    var startTime = performance.now()
    var sorted = selectionSort(arrA)
    var endTime = performance.now()
    var time = endTime - startTime
    getElement('selectionTime').innerText = time
    displayArray(sorted, "selection")
}
/**
 * Preforms an quick sort on array a an displays the sorted array
 */
function quickSortButton(){
    getElement('quick').innerText = "Can't do yet"
    getElement('quickTime').innerText = "Infinity"
    console.error('your mother')
}

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
    sorted = bubbleSort(array)
    var min = 0
    var max = sorted.length - 1
    while (min <= max) {
        var middle = Math.floor((min + max) / 2)
        if (sorted[middle] == targetValue) {
            return middle
        } else if (sorted[middle] < targetValue) {
            min = middle + 1
        } else {
            max = middle - 1
        }
    }
    return -1 // Could not be found
}//end of binarySearch

///// Sorting Functions /////

/**
 * Returns a bubble sorted array.
 * @param {Number[]} Input array 
 * @returns {Number[]} The sorted array.
 */
function bubbleSort(array) {
    var sorted = array.slice() // make a copy
    for (var i = 0; i < sorted.length - 1; i++) {
        for (var j = 0; j < sorted.length - i - 1; j++) {
            if (sorted[j] > sorted[j + 1]) {
                var temp = sorted[j]
                sorted[j] = sorted[j + 1]
                sorted[j + 1] = temp
            }
        }
    }
    return sorted
}//end of bubbleSort

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

function quickSort(array = []) {
    return 'your mother'
}

///// Merge Functions /////

function concatMerge(array1, array2) {
}//end of concatMerge

function interweavingMerge(array1, array2) {
}//end of interweavingMerge

///// Helper Functions /////
/**
 * Returns an integer between the min and max inclusivley
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
function randomRangeInt(min, max) {
    if (min == max){
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
    document.getElementById(elementID).innerHTML = ""
    for (i = 0; i < array.length; i++) {
        output += array[i] + ", "
    }// end of for
    document.getElementById(elementID).innerHTML = output
}// end of displayArray