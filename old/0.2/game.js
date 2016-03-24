function Game() {
	// declare variables
	this._canvas;
	this._canvasContext;
	this._canvasBuffer;
	this._canvasBufferContext;
	this._monsters;
	this._player;
	this._shots;
	this._gameLoop;
	this._animFrame;
	this._gameOver = false;
	this._win = false;
	this._intro;
	this._flicker;
	this._stars;

	this.Initialize = function (animFrame) {
		// initialize all game variables
		this._animFrame = animFrame;
		this._canvas = document.getElementById('Canvas1');
		if (this._canvas && this._canvas.getContext) {
			this._canvasContext = this._canvas.getContext('2d');
			this._canvasBuffer = document.createElement('canvas');
			this._canvasBuffer.width = this._canvas.width;
			this._canvasBuffer.height = this._canvas.height;
			this._canvasBufferContext = this._canvasBuffer.getContext('2d');
			return true;
		}
		return false; 
	}
	
	this.LoadContent = function () {
		// load content – graphics, sound etc.
		// since all content is loaded run main game loop
		// Calls RunGameLoop method every ‘draw interval’
		var _this = this;
		
		this._flicker = new Flicker();
		this._flicker.Init(10, ["teal", "black"], ["white", "green"], 100, this._canvas.width, this._canvas.height);
		
		this._intro = new Intro();
		this._intro.Init(this._canvas.width, this._canvas.height);

		this._stars = new Stars();
		this._stars.Init(20, 0, 0, "#000000", this._canvas.width, this._canvas.height);
		
		this._monsters = new Monsters();
		this._monsters.GenerateMonsters(5, 5, "red", "white", 30, 30);
		
		this._player = new Player();
		this._player.Init(20, ((this._canvas.width / 2) - 50), (this._canvas.height - 100), 100, 75);
		
		this._shots = [];
		
		this._gameLoop = this._animFrame.call(window, function () { _this.RunGameLoop(); });
	}
	
	this.Run = function (animFrame) {
		if (this.Initialize(animFrame)) {
			// if initialization was succesfull, load content
			this.LoadContent();
		}
	}

	this.RunGameLoop = function () {
		var _this = this;
		
		this.Update();
		this.Draw();	
		
		if (this._gameOver) {
			this.GameOver();
		} else if (this._win) {
			this.Win();
		} else {
			this._gameLoop = this._animFrame.call(window, function () { _this.RunGameLoop(); });		
		}
	}
	
	// Temp until levels are implemented!
	this.Win = function () {
		cancelAnimFrame(this._gameLoop);	
		
		// Clear
		this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._canvasBufferContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
		// Set black background
		this._canvasContext.fillStyle = "#000000";
		this._canvasContext.beginPath();
		this._canvasContext.rect(0, 0, this._canvas.width, this._canvas.height);
		this._canvasContext.closePath();
		this._canvasContext.fill();
		
		// Set game over text
		this._canvasContext.beginPath();
		this._canvasContext.font = '40pt Calibri';
		this._canvasContext.fillStyle = 'red';
		this._canvasContext.fillText('WIN!', 350, 300);
		this._canvasContext.closePath();
		this._canvasContext.fill();
	}
	
	this.GameOver = function () {
		cancelAnimFrame(this._gameLoop);
		
		// Clear
		this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._canvasBufferContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
		// Set black background
		this._canvasContext.fillStyle = "#000000";
		this._canvasContext.beginPath();
		this._canvasContext.rect(0, 0, this._canvas.width, this._canvas.height);
		this._canvasContext.closePath();
		this._canvasContext.fill();
		
		// Set game over text
		this._canvasContext.beginPath();
		this._canvasContext.font = '40pt Calibri';
		this._canvasContext.fillStyle = 'red';
		this._canvasContext.fillText('Game over!', 250, 300);
		this._canvasContext.closePath();
		this._canvasContext.fill();
	}
		
	this.KeyDown = function (evt) {
		switch (evt.keyCode) {
			case 37:  /* Left arrow was pressed */
				this._player.SetDirection(-1);
				break;
			case 39:  /* Right arrow was pressed */
				this._player.SetDirection(1);
				break;
			case 32: /* Space bar */
				var shot = new Shot();
				shot.Init((this._player._posX + (this._player._width / 2)) , this._player._posY);
				this._shots.push(shot);
				break;
			case 27: /* Escape */
				if (!this._intro._introFinished) { /* Skip intro */
					this._intro.EndIntro();
				}
				break;
		}
	}
	
	this.Update = function () {
		// update game variables, handle user input, perform calculations etc.
	
		if (!this._intro._introFinished) {
			this._flicker.Update();
			this._intro.Update();
		} else {	
			
			if (this._monsters.IsWin()) {
				this._win = true;
			}
			// Update stars
			this._stars.Update();
		
			// Update monsters
			this._monsters.Update(this._canvas.width, this._canvas.height);
			if (this._monsters.CausesGameOver())
				this._gameOver = true;
			
			// Remove inactive shots
			this._shots = this._shots.filter(function (e) {
				return e.IsActive();
			});
		
			// Update shots
			var i = 0;
			for (; i < this._shots.length; i = i + 1) {		
				this._shots[i].Update(this._canvas.width, this._canvas.height);
			
				// Determine shot -> monster collisions
				this._monsters.CheckHit(this._shots[i]);
			}
		
			//Update player
			this._player.Update();
		}
	}


	this.Draw = function () {
		//Clear canvas
		this._canvasBufferContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
		if (!this._intro._introFinished) {
			// Draw flicker & intro
			this._flicker.Draw(this._canvasBufferContext);
			this._intro.Draw(this._canvasBufferContext);
		} else {
			// Draw stars and background
			this._stars.Draw(this._canvasBufferContext);
		
			//Draw monsters
			this._monsters.Draw(this._canvasBufferContext);
				
			//Draw player
			this._player.Draw(this._canvasBufferContext);
		
			//Draw shots
			var i = 0;
			for (; i < this._shots.length; i = i + 1) {
				this._shots[i].Draw(this._canvasBufferContext);
				this._canvasContext.drawImage(this._canvasBuffer, 0, 0); 
			}
		}
		
		//draw buffer on screen
		this._canvasContext.drawImage(this._canvasBuffer, 0, 0); 
	}
}