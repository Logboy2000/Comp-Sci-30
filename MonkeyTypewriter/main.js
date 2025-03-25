let updateInterval;
let targetWord = '11';
let monkeys = 1;
let monkeyCharsPerSecond = 1;
let chars = [];

for (let i = 97; i <= 122; i++) { // Lowercase a-z
    chars.push(String.fromCharCode(i));
}

function startSimulation() {
    monkeys = parseInt(getElement('monkeyCount').value);
    monkeyCharsPerSecond = parseInt(getElement('charsPerSec').value);
    targetWord = getElement('targetWord').value

    clearInterval(updateInterval);
    generateTextareas(monkeys);

    updateInterval = setInterval(update, 1000 / (monkeyCharsPerSecond * targetWord.length));
}

function generateTextareas(count) {
    let container = getElement('monkeyOutputs');
    container.innerHTML = ''; // Clear existing textareas
    for (let i = 1; i <= count; i++) {
        let h2 = document.createElement('h2')
        h2.innerText = `Monkey ${i}`
        container.appendChild(h2);
        let textarea = document.createElement('textarea');
        textarea.id = `monkey_${i}`;
        textarea.rows = 5;
        textarea.cols = 30;
        textarea.readOnly = true;
        container.appendChild(textarea);
    }
}

function update() {
    for (let i = 1; i <= monkeys; i++) {
        let generatedWord = generateRandomWord(targetWord.length);
        let textarea = getElement(`monkey_${i}`);
        textarea.value += generatedWord + ' ';
        textarea.scrollTop = textarea.scrollHeight; // Auto-scroll to bottom
        if (generatedWord === targetWord) {
            clearInterval(updateInterval);

            alert(`Monkey ${i} typed "${targetWord}"!`);
            return;
        }
    }
}

function generateRandomWord(length) {
    let word = '';
    for (let i = 0; i < length; i++) {
        word += chars[Math.floor(Math.random() * chars.length)];
    }
    return word;
}

function getElement(id) {
    return document.getElementById(id);
}

document.addEventListener('DOMContentLoaded', () => {
    getElement('startButton').addEventListener('click', startSimulation);
});
