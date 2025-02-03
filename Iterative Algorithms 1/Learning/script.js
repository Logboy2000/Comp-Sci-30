var a = new Array()
var b = new Array()

function loaded() {
    a = createRandomArray(100, 100)
    b = createRandomArray(100, 100)
    displayArray(a, "originalA")
    displayArray(b, "originalB")
}// end of loaded

function createRandomArray(length, maxNumber) {
    var array = []
    for (i = 0; i < length; i++) {
        array[i] = randomRange(0, maxNumber)
    }
    return array
}

function displayArray(arr, elementID) {
    var output = ''
    document.getElementById(elementID).innerHTML = ""
    for (i = 0; i < arr.length; i++) {
        output += arr[i] + ", "
    }// end of for
    document.getElementById(elementID).innerHTML = output
}// end of displayArray

function linearGo() {// start of linearG0
    /*
        Function to run when the linear search button is pressed
        inputs 
            none
        outputs
            none
    */
    alert("Linear Search Button was pressed")
}//end of linearGo

function binaryGo() {// start of binaryGo
    /*
        Function to run when the binary search button is pressed
        inputs 
            none
        outputs
            none
    */
    alert("Binary Search Button was pressed")
}//end of binaryGo

function bubbleGo() {// start of bubbleGo
    /*
        Function to run when the bubble sort button is pressed
        inputs 
            none
        outputs
            none
    */
    alert("Bubble Sort Button was pressed")
}//end of bubbleGo

function insertionGo() {// start of insertionGo
    /*
        Function to run when the insertion sort button is pressed
        inputs 
            none
        outputs
            none
    */
    alert("Insertion Sort Button was pressed")
}//end of insertionGo

function selectionGo() {// start of selectionGo
    /*
        Function to run when the selection sort button is pressed
        inputs 
            none
        outputs
            none
    */
    alert("Selection Sort Button was pressed")
}//end of selectionGo

function concatGo() {// start of concatGo
    /*
        Function to run when the Concatenating Merge button is pressed
        inputs 
            none
        outputs
            none
    */
    alert("Concatenating Merge Button was pressed")
}//end of concatGo
function quickGo() {

    //var result = myQuick(0,a.length-1,a)
    var result = quickSort(a, 0, a.length - 1)
    // display result
    displayArray(result, "quicksort");
}
function interGo() {// start of interGo
    /*
        Function to run when the Interweaving Merge button is pressed
        inputs 
            none
        outputs
            none
    */
    alert("Interweaving Merge Button was pressed")
}//end of interGo

// JavaScript Document
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
