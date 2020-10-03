/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

let scores, roundScore, activePlayer, dice, dice2, activeGame;
let diceDom = document.querySelector('#dice-1');
let diceDom2 = document.querySelector('#dice-2');
init()

document.querySelector('.btn-roll').addEventListener('click', function() {
	if(!activeGame) {
		return false;
	}
	dice = Math.floor((Math.random() * 6) + 1);
	dice2 = Math.floor((Math.random() * 6) + 1);
	diceDom.style.display = 'block';
	diceDom2.style.display = 'block';
	diceDom.src = `dice-${dice}.png`;
	diceDom2.src = `dice-${dice2}.png`;
	if (dice === 6 && dice2 === 6) {
		scores[activePlayer] = 0;
		document.querySelector(`#score-${activePlayer}`).textContent = 0;
		nextPlayer();

	} else if (dice !== 1 && dice !== 2) {
		roundScore += dice + dice2;
		document.querySelector(`#current-${activePlayer}`).textContent = roundScore
	} else {
		nextPlayer();
	}
});

document.querySelector('.btn-hold').addEventListener('click', function() {
	if(!activeGame) {
		return false;
	}
	scores[activePlayer] += roundScore;
	document.querySelector(`#score-${activePlayer}`).textContent = scores[activePlayer];

	var input = document.querySelector('.final-score').value;
	var winningScore = input || 100; ;

	if (scores[activePlayer] >= winningScore) {
		activeGame = false;
		document.querySelector(`#score-${activePlayer}`).textContent = 'Winner!';
		diceDom.style.display = 'none';
		diceDom2.style.display = 'none';
		document.querySelector(`.player-${activePlayer}-panel`).classList.add('winner');
		document.querySelector(`.player-${activePlayer}-panel`).classList.remove('active');
	} else {
		nextPlayer();
	}

});

document.querySelector('.btn-new').addEventListener('click', init)

function init() {
	scores = [0, 0];
	roundScore = 0;
	activePlayer = 0;
	activeGame = true;
	diceDom.style.display = 'none';
	diceDom2.style.display = 'none';
	document.querySelector('#score-0').textContent = '0';
	document.querySelector('#score-1').textContent = '0';
	document.querySelector('#current-0').textContent = '0';
	document.querySelector('#current-1').textContent = '0';
	document.querySelector(`#name-0`).textContent = 'Player 1';
	document.querySelector(`#name-1`).textContent = 'Player 2';
	document.querySelector(`.player-0-panel`).classList.remove('winner');
	document.querySelector(`.player-1-panel`).classList.remove('winner');
	document.querySelector(`.player-0-panel`).classList.remove('active');
	document.querySelector(`.player-1-panel`).classList.remove('active');
	document.querySelector(`.player-0-panel`).classList.add('active');
}

function nextPlayer() {
	activePlayer = (activePlayer === 0) ? 1 : 0;

	roundScore = 0;
	document.querySelector('#current-0').textContent = '0';
	document.querySelector('#current-1').textContent = '0';
	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');
	diceDom.style.display = 'none';
	diceDom2.style.display = 'none';
}
