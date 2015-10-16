var deck = [];
var placeInDeck;
var playerTotalCards = 2;
var dealerTotalCards = 2;
var playerHand;
var dealerHand;
var totalWins = 0;

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
	// var newCardValue = newCardValue + suitValue;
	// card = newCardValue;




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
		document.getElementById('message').innerHTML = "You have busted. Better luck next time.";
	}else{
		document.getElementById('message').innerHTML = "The dealer busted.  You win!.";
		totalWins++;
		document.getElementById('win-count').innerHTML = totalWins;
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
		console.log(hand[i]);
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
	document.getElementById(idWhoToGet).innerHTML = total;
	if(total>21){
		bust(who);
	}
	return total;
}

function deal(){
	//Shuffled deck from function shuffleDeck
	reset();
	deck = shuffleDeck();
	playerHand = [ deck[0], deck[2] ];
	dealerHand = [ deck[1], deck[3] ];
	placeInDeck = 4;
	placeCard(playerHand[0], 'player', 'one');
	placeCard(dealerHand[0], 'dealer', 'one');
	placeCard(playerHand[1], 'player', 'two');
	placeCard(dealerHand[1], 'dealer', 'two');

	calculateTotal(playerHand, 'player');
	calculateTotal(dealerHand, 'dealer');

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

}

function stand(){
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
		dealerHas = calculateTotal(dealerHand, 'dealer');
		placeInDeck++;
		dealerTotalCards++;
	}
//We know the dealer now has more than 17 or we would still be in the loop
	checkWin (Number(document.getElementById('dealer-total').innerHTML), Number(document.getElementById('player-total').innerHTML));

}

function checkWin(dealerScore, playerScore){
	if(dealerScore > 21){
		document.getElementById('message').innerHTML = "The dealer busted.  You win!";
		totalWins++;
		document.getElementById('win-count').innerHTML = totalWins;
	}else if(dealerScore >= playerScore){
		document.getElementById('message').innerHTML = "The dealer won. You Lost.";
	}else{
		document.getElementById('message').innerHTML = "Congratulations! You beat the dealer!"
		totalWins++;
		document.getElementById('win-count').innerHTML = totalWins;

	}

}

function reset(){
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
	// document.getElementById(currId).style.backgroundColor = "#ccc";
	// document.getElementById(currId).style.backgroundSize = "";

}
