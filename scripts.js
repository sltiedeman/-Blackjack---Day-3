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




	$('#' + currId).addClass("card"); //takes away empty class
	$('#' + currId).html("<br>" + newCardValue); 
	if(suitValue==='c'){
		$('#' + currId).css("background", "url('small.png') 50% 70% no-repeat");
	}else if(suitValue==='h'){
		$('#' + currId).css("background", "url('heart.png') 50% 70% no-repeat");
	}else if(suitValue==='s'){
		$('#' + currId).css("background", "url('spade.png') 50% 70% no-repeat");
	}else{
		$('#' + currId).css("background", "url('diamond.png') 50% 70% no-repeat");
	}
	$('#' + currId).css("background-color", "#fff");
	$('#' + currId).css("background-size", "30px 30px");


}

function bust(who){
	if(who === "player"){
		//player lost!!  dealer won
		$('#message').html("You have busted. Bet again.");
		disablePlayButtons();
		enableButtons();
	}else{
		$('#message').html("The dealer busted. You win!. Bet again");
		totalWins++;
		$('#win-count').html(totalWins);
		totalMoney = totalMoney + (currentWager*2);
		currentWager = 0;
		$('#money').html(totalMoney);
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
	$('#player-total').html(total);

	if(total>21){
		bust(who);
	}
	return total;
}

function deal(){
	//Shuffled deck from function shuffleDeck
	reset();
	$('#wager1-button').prop("disabled", true);
	$('#wager2-button').prop("disabled", true);
	$('#wager5-button').prop("disabled", true);
	$('#draw-button').prop("disabled", true);
	$("#draw-button").css("background-color", "#b8cfb8");
	$("#hit-button").css("background-color", "black");
	$("#stand-button").css("background-color","black");


	deck = shuffleDeck();
	playerHand = [ deck[0], deck[2] ];
	dealerHand = [ deck[1], deck[3] ];
	placeInDeck = 4;
	placeCard(playerHand[0], 'player', 'one');
	placeCard(dealerHand[0], 'dealer', 'one');
	placeCard(playerHand[1], 'player', 'two');
	// placeCard(dealerHand[1], 'dealer', 'two');

	calculateTotal(playerHand, 'player');
	$('#dealer-total').html("");
	var dealerTotal = calculateTotal(dealerHand, 'dealer');
	var playerTotal = calculateTotal(playerHand, 'player');
	if ((dealerTotal === 21) && (playerTotal != 21)){
		placeCard(dealerHand[1], 'dealer', 'two');
		disablePlayButtons();
		$('#message').html("Dealer got BlackJack. You lose. Bet again");
		$("#draw-button").css("background-color","black");
		showDealerTotal(dealerHand,'dealer');
		currentWager = 0;
		enableButtons();

	}
	if((dealerTotal === 21) && (playerTotal === 21)){
		placecard(dealerHand[1], 'dealer', 'two');
		disablePlayButtons();
		$('#message').html("You both tied with 21! Bet again");
		totalMoney = totalMoney + currentWager;
		currentWager = 0;
		$('#money').html(totalMoney);
		enableButtons();
	}
	if (playerTotal === 21){
		$('#message').html("You have 21.  Time to Stand");			
	}
	$("#wins-and-losses").html("$" + totalLostWon);


	
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
		$("#hit-button").prop("disabled",true);
	}else if (score === 21){
		$('#message').html("You have 21.  Time to Stand");
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
	$('#' + idWhoToGet).html(newTotal);
	return(newTotal);

}

function stand(){
	$("#draw-button").css("background-color", "black");
	showDealerTotal(dealerHand, 'dealer');
	placeCard(dealerHand[1], 'dealer', 'two');
	var dealerHas = Number($('#dealer-total').html());
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
		placeInDeck++;
		dealerTotalCards++;
	}
//We know the dealer now has more than 17 or we would still be in the loop
	checkWin (Number($('#dealer-total').html()), Number($('#player-total').html()));
	$("#wins-and-losses").html("$" + totalLostWon);

}

function checkWin(dealerScore, playerScore){
	if(dealerScore > 21){
		$('#message').html("The dealer busted.  You win! Bet again.");
		totalWins++;
		$('#win-count').html(totalWins);
		totalMoney = totalMoney + (currentWager*2);
		$('#win-count').html(totalWins);
		checkWinReset();
		disablePlayButtons();
	}else if(dealerScore > playerScore){
		$('#message').html("The dealer won. You Lost. Bet again.");
		checkWinReset();
		disablePlayButtons();
	}else if(dealerScore === playerScore){	
		$('#money').html(totalMoney);
		$('#draw-button').prop("disabled",true);
		enableButtons();
		disableButtons();
		disablePlayButtons();
		$("#draw-button").css("background-color","black");
		$('#message').html("The game is a draw. Bet again.");
		totalMoney = totalMoney + currentWager;
		$('#money').html(totalMoney);
		currentWager = 0;	
	}else{
		$('#message').html("Congratulations! You beat the dealer! Bet again.")
		totalWins++;
		$('#win-count').html(totalWins);
		totalMoney = totalMoney + (currentWager*2);
		checkWinReset();
		disablePlayButtons();
	}
	$("#wins-and-losses").html("$" + totalLostWon);
}

function checkWinReset(){
		currentWager = 0;
		$('#money').html(totalMoney);
		$('#draw-button').prop("disabled", true);
		enableButtons();
		disableButtons();
		$("#draw-button").css("background-color", "black");

}



function wager1(wageramount){
	currentWager = Number(wageramount);
	$("#draw-button").prop("disabled", false);
	$('#current-bet-amount').html("$ " + currentWager);
	if(totalMoney < currentWager){
		$('#message').html("You are out of money! Start Over");
		// reset();
		disablePlayButtons();
		enableButtons();
		totalMoney=initialMoney;
	}else{

		var cards = $('.card');
		cards.each(function(){
			$(this).html("");
			$(this).addClass("empty");
			$(this).css("background-color", "#ccc");
			$(this).css("background", "");

		});
		// for (i=0; i<cards.length; i++){
		// 	cards[i].html("");
		// 	cards[i].className = 'card empty';
		// 	cards[i].style.backgroundColor = "#ccc";
		// 	cards[i].style.background = "";
		// }
		$('#dealer-total').html("");
		$('#player-total').html("");


		totalMoney = totalMoney - currentWager;
		$('#money').html(totalMoney);
		$("#wager1-button").prop("disabled", true);
		$("#wager2-button").prop("disabled", true);
		$("#wager5-button").prop("disabled", true);
		$("#wager1-button").css("background-color","#b8cfb8");
		$("#wager2-button").css("background-color","#b8cfb8");
		$("#wager5-button").css("background-color","#b8cfb8");
		$("#draw-button").css("background-color", "black");
		$("#hit-button").css("background-color","#b8cfb8");
		$("#stand-button").css("background-color","#b8cfb8");
		$("#message").html("");
		totalLostWon = totalMoney - initialMoney;
		$("#wins-and-losses").html("$" + totalLostWon);
	}
}



function disableButtons(){
	$("#stand-button").prop("disabled", true);
	$("#hit-button").prop("disabled", true);
}

function disablePlayButtons(){
	$("#stand-button").prop("disabled", true);
	$("#hit-button").prop("disabled", true);
	$("#draw-button").prop("disabled", true);
	$("#stand-button").css("background-color","#b8cfb8");
	$("#hit-button").css("background-color", "#b8cfb8");
	$("#draw-button").css("background-color", "#b8cfb8");



}
function enableButtons(){
	$('#wager1-button').prop("disabled", false);
	$('#wager2-button').prop("disabled", false);
	$('#wager5-button').prop("disabled", false);
	$("#wager1-button").css("background-color", "red");
	$("#wager2-button").css("background-color", "red");
	$("#wager5-button").css("background-color", "red");

	$('#current-bet-amount').html(" $" + 0);
}


function reset(){
	totalGames++;
	if (totalWins>0){
		winningPercentage = Math.round((totalWins / (totalGames-1))*100);
		$('#winning-percentage').html(winningPercentage);

	}else{
		$('#winning-percentage').html(0);
	}
	$('#total-ties').html(numberOfTies);	
	$('#win-count').html(totalWins);	
	var numberOfLosses = totalGames - numberOfTies - totalWins - 1;
	$('#total-lost').html(numberOfLosses);

	playerTotalCards = 2;
	dealerTotalCards = 2;
	playerHand = [];
	dealerHand = [];
	var cards = $('#card');
	cards.each(function(){
		this.html("");
		this.attr('class', 'card empty');
		this.css("background-color", "#ccc");
		this.css("background", "");

	});
	// for (i=0; i<cards.length; i++){
	// 	cards[i].html("");
	// 	cards[i].className = 'card empty';
	// 	cards[i].style.backgroundColor = "#ccc";
	// 	cards[i].style.background = "";

	// }
	$('#message').html("");
	$("#hit-button").prop("disabled", false);
	$("#stand-button").prop("disabled", false);


}
