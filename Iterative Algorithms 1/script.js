var searchInputField

var a = new Array()
var b = new Array()

/**
 * This function is called automatically when the page body is loaded.
 */
function loaded() {
    searchInputField = document.getElementById("searchInputField")
    newArrays()
}// end of loaded

function newArrays() {
    a = createRandomArray(parseInt(getElement('arrayASize').value), 100)
    b = createRandomArray(parseInt(getElement('arrayBSize').value), 100)
    displayArray(a, "originalA")
    displayArray(b, "originalB")
}

/**
 * Linear searches for a value in array a.
 */
function linearSearchButton() {
    var value = parseInt(searchInputField.value)
    var result = linearSearch(a, value)
    if (result == -1) {
        alert("Value not found in array")
    } else {
        alert("Value found at index: " + result)
    }
}

function binarySearchButton() {
    var value = parseInt(searchInputField.value)
    var result = binarySearch(a, value)
    alert("Value found at index: " + result)
}

function bubbleSortButton() {
    var startTime = performance.now()
    bubbleSort(a)
    var endTime = performance.now()
    var time = endTime - startTime
    getElement('bubbleTime').innerText = time
    displayArray(a, "bubble")
}

/**
 * Creates an array of specified length filled with random numbers within a given range.
 *
 * @param {number} length - The length of the array to be created.
 * @param {number} maxNumber - The maximum number (exclusive) for the random numbers.
 * @returns {number[]} An array of random numbers.
 */
function createRandomArray(length, maxNumber) {
    var array = []
    for (i = 0; i < length; i++) {
        array[i] = randomRange(0, maxNumber)
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
 * @param {Number[]} array 
 * @param {Number} targetValue 
 * @returns {Number} The index of the target value in the array or -1 if it is not found.
 */
function binarySearch(array, targetValue) {
    array = bubbleSort(array)
    var min = 0
    var max = array.length - 1
    while (min <= max) {
        var middle = Math.floor((min + max) / 2)
        if (array[middle] == targetValue) {
            return middle
        } else if (array[middle] < targetValue) {
            min = middle + 1
        } else {
            max = middle - 1
        }
    }
    return -1 // Could not be found
}//end of binarySearch

function bubbleSort(array) {
    for (var i = 0; i < array.length - 1; i++) {
        for (var j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                var temp = array[j]
                array[j] = array[j + 1]
                array[j + 1] = temp
            }
        }
    }
    return array
}//end of bubbleSort

function insertionSort() {
}//end of insertionSort

function selectionSort() {
}//end of selectionSort

function quickSort() {
}

function concatMerge() {
}//end of concatMerge

function interweavingMerge() {
}//end of interweavingMerge

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getElement(id) {
    return document.getElementById(id)
}