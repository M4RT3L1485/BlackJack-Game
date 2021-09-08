//Black Jack Game

/*
    Query selector, is another way like getElementById or getElementButton
    In this case queryselector is going to work with css selectors

    The following istruction makes the next one:
        If somebody hits the button with this id, the envent listener is going to listen the action
        click and run the function blckjackHit
*/

let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards' : ['2','3','4','5','6','7','8','9','10','A','K','J','Q','A'],
    'cards-map':{'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'10': 11,'A' :[1,11],'K': 11,'J': 11,'Q': 11},
    'wins': 0,
    'loses': 0,
    'draws': 0,
    'isStand' : false,
    'turnsOver' : false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

function blackjackHit (){
    if(blackjackGame['isStand'] === false){
        let card = randomCard();    
        showCard(card,YOU);
        updateScore(card,YOU);
        showScore(YOU);
    }
}

function randomCard (){
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomIndex];
}

function showCard (card,activePlayer){
    if(activePlayer['score'] <= 21){
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
    
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal (){

    if(blackjackGame['turnsOver'] === true){

        blackjackGame['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    
        for(let i=0; i<yourImages.length;i++){
            yourImages[i].remove();
        }
    
        for(let i=0; i<yourImages.length;i++){
            dealerImages[i].remove();
        }
    
        //Make a reset of the score 
        YOU['score'] = 0;
        DEALER ['score']= 0;
    
        //Make the score of the page 0 when you prees deal button
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
    
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
    
        document.querySelector('#blackjack-result').textContent = "let's play";
        document.querySelector('#blackjack-result').style.color = "black";

        blackjackGame['turnsOver'] = true;
    }
}

function updateScore (card, activePlayer){
    // If adding 11 keeps me below 21, add 11 otherwise add 1
    if(card === 'A'){
        if(activePlayer['score'] + blackjackGame['cards-map'][card][1] >= 21){
            activePlayer['score'] += blackjackGame['cards-map'][card][0];
        }
        else{
            activePlayer['score'] += blackjackGame['cards-map'][card][1];
        }
    }
    else{
        activePlayer['score'] += blackjackGame['cards-map'][card];
    }
}

function showScore (activePlayer){
    if(activePlayer['score'] >= 22){
        //Make a validation is the scores is grather than 21 is going to show Bust in red
        document.querySelector(activePlayer['scoreSpan']).textContent = 'Bust!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
    else{
        //make that the text change when you press the hit button
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

/**
    This part of the code is going to show the dealer part of the game
 **/

async function dealerLogic (){
    blackjackGame['isStand'] = true;

    while(DEALER['score'] <= 21 && blackjackGame['isStand'] === true){
        let card = randomCard();
        showCard(card,DEALER);
        updateScore(card,DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    blackjackGame['turnsOver'] = true;
    let winner = computerWinner();
    showResult(winner);
}

// compute winner and return who just won
//Update the wins draws and loses
function computerWinner (){
    let winner;

    if(YOU['score'] <=21){

        /*
            Condition: higher score than dealer or when dealer bust buy you are 21 or
            under
        */

        if((YOU['score'] > DEALER['score']) || (DEALER['socre'] > 21)){
            blackjackGame['wins']++;
            winner = YOU;
        }
        else if(YOU['score'] < DEALER['score']){
            blackjackGame['loses']++;
            winner = DEALER;
        }
        else if(YOU['score'] === DEALER['score']){
            blackjackGame['draws']++;
        }
    }

    //When user busts but the dealer does not

    else if(YOU['score'] > 21 && DEALER['score'] <= 21){
        blackjackGame['loses']++;
        winner = DEALER;
    }

    // When the dealer and you busts
    else if(YOU['score'] > 21 && DEALER['score'] > 21){
        blackjackGame['draws']++;
    }

    console.log('Winner is', winner);
    return winner;
}

function showResult (winner){
    let message, messageColor;

    if(blackjackGame['turnsOver'] === true){

        if(winner === YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You Won!';
            messageColor = 'green';
            winSound.play();
        }
        else if(winner === DEALER){
            document.querySelector('#loses').textContent = blackjackGame['loses'];
            message = 'You Lost!'
            messageColor = 'red';
            lossSound.play();
        }
        else{
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You Drew';
            messageColor = 'black';
        }
    
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}