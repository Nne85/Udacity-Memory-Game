/*
 * Create a list that holds all of your cards
 */
let starts = false;
let openCards = [];
let moves = 0;
let timeCount = 0;
let solvedCount = 0;
let timerPointer;
const cardsList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// get class value from card DOM
function getClassCard(card){
    return card[0].firstChild.className;
}

// check open cards when count = 2
function checkOpenCards(){
    if (getClassCard(openCards[0]) === getClassCard(openCards[1])){
        solvedCount++;
        openCards.forEach(function(card){
            card.animateCss('tada', function(){
                card.toggleClass("open show match");
            });
        });
    } else {
        openCards.forEach(function(card){
            card.animateCss('shake', function(){
                card.toggleClass("open show");
            });
        });
    }
    openCards = [];
    incrementMove();
    if (solvedCount === 8){
        GameOver();
    }
}

// starts the timer
function startTimer(){
    timeCount += 1;
    $(".timer").html(timeCount);
    timerPointer = setTimeout(startTimer, 1000);
}

// increment move count
function incrementMove(){
    moves += 1;
    $(".moves").html(moves);
    if (moves === 14 || moves === 20){
        reduceStar();
    }
}

// event handler for when the card is clicked
function cardClick(event){
    // check FOR opened or matched card
    let classes = $(this).attr("class");
    if (classes.search('open') * classes.search('match') !== 1){
        // both should be less than 0
        return;
    }
    // repeat game
    if (!starts) {
        starts = true;
        timeCount = 0;
        timerPointer = setTimeout(startTimer, 1000);
    }
    //  flip cards
    if (openCards.length < 2){
        $(this).toggleClass("open show");
        openCards.push($(this));
    }
    // check for matched cards
    if (openCards.length === 2){
        checkOpenCards();
    }
}

// create single card element
function createCard(cardClass){
    $("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

// populate cards in DOM
function CreateMoreCards(){
    shuffle(cardsList.concat(cardsList)).forEach(createCard);
}

// restart game
function resetGame(){
    $("ul.deck").html("");
    $(".stars").html("");
    moves = -1;
    incrementMove();
    starts = false;
    openCards = [];
    timeCount = 0;
    solvedCount = 0;
    clearTimeout(timerPointer);
    $(".timer").html(0);
    // re-restart game
    initGame();
}

// runs when game has been won
function GameOver(){
    // stop timer
    clearTimeout(timerPointer);
    // show prompt
    let stars = $(".fa-star").length;
    vex.dialog.confirm({
        message: `Congrats! You just won the game in ${timeCount} seconds with ${stars}/3 star rating. Do you want to play again?`,
        callback: function(value){
            if (value){
                resetGame();
            }
        }
    });
}

// initialize stars display
function initStars(){
    for (let i=0; i<3; i++){
        $(".stars").append(`<li><i class="fa fa-star"></i></li>`);
    }
}

// reduce star rating
function reduceStar(){
    let stars = $(".fa-star");
    $(stars[stars.length-1]).toggleClass("fa-star fa-star-o");
}

// init game
function initGame(){
    CreateMoreCards();
    initStars();
    $(".card").click(cardClick);
}

// things done after DOM is loaded for the first time
$(document).ready(function(){
    initGame();
    $("#restart").click(resetGame);
    vex.defaultOptions.className = 'vex-theme-os';
    vex.dialog.buttons.YES.text = 'Yes!';
    vex.dialog.buttons.NO.text = 'No';
});

// loading the animateCss
// This is  taken from https://github.com/daneden/animate.css/#usage
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
        return this;
    }
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
