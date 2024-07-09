import Phaser from 'phaser';

var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 } // Adjust gravity as needed
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('player2', 'assets/player2.png'); // Make sure the asset exists
}

function create() {
    this.add.image(400, 300, 'sky').setScale(2);

    // Player 1 setup
    this.player = this.physics.add.sprite(100, 750, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(1000); // Ensure player has gravity

    // Player 2 setup
    this.player2 = this.physics.add.sprite(950, 750, 'player2');
    this.player2.setCollideWorldBounds(true);
    this.player2.body.setGravityY(0); // Ensure player2 is not affected by gravity

    // Set world bounds
    this.physics.world.bounds.width = 1000;
    this.physics.world.bounds.height = 800;

    // Scale the players
    this.player.setScale(0.2);
    this.player2.setScale(0.2);

    // Keyboard input for Player 1
    this.cursors = this.input.keyboard.createCursorKeys();

    // Collision detection
    this.physics.add.collider(this.player, this.player2, handleCollision, null, this);

    this.keys = this.input.keyboard.addKeys({
        W: Phaser.Input.Keyboard.KeyCodes.W,
        A: Phaser.Input.Keyboard.KeyCodes.A,
        S: Phaser.Input.Keyboard.KeyCodes.S,
        D: Phaser.Input.Keyboard.KeyCodes.D,
        P: Phaser.Input.Keyboard.KeyCodes.P // Key to pause and resume
    });

    // Initialize score counter
    this.score = 0;
    // Display score in the top right corner
    this.scoreText = this.add.text(700, 50, 'Score: 0', { fontSize: '32px', fill: '#FFFFFF' });

    // Initialize timer
    this.initialTime = 60;
    this.timerText = this.add.text(50, 50, 'Time: ' + this.initialTime, { fontSize: '32px', fill: '#FFFFFF' });

    // Start countdown timer
    this.time.addEvent({
        delay: 1000,
        callback: updateTimer,
        callbackScope: this,
        loop: true
    });

    // Move player2 to the left
    this.player2.setVelocityX(-200);
}

function update() {
    this.player.setVelocityX(0); // Reset velocity to stop continuous movement

    // Player 1 movement controls
    if (this.cursors.left.isDown || this.keys.A.isDown) {
        this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown || this.keys.D.isDown) {
        this.player.setVelocityX(200);
    }

    if ((this.cursors.up.isDown || this.keys.W.isDown) && this.player.body.blocked.down) {
        this.player.setVelocityY(-1000); // Adjust jump velocity as needed
    }

    // Check if player2 has reached the left boundary
    if (this.player2.x <= 100) {
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
        this.player2.setPosition(950, 750); // Move player2 back to the right edge
    }
    this.player2.setVelocityX(-400); // Set velocity to move left again
}

function updateTimer() {
    this.initialTime -= 1;
    this.timerText.setText('Time: ' + this.initialTime);

    if (this.initialTime <= 0) {
        // Stop all physics and timer events when time runs out
        this.physics.pause();
        this.time.removeAllEvents();
        this.timerText.setText('Time: 0');
    }
}

function handleCollision(player, player2) {
    // Pause all physics
    this.physics.pause();
}

function handleWorldBoundsCollision(body) {
    if (body.gameObject === this.player2) {
        // Increment score counter if player2 collides with the world bounds
        this.score++;
        // Update score text
        this.scoreText.setText('Score: ' + this.score);
    }
}
