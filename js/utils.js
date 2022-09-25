function rectangularCollision({
	rectangle1, rectangle2
}) {
	return(rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
		rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
		&& rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
		&& rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}


function determineWinner({player, enemy, timerId}) {
	clearTimeout(timerId)
	document.querySelector('#displayText').style.display = 'flex'

	// added feature that displays restart button once the game is over, refreshes page and allows the game to be played again
	document.querySelector('#restartButton').style.display = 'flex'
	document.querySelector('#restartButton').addEventListener('click', function(){
  		window.location.reload();
  		return false;
	});

	// game result displays
	if (player.health === enemy.health) {
			document.querySelector('#displayText').innerHTML = 'Tie'
		}

	else if (player.health > enemy.health) {
		document.querySelector('#displayText').innerHTML = 'Player 1 wins!'
		document.querySelector('#restart').style.display = 'flex'
	}

	else if (player.health < enemy.health) {
		document.querySelector('#displayText').innerHTML = 'Player 2 wins!'
	}
}


// decreases the game timer by 1 second
let timer = 60
let timerId
function decreaseTimer() {
	if (timer > 0){
		timerId = setTimeout(decreaseTimer, 1000)
		timer--
		document.querySelector('#timer').innerHTML = timer
	}

	if (timer === 0) {

		//displays HTML text on screen 
		document.querySelector('#displayText').style.display = 'flex'

		determineWinner({player, enemy, timerId})
	}
}