// https://github.com/zero-to-mastery/coding_challenge-14q
var numberOfMoves = 0;
var cardArray = document.querySelector(".game");
var timer = document.querySelector("#timer");
var moveCounter = document.querySelector("#move-counter");

// COUNT MOVES
function moveCount(moves) {
    numberOfMoves += moves;
    moveCounter.textContent = numberOfMoves;    
}

var flipCount = 0; //counts two most recent flips
var flippedList = []; //collects two most recent flips
flipOnClick();

// FLIPPER
function flipOnClick() {
    for (var x = 0; x < cardArray.children.length; x++) {
        cardArray.children[x].onclick = function(){
        var index = Array.prototype.indexOf.call(cardArray.children, this);
        console.log('index: ' + index);
        var cardClass = this.childNodes[1].classList;
        console.log('cardClass: ' + cardClass);
        flippedList.push({index: index, cardClass: cardClass});
        this.classList.toggle("flip"); 
        flipCount += 1;
        console.log('flipCount: ' + flipCount);
        flipBack();
        console.log('flippedList: ' + flippedList);
        };        
    };
}

function flipBack() {  
    setTimeout(function() {
        console.log('flipCount: ' + flipCount);
        if (flippedList.length == 2) {      
            // compare last two cards. if both the same, don't remove flip class. if different, remove flip class from last two cards
            if (flippedList[0].cardClass.item(1) != flippedList[1].cardClass.item(1)) {
               var flippedCard1Index = flippedList[0].index;
               var flippedCard2Index = flippedList[1].index;
                cardArray.children[flippedCard1Index].classList.remove("flip");
                cardArray.children[flippedCard2Index].classList.remove("flip");
                moveCount(1);
                flipCount = 0;
                flippedList = [];
                winGame();
                } else {
                moveCount(1);
                flipCount = 0;
                flippedList = [];
                winGame();
                };
            };
    },1000);
}

// WINNING
// once all cards have been flipped over, timer stops and celebration commences
function winGame() {
    var flip = document.querySelectorAll(".flip");
    console.log('cards flipped: ' + flip.length);
    if (flip.length === 16) {
        // tell player they have won
        var winTime = timer.textContent;
        var winMoves = moveCounter.textContent;
//        window.alert("You've matched all the cards! Your win time is " + winTime + " and you completed the game in " + winMoves + " moves!");
        if (confirm("You've matched all the cards! Your win time is " + winTime + " and you completed the game in " + winMoves + " moves!")) {
              location.reload();
            } else {
              location.reload(); 
            } ;
    };
}

// TIMER
function startTimer() {
    var currentDate = new Date();
    var startTime = currentDate.getTime();
    timeCounter(startTime);
}

function timeCounter(start_time) {   
    var currentDate = new Date();
    var timeDiff = currentDate.getTime() - start_time;
    timer.textContent = formattedTime(timeDiff);
    setTimeout('timeCounter(' + start_time + ');',1000);
}

function formattedTime(unformatted_time) {
    var second = Math.floor(unformatted_time/1000);
    var minute = Math.floor(unformatted_time/60000);
    var hour = Math.floor(unformatted_time/3600000);
    second = second - 60 * minute + '';
    if (hour < 10) {hour   = "0"+hour;}
    if (minute < 10) {minute = "0"+minute;}
    if (second < 10) {second = "0"+second;}
    return hour + ':' + minute + ':' + second;
}

var replayButton = document.querySelector(".replay");


// RESET CARDS
function shuffle(array) {
    var i;
    for (i = array.children.length; i >= 0; i--) {
 array.appendChild(array.children[Math.random() * i | 0]);
}
}

function replay() {
    replayButton.addEventListener("click", function() {
         location.reload(); 
        clearTimeout(timeCounter());
        startTimer();
        shuffle(cardArray);
        numberOfMoves = 0;
        moveCount(0);
        for (var x = 0; x < cardArray.children.length; x++) {
            cardArray.children[x].classList.remove("flip");
        };
        flipCount = 0;
        flippedList = [];
        });
    }

shuffle(cardArray);
startTimer();
moveCount(0);
replay();
