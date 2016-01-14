var deck = [];
var placeInDeck;
var playerTotalCards = 2;
var dealerTotalCards = 2;
var playerHand;
var dealerHand;
var totalWins = 0;
var totalGames = 0;
var winningPercentage = 0; 
var numberOfTies = 0;

//variables for wagering
var totalMoney = 50;
var initialMoney = totalMoney;
var currentWager = 0;
var gainsAndLosses = 0;
var totalLostWon = 0;

setTimeout(function(){
	var windowHeight = window.innerHeight;
	$('#intro-page-wrapper').css('height', windowHeight + 'px');
	var contentHeight = $('#intro-page').height();
	var paddingAdjust = parseInt((windowHeight - contentHeight-25)/2);
	$('#logo').css('padding-top', paddingAdjust + 'px');
},10);


function playGame(){
	document.getElementById("intro-page-wrapper").style.display="none";
}

function shuffleDeck(){
	//fill our deck, in order(for now)
	//suit
	var suit = "";
	for(s = 1; s <= 4; s++){
		if(s===1){
			suit = "h";
		}else if(s === 2){
			suit = "s";
		}else if(s === 3){
			suit = "d";
		}else if(s === 4){
			suit = "c";
		}
		//card number
		for(i=1; i <= 13; i++){
			deck.push(i+suit);
		}
	}

	var numberOfTimesToShuffle = Math.floor(Math.random() * 500 + 500);
	//Shuffle the deck
	for(i = 0; i < numberOfTimesToShuffle; i++){
		//Pick 2 random cards from the deck.  And switch them.
		var card1 = Math.floor(Math.random()*52);
		var card2 = Math.floor(Math.random()*52);
		var temp = deck[card2];
		deck[card2] = deck[card1];
		deck[card1] = temp;
	}
	return deck;
}

function placeCard(card, who, slot){   //for visual effect of placing cards on table
	var currId = who + '-card-' + slot;


	//this is my new code
	var cardValue = Number(card.slice(0,-1));     //Equals just the number
	var suitValue = card[(card.length)-1];        //Equals just the letter
	var newCardValue = cardValue;                 
	if(cardValue===11){
		newCardValue = "J";
	}else if (cardValue===12){
		newCardValue = "Q";
	}else if (cardValue===13){
		newCardValue = "K";
	}else if (cardValue===1){
		newCardValue = "A";
	}

	document.getElementById(currId).className = "card"; //takes away empty class
	document.getElementById(currId).innerHTML = "<br>" + newCardValue; 
	if(suitValue==='c'){
		document.getElementById(currId).style.background = "url('small.png') 50% 70% no-repeat";
	}else if(suitValue==='h'){
		document.getElementById(currId).style.background = "url('heart.png') 50% 70% no-repeat";
	}else if(suitValue==='s'){
		document.getElementById(currId).style.background = "url('spade.png') 50% 70% no-repeat";
	}else{
		document.getElementById(currId).style.background = "url('diamond.png') 50% 70% no-repeat";
	}
	document.getElementById(currId).style.backgroundColor = "#fff";
	document.getElementById(currId).style.backgroundSize = "30px 30px";


}

function bust(who){
	if(who === "player"){
		//player lost!!  dealer won
		document.getElementById('message').innerHTML = "You have busted. Bet again.";
		disablePlayButtons();
		enableButtons();
	}else{
		//dealer lost!!  player won
		document.getElementById('message').innerHTML = "The dealer busted. You win!. Bet again";
		totalWins++;
		document.getElementById('win-count').innerHTML = totalWins;
		totalMoney = totalMoney + (currentWager*2);
		currentWager = 0;
		document.getElementById('money').innerHTML = totalMoney;
		enableButtons();
		disablePlayButtons();
	}
}


function Ace(total){
	if(total <= 11){
		return (total+10);
	}else{
		return (total);
	}
}

function calculateTotal(hand, who){
	var total = 0;
	var AceCount = 0;
	for(i=0; i<hand.length; i++){
		var cardValue = hand[i].slice(0,-1); //will copy everything but one from the end
		if(cardValue < 2){
			total = total + Number(cardValue);
			AceCount++;
		}else if(cardValue < 11){
			total = total + Number(cardValue);
		}else{
			total = total + 10;
		}
	}
	if(AceCount > 0){
		total = Ace(total);
	}
	var idWhoToGet = who + '-total';
	// document.getElementById(idWhoToGet).innerHTML = total;
	document.getElementById('player-total').innerHTML = total;

	if(total>21){
		bust(who);
	}
	return total;
}

function deal(){
	//Shuffled deck from function shuffleDeck
	reset();
	document.getElementById('wager1-button').disabled=true;
	document.getElementById('wager2-button').disabled=true;
	document.getElementById('wager5-button').disabled=true;
	document.getElementById('draw-button').disabled=true;
	document.getElementById("draw-button").style.backgroundColor="#b8cfb8";
	document.getElementById("hit-button").style.backgroundColor="black";
	document.getElementById("stand-button").style.backgroundColor="black";

	deck = shuffleDeck();
	playerHand = [ deck[0], deck[2] ];
	dealerHand = [ deck[1], deck[3] ];
	placeInDeck = 4;
	placeCard(playerHand[0], 'player', 'one');
	placeCard(dealerHand[0], 'dealer', 'one');
	placeCard(playerHand[1], 'player', 'two');

	calculateTotal(playerHand, 'player');
	document.getElementById('dealer-total').innerHTML = "";
	var dealerTotal = calculateTotal(dealerHand, 'dealer');
	var playerTotal = calculateTotal(playerHand, 'player');
	if ((dealerTotal === 21) && (playerTotal != 21)){
		placeCard(dealerHand[1], 'dealer', 'two');
		disablePlayButtons();
		document.getElementById('message').innerHTML = "Dealer got BlackJack. You lose. Bet again";
		document.getElementById("draw-button").style.backgroundColor="black";
		showDealerTotal(dealerHand,'dealer');
		currentWager = 0;
		enableButtons();

	}
	if((dealerTotal === 21) && (playerTotal === 21)){
		placecard(dealerHand[1], 'dealer', 'two');
		disablePlayButtons();
		document.getElementById('message').innerHTML = "You both tied with 21! Bet again";
		totalMoney = totalMoney + currentWager;
		currentWager = 0;
		document.getElementById('money').innerHTML = totalMoney;
		enableButtons();
	}
	if (playerTotal === 21){
		document.getElementById('message').innerHTML = "You have 21.  Time to Stand";			// document.getElementById('message').innerHTML = "You have 21. Time to Stand.";
	}
	document.getElementById("wins-and-losses").innerHTML ="$" + totalLostWon;
	
}


function hit(){
	var slot;
	if(playerTotalCards === 2){
		slot = "three";
	}else if(playerTotalCards === 3){
		slot = "four";
	}else if(playerTotalCards === 4){
		slot = "five";
	}else if(playerTotalCards === 5){
		slot = "six";
	}
	placeCard(deck[placeInDeck], 'player', slot);
	playerHand.push(deck[placeInDeck]);  //put the card in the player's hand
	playerTotalCards++;
	placeInDeck++
	calculateTotal(playerHand, 'player');
	var score = calculateTotal(playerHand, 'player');
	if (score > 21){
		document.getElementById("hit-button").disabled=true;
	}else if (score === 21){
		document.getElementById('message').innerHTML = "You have 21.  Time to Stand";
	}
}

function showDealerTotal(hand, who){
	var newTotal = 0;
	var AceCount = 0;
	for(i=0; i<hand.length; i++){
		var cardValue = hand[i].slice(0,-1); //will copy everything but one from the end
		if(cardValue < 2){
			newTotal = newTotal + Number(cardValue);
			AceCount++;
		}else if(cardValue < 11){
			newTotal = newTotal + Number(cardValue);
		}else{
			newTotal = newTotal + 10;
		}
	}
	if(AceCount > 0){
		newTotal = Ace(newTotal);
	}
	var idWhoToGet = who + '-total';
	// document.getElementById(idWhoToGet).innerHTML = total;
	document.getElementById(idWhoToGet).innerHTML = newTotal;
	return(newTotal);

}

function stand(){
	document.getElementById("draw-button").style.backgroundColor="black";
	showDealerTotal(dealerHand, 'dealer');
	placeCard(dealerHand[1], 'dealer', 'two');
	var dealerHas = Number(document.getElementById('dealer-total').innerHTML);
	var slot;
	while(dealerHas < 17){
			//keep hitting
		if(dealerTotalCards === 2){
			slot = "three";
		}else if(dealerTotalCards === 3){
			slot = "four";
		}else if(dealerTotalCards === 4){
			slot = "five";
		}else if(dealerTotalCards === 5){
			slot = "six";
		}
		placeCard(deck[placeInDeck], 'dealer', slot);
		dealerHand.push(deck[placeInDeck]);
		dealerHas = showDealerTotal(dealerHand, 'dealer');
		console.log("dealerhas equals " + dealerHas);
		placeInDeck++;
		dealerTotalCards++;
	}
//We know the dealer now has more than 17 or we would still be in the loop
	checkWin (Number(document.getElementById('dealer-total').innerHTML), Number(document.getElementById('player-total').innerHTML));
	document.getElementById("wins-and-losses").innerHTML ="$" + totalLostWon;

}

function checkWin(dealerScore, playerScore){
	if(dealerScore > 21){
		document.getElementById('message').innerHTML = "The dealer busted.  You win! Bet again.";
		totalWins++;
		document.getElementById('win-count').innerHTML = totalWins;
		totalMoney = totalMoney + (currentWager*2);
		document.getElementById('win-count').innerHTML = totalWins;
		checkWinReset();
		disablePlayButtons();
	}else if(dealerScore > playerScore){
		document.getElementById('message').innerHTML = "The dealer won. You Lost. Bet again.";
		checkWinReset();
		disablePlayButtons();
	}else if(dealerScore === playerScore){	
		document.getElementById('money').innerHTML = totalMoney;
		document.getElementById('draw-button').disabled="true";
		enableButtons();
		disableButtons();
		disablePlayButtons();
		document.getElementById("draw-button").style.backgroundColor="black";
		document.getElementById('message').innerHTML = "The game is a draw. Bet again.";
		totalMoney = totalMoney + currentWager;
		document.getElementById('money').innerHTML = totalMoney;
		currentWager = 0;	
	}else{
		document.getElementById('message').innerHTML = "Congratulations! You beat the dealer! Bet again."
		totalWins++;
		document.getElementById('win-count').innerHTML = totalWins;
		totalMoney = totalMoney + (currentWager*2);
		checkWinReset();
		disablePlayButtons();
	}
	document.getElementById("wins-and-losses").innerHTML ="$" + totalLostWon;
}

function checkWinReset(){
		currentWager = 0;
		document.getElementById('money').innerHTML = totalMoney;
		document.getElementById('draw-button').disabled = true;
		enableButtons();
		disableButtons();
		document.getElementById("draw-button").style.backgroundColor="black";

}



function wager1(wageramount){
	currentWager = Number(wageramount);
	document.getElementById("draw-button").disabled=false;
	document.getElementById('current-bet-amount').innerHTML = "$ " + currentWager;
	if(totalMoney < currentWager){
		document.getElementById('message').innerHTML = "You are out of money! Start Over";
		// reset();
		disablePlayButtons();
		enableButtons();
		totalMoney=initialMoney;
	}else{

		var cards = document.getElementsByClassName('card');
		for (i=0; i<cards.length; i++){
			cards[i].innerHTML = "";
			cards[i].className = 'card empty';
			cards[i].style.backgroundColor = "#ccc";
			cards[i].style.background = "";
		}
		document.getElementById('dealer-total').innerHTML="";
		document.getElementById('player-total').innerHTML="";


		totalMoney = totalMoney - currentWager;
		document.getElementById('money').innerHTML = totalMoney;
		document.getElementById("wager1-button").disabled=true;
		document.getElementById("wager2-button").disabled=true;
		document.getElementById("wager5-button").disabled=true;
		document.getElementById("wager1-button").style.backgroundColor="#b8cfb8";
		document.getElementById("wager2-button").style.backgroundColor="#b8cfb8";
		document.getElementById("wager5-button").style.backgroundColor="#b8cfb8";
		document.getElementById("draw-button").style.backgroundColor="black";
		document.getElementById("hit-button").style.backgroundColor="b8cfb8";
		document.getElementById("stand-button").style.backgroundColor="#b8cfb8";
		document.getElementById("message").innerHTML = "";
		totalLostWon = totalMoney - initialMoney;
		document.getElementById("wins-and-losses").innerHTML ="$" + totalLostWon;
	}
}



function disableButtons(){
	document.getElementById("stand-button").disabled=true;
	document.getElementById("hit-button").disabled=true;
}

function disablePlayButtons(){
	document.getElementById("stand-button").disabled=true;
	document.getElementById("hit-button").disabled=true;
	document.getElementById("draw-button").disabled-true;
	document.getElementById("stand-button").style.backgroundColor = "#b8cfb8";
	document.getElementById("hit-button").style.backgroundColor = "#b8cfb8";
	document.getElementById("draw-button").style.backgroundColor = "#b8cfb8";



}
function enableButtons(){
	document.getElementById('wager1-button').disabled=false;
	document.getElementById('wager2-button').disabled=false;
	document.getElementById('wager5-button').disabled=false;
	document.getElementById("wager1-button").style.backgroundColor="red";
	document.getElementById("wager2-button").style.backgroundColor="red";
	document.getElementById("wager5-button").style.backgroundColor="red";

	document.getElementById('current-bet-amount').innerHTML = " $" + 0;
}


function reset(){
	totalGames++;
	if (totalWins>0){
		winningPercentage = Math.round((totalWins / (totalGames-1))*100);
		document.getElementById('winning-percentage').innerHTML = winningPercentage;

	}else{
		document.getElementById('winning-percentage').innerHTML = 0;
	}
	document.getElementById('total-ties').innerHTML = numberOfTies;	
	document.getElementById('win-count').innerHTML = totalWins;	
	var numberOfLosses = totalGames - numberOfTies - totalWins - 1;
	document.getElementById('total-lost').innerHTML = numberOfLosses;

	playerTotalCards = 2;
	dealerTotalCards = 2;
	playerHand = [];
	dealerHand = [];
	var cards = document.getElementsByClassName('card');
	for (i=0; i<cards.length; i++){
		cards[i].innerHTML = "";
		cards[i].className = 'card empty';
		cards[i].style.backgroundColor = "#ccc";
		cards[i].style.background = "";

	}
	document.getElementById('message').innerHTML = "";
	document.getElementById("hit-button").disabled=false;
	document.getElementById("stand-button").disabled=false;


}
