let curRow = "A";
let curBox = "1";
let gameOver = false;
let theWord = "";
let guessesLeft = 6;
const afla = 2308;//Answer File Line Amount; A.F.L.A


/* To Do:
- Combine green/yellow/grey coloration loops in enterPressed() function
- Fix keyboard coloration(Key may appear grey after it was turned yellow or green)
- Cleanup Code
- Make more Efficient
- add Toast or popups
- add directions
- improve new game/result functionality and display
*/

function startGame(){ // Start initial game
    document.getElementById("result").style.color = "#7bc470";
    document.getElementById("result").innerHTML = "Game Started";
    newWord();

    //Add Event Listeners
    document.addEventListener('keyup', physicalKeyboard);
    document.getElementById("Keyboard").addEventListener('click', screenKeyboard);
    document.getElementById("guessTable").addEventListener('click', tappedBox);
}

function newWord(){ // Function that generates a new word
    const lineNum = Math.floor(Math.random() * afla);

    //Using the fetch api, gather the file and it's contents
    fetch('text/answers.txt').then(response => response.text()).then(data => {
        //data.slice(Previous Line * word length w/ /n, Desire Line * word length w/ /n - /n character)
        //data.slice(end index of previous line w/ '/n', end index of cur line w/o '/n')
        theWord = data.slice((lineNum-1)*6,lineNum*6-1);
    }).catch(error => console.error('Error reading file:', error));
}

function tappedBox(e){
    if(e.target.id == curRow+((parseInt(curBox)-1).toString())){
        delPressed();
    }
}
// Function that gathers onscreen keyboard input
function screenKeyboard(e){
    const keyButton = e.target;
    if(!keyButton.classList.contains("keyboard-button")){
        return;
    }
    checkKeyType(keyButton.textContent);
}

// Function that gathers physical keyboard input
function physicalKeyboard(e){
    checkKeyType(e.key);
}

// Figures out which button was pressed and what to do
function checkKeyType(keyPressed) {
    document.getElementById("result").innerHTML = "";
    if (keyPressed == "Enter") { // 13 = Enter
        if (gameOver) {
            newGame();
        }
        else {
            enterPressed();
        }
    }
    else if (guessesLeft != 0 && !gameOver) {
        if (keyPressed == "Del" || keyPressed == "Backspace" || keyPressed == "Delete") {// 46 = Delete, 8 = Backspace
            delPressed();
        }
        else if (keyPressed.match(/[a-z]/gi)  && keyPressed.length == 1) { // 65=A, 90=Z
            letterPressed(keyPressed);
        }
    }
}

function newGame(){
    document.getElementById("result").innerHTML = "Game Started";
    newWord(); // Generate new word
    // Loop which clears the board
    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 5; j++){
            box = document.getElementById("ABCDEF".substring(i,i+1)+String(j+1));
            box.innerHTML = "";
            box.className = "";
        }
    }
    //Reset Variables and the Keyboard
    resetKeyboard();
    gameOver = false
    guessesLeft = 6;
    curBox = "1";
    curRow = "A";
}

//Delete letter function
function delPressed(){
    if(parseInt(curBox) != 1) { //Where curBox is currently empty box
        curBox = (parseInt(curBox)-1).toString(); // sets curBox to prior box
        document.getElementById(curRow+curBox).innerHTML = ""; // Clears Box
    }
}

// Letter pressed/entered function
function letterPressed(theKey){
    if(parseInt(curBox) < 6){ // curBox = 6 means full row, 6 is out of bounds
        document.getElementById(curRow+curBox).innerHTML = String(theKey); // fill box with value
        //document.getElementById(curRow + curBox).style.background = "#e8e8e8"; Potential to change BG in future
        //document.getElementById(curRow + curBox).style.borderColor = "#bbbbbb";
        curBox = (parseInt(curBox)+1).toString(); // move onto next box
    }
}

// Function which displays if you won or lost
function gameResult(theResult){
    if(theResult){
        for(let k = 0; k < 5; k++){
            let winBox = document.getElementById(curRow+String(k+1));
            winBox.className = "green";
        }
        messageBox = document.getElementById("result");
        messageBox.innerHTML = "You Won!";
        messageBox.style.color = "#7bc470";
        gameOver = true;
    }
    else{
        messageBox = document.getElementById("result");
        messageBox.innerHTML = "You Lost! The word was: " + theWord;
        messageBox.style.color = "#d63024";
        gameOver = true;
    }
}

async function enterPressed(){
    //Check if the entireRow is filled
    if (curBox != "6"){//If it isn't, state that that it's not a valid word
        messageBox = document.getElementById("result");
        messageBox.style.color = "#d63024";
        messageBox.innerHTML = "Not a valid input.";
    }
    else{ //If it is full, Turn it into a string
        let userGuess = "";
        for(let h = 0; h < 5; h++){
            userGuess += document.getElementById(curRow+String(h+1)).innerHTML.toLowerCase();
        }
        const guessIndex = await fetch('text/words.txt').then(response => response.text()).then(data => {return data.indexOf(userGuess); }).catch(error => console.error('Error reading file:', error));
        // First check if it's in the approved wordlist
        console.log("valid: "+ guessIndex);
        if(guessIndex > -1){//If not, tell them it's an invalid word
            // Then check if they correctly guessed the word
            if(userGuess == theWord){
                gameResult(true);
            }
            else{// If not, check each letter
                checkLetters(userGuess);
            }
        }
        else{
                                                //Incorrect Word Stuff
            messageBox = document.getElementById("result");
            messageBox.style.color = "#d63024";
            messageBox.innerHTML = "Not a valid input.";
        }
    }
}
function getUserIndex(userWord){
    console.log("calling fetch");
    fetch('text/words.txt')
        .then(response => response.text())
        .then(data => {//using n, it gets the word using limitations and displays it
        console.log("return")
        return data.indexOf(userWord);
    }).catch(error => console.error('Error reading file:', error));
    console.log("no-return");
}

function checkLetters(guessedWord){
    guessesLeft--;
    let tempWord = theWord;
    let colorList = ["","","","",""];

    // First cancel out the green, or matching letters
    for(let green = 0; green < 5; green++){
        if(guessedWord.substring(green,green+1) == tempWord.substring(green,green+1)){
            //These set the style
            colorList[green] = "green";
                
            //These replace the letter with the index number so it's not used for later checks
            tempWord = tempWord.substring(0,green) + String(green) + tempWord.substring(green+1,5);
            guessedWord = guessedWord.substring(0,green) + String(green) + guessedWord.substring(green+1,5);
        }
    }

    //Check each remaining letter in both words against eachother
    for(let lett = 0; lett < 5; lett++){
        for(let ter = 0; ter < 5; ter++){
            //We are ensuring they aren't the same index, as thats matching
            //And we are ensuring it doesn't have a green style already
            if(lett != ter && guessedWord.substring(lett,lett+1) == tempWord.substring(ter,ter+1)  && colorList[lett] != "green"){
                colorList[lett] = "yellow";
                tempWord = tempWord.substring(0,ter) + String(ter+4) + tempWord.substring(ter+1,5);
                guessedWord = guessedWord.substring(0,lett) + String(lett+4) + guessedWord.substring(lett+1,5);
            }
            
            //If it doesn't have a yellow or green styling already, make it grey.
            else if (colorList[lett] != "yellow" && colorList[lett] != "green"){
                colorList[lett] = "grey";
            }
        }
    }

    //Now use the two style lists above to set the boxes style on the page
    for(let leng = 0; leng < colorList.length; leng++){
        box = document.getElementById(curRow+String(leng+1));
        box.className = colorList[leng];
        colorKey(box.innerHTML, colorList[leng]);
    }

    // Move onto new row or game failure
    curRow = "ABCDEFG"["ABCDEFG".indexOf(curRow)+1];
    if(curRow == "G"){
            gameResult(false);
    }
    curBox = String(1); // Reset current box
}


function colorKey(letter, color){
    let button = document.getElementById(letter);
    if(button != null){
        let buttonClasses = button.classList;
      
        if (!(buttonClasses.contains("green"))){
            if(color == "yellow" || (color == "grey" && !(buttonClasses.contains("yellow")))){
              button.className = "keyboard-button " + color;
            }
        }
    }else{
        console.log("Key not found: " + letter);
    }
    /* Extra redundant code
    else{
        let buttonList = document.getElementsByClassName("keyboard-button");
        for(let v=0; v < buttonList.length; v++){
            button = buttonList.item(v).textContent;
            if(button == letter){
                let buttonClasses = button.classList;
                if(buttonClasses.contains("grey") && color != "grey"){
                    button.className = "keyboard-button " + color;
                }else if(buttonClasses.contains("yellow") && color == "green"){
                    button.className = "keyboard-button " + color;
                }
            }
        }
    }*/
}

// Function which resets the onscreen keyboard
function resetKeyboard(){
    const buttonList = document.getElementsByClassName("keyboard-button");
    for(let b = 0; b< buttonList.length;b++){
        buttonList[b].className = "keyboard-button";
    }
}
