const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//adjust width and height of the canvas
canvas.width = 1024
canvas.height = 576

//set default canvas background to differentiate canvas from browser background
c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = .7

const background = new Sprite({
	position: {
		x:0,
		y:0
	},

	imageSrc: './img/background.png'
})

const shop = new Sprite({
	position: {
		x:315,
		y:197
	},

	imageSrc: './img/shop.png',
	scale: 2.5,
	framesMax: 6
})

// create player 1
const player = new Fighter({
	position:{
		x:0,
		y:0
	},
	velocity: {
		x:0,
		y:0
	},
	offset: {
		x: 0,
		y: 0
	},
	imageSrc: './img/samuraiMack/Idle.png',
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: 215,
		y: 160
	},
	sprites: {
		idle: {
			imageSrc: './img/samuraiMack/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './img/samuraiMack/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/samuraiMack/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/samuraiMack/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './img/samuraiMack/Attack1.png',
			framesMax: 6
		},
		takeHit: {
			imageSrc: './img/samuraiMack/Take hit - white silhouette.png',
			framesMax: 4
		},
		death: {
			imageSrc: './img/samuraiMack/Death.png',
			framesMax: 6
		}
	},
	attackBox: {
		offset: {
			x: 100,
			y: 50
		},
		width: 150,
		height: 50
	}
})

// create enemy 
const enemy = new Fighter({
	position:{
		x:400,
		y:100
	},
	velocity: {
		x:0,
		y:0
	},
	offset: {
		x:-50,
		y:0
	},

	//changes enemy color to blue
	color: 'blue',

	imageSrc: './img/kenji/Idle.png',
	framesMax: 4,
	scale: 2.5,
	offset: {
		x: 215,
		y: 170
	},
	sprites: {
		idle: {
			imageSrc: './img/kenji/Idle.png',
			framesMax: 4
		},
		run: {
			imageSrc: './img/kenji/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/kenji/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/kenji/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './img/kenji/Attack1.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './img/kenji/Take hit.png',
			framesMax: 3
		},
		death: {
			imageSrc: './img/kenji/Death.png',
			framesMax: 7
		}
	},
	attackBox: {
		offset: {
			x: -170,
			y: 50
		},
		width: 170,
		height: 50
	}
})

console.log(player);

const keys = {
	a: {
		pressed: false
	},

	d: {
		pressed: false
	},

	ArrowRight: {
		pressed: false
	},

	ArrowLeft: {
		pressed: false
	},
}

decreaseTimer()

// create infinate loop to animate game
function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)

	background.update()
	shop.update()
	c.fillStyle = 'rgba(255, 255, 255, 0.15'
	c.fillRect(0,0, canvas.width, canvas.height)

	player.update()
	enemy.update()

	//default velocity
	player.velocity.x = 0
	enemy.velocity.x = 0

	//default player image
	
	// changes player velocity once buttons are pressed

	if (keys.a.pressed && player.lastKey === 'a') {
		// check if ultimate was built
		if(player.ult <= 0) {
			player.velocity.x = -10
		} else {
			// left
			player.velocity.x = -5
		}
		//changes to running animation
		player.switchSprite('run')
	} else if (keys.d.pressed && player.lastKey === 'd'){
		//check if ultimate was built
		if(player.ult <= 0) {
			player.velocity.x = 10
		} else {
		// left
			player.velocity.x = 5
		}
		//changes to running animation
		player.switchSprite('run')
	} else {
		player.switchSprite('idle')
	}

	// jump
	if (player.velocity.y < 0){
		player.switchSprite('jump')
	} else if (player.velocity.y > 0 ){
		player.switchSprite('fall')
	}

	// changes enemy velocity once buttons are pressed
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		// check if ultimate was built
		if(enemy.ult <= 0) {
			enemy.velocity.x = -10
		} else {
		// left
			enemy.velocity.x = -5
		}
		//changes to running animation
		enemy.switchSprite('run')
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
		//check if ultimate was built
		if(enemy.ult <= 0) {
			enemy.velocity.x = 10
		} else {
		// left
			enemy.velocity.x = 5
		}
		//changes to running animation
		enemy.switchSprite('run')
	} else {
		enemy.switchSprite('idle')
	}

	// jump
	if (enemy.velocity.y < 0){
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0 ){
		enemy.switchSprite('fall')
	}

	/*
		detect for collisions & enemy is hit
	*/
	//player attack
	if (rectangularCollision({
		rectangle1: player,
		rectangle2: enemy}
		) && player.isAttacking && player.framesCurrent === 4){
			enemy.takeHit()
			player.isAttacking = false
			
			//document.querySelector('#enemyHealth').style.width = enemy.health + '%'
			gsap.to('#enemyHealth', {
				width: enemy.health + '%'
			})

			// charges ultimate bar
			/*
				Ultimate ability works based on damage. For each hit, 25 ult charge is received
				Once ult bar is filled, player movement is doubled	
			*/
			player.ult -= 25
			gsap.to('#playerUlt', {
				width: player.ult + '%'
			})
			//console.log('enemy hit')
	}

	// if player misses
	if (player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false
	}

	//enemy attack
	if (rectangularCollision({
		rectangle1: enemy,
		rectangle2: player}
		) && enemy.isAttacking && enemy.framesCurrent === 2){
			player.takeHit()
			enemy.isAttacking = false


			//document.querySelector('#playerHealth').style.width = player.health + '%'
			gsap.to('#playerHealth', {
				width: player.health + '%'
			})

			// charges ultimate bar
			/*
				Ultimate ability works based on damage. For each hit, 25 ult charge is received
				Once ult bar is filled, player movement is doubled	
			*/
			enemy.ult -= 25
			gsap.to('#enemyUlt', {
				width: enemy.ult + '%'
			})
			//console.log('player hit')
	}

	if (enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false
	}

	//end game based on health

	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({player, enemy, timerId})
	}
}


// display animation
animate()

// event listener to read keys being pressed and set value to true
window.addEventListener('keydown', (event) => {
	if (!player.dead) {
		switch (event.key) {
			/*
				CONTROLS PLAYER
			*/
			//player move to the right
			case 'd':
				keys.d.pressed = true
				player.lastKey = 'd'
				break

			//player move to left
			case 'a':
				keys.a.pressed = true
				player.lastKey = 'a'
				break

			//player jump
			case 'w':
				player.velocity.y = -20
				break

			case ' ':
				player.attack()
				break
			}
		}

		/*
			CONTROLS ENEMY
		*/
		//enemy move to the right
	if (!enemy.dead) {
		switch (event.key) {
			case 'ArrowRight':
				keys.ArrowRight.pressed = true
				enemy.lastKey = 'ArrowRight'
				break

			//enemy move to left
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true
				enemy.lastKey = 'ArrowLeft'
				break

			//enemy jump
			case 'ArrowUp':
				enemy.velocity.y = -20
				break

			case 'ArrowDown':
				enemy.attack()
				break
		}	
	}
})

// event listener to read when keys are released to stop movement by setting key pressed to false
window.addEventListener('keyup', (event) => {
	// player keys
	switch (event.key) {
		case 'd':
			keys.d.pressed = false
			break

		case 'a':
			keys.a.pressed = false
			break
	}

	//enemy keys
	switch (event.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break

		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break

	}
})