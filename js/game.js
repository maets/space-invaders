/* TODO list:
1. Create some handler for timed scenes.
2. Create a generic class/function for framed messages that maintains the current background (through temp copy?) and centers the text.


*/
function Game() {
	// declare variables
	this._canvas;
	this._canvasContext;
	this._canvasBuffer;
	this._canvasBufferContext;
	this._monsters;
	this._levelIndex = 0;
	this._levels = [];
	this._player;
	this._shots;
	this._gameLoop;
	this._animFrame;
	this._gameOver = false;
	this._win = false;
	this._firstWinCall;
	this._firstLevelIntroCall = true;
	this._levelIntro = true;
	this._intro;
	this._flicker;
	this._stars;
	this._sounds = {
		"explode":new Audio("music/explode1.mp3"), 
		"shot":new Audio("music/shot1.mp3"),
		"gameover":new Audio("music/gameover1.mp3"),
		"levelcompleted":new Audio("music/levelcomplete1.mp3"),
	},
	this._music;
	this._musicStarted;
	this._pauseUntil = 0;
	
	/* Play (& loop) the game music */
	this.PlayMusic = function () {
		if (!this._music) {
			var obj = document.querySelector("#AudioIngame");
			if (!!obj && !!obj.play) {
				this._music = obj;
				
				// Add looping
				this._music.addEventListener('ended', this.PlayMusic, false);
				
				this._musicStarted = true;
			}
		} 
		this._music.currentTime = 0;
		this._music.play();
	}
	
	/* "Power off" the game */
	this.PowerOff = function () {
		cancelAnimFrame(this._gameLoop);	
		
		this._musicStarted = false;
		this._gameOver = false;
		this._win = false;
		this._levelIndex = 0;
		this._pauseUntil = 0;
		this._levelIntro = true;
		this._firstLevelIntroCall = true;
		
		// Turn off & remove music loop
		this._music.stop();
		this._music.removeEventListener('ended', this.PlayMusic);
		
		// Set black background
		this._canvasContext.fillStyle = "#000000";
		this._canvasContext.beginPath();
		this._canvasContext.rect(0, 0, this._canvas.width, this._canvas.height);
		this._canvasContext.closePath();
		this._canvasContext.fill();
	}
	
	/* Plays specified sound if it exists in dictionary */
	this.PlaySound = function (name) {		
		if (!!this._sounds[name]) {
			this._sounds[name].currentTime = 0;
			this._sounds[name].play();
		}
	}
	
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
		
		// Create some levels
		this._levels = [];
		var levelMap = [
				//{ name: "Bengt Alsterlind evil tjipp clan", amount: 5, speed: 1, color: "Red", borderColor: "White", height: 30, width: 30 },
				//{ name: "Zombie creatures from Mars", amount: 7, speed: 1, color: "Green", borderColor: "White", height: 30, width: 30 },
				//{ name: "Moon weed farmer labor", amount: 10, speed: 2, color: "Blue", borderColor: "White", height: 20, width: 20 },
				{ name: "ET & CO", amount: 1 /*12*/, speed: 2, color: "Lime", borderColor: "White", height: 50, width: 50 },
				{ name: "Bengt Alsterlind himself", amount: 1, speed: 3, color: "Black", borderColor: "White", height: 40, width: 30 }
			],
			level = null,
			monsters = null,
			i = 0;
		
		for (; i < levelMap.length; i = i + 1) {
			level = new Level();
			monsters = new Monsters();
			// Legend: amount, speed, color, borderColor, height, width
			monsters.GenerateMonsters(levelMap[i].amount, levelMap[i].speed, levelMap[i].color, levelMap[i].borderColor, levelMap[i].width, levelMap[i].height);
			level.Init(monsters, levelMap[i].name);
			this._levels.push(level);
		}
	
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
		
		if (!this._intro._introFinished) {
			this.Intro();
		} else if (this._gameOver) {
			this.GameOver();
			return;
		} else if (this._levelIntro) { 
			this.LevelIntro(this._firstLevelIntroCall);
		} else if (this._win) {
			this.Win(this._firstWinCall);
		} else {
			this.Update();
			this.Draw();		
		}
		this._gameLoop = this._animFrame.call(window, function () { _this.RunGameLoop(); });
	}
	
	this.Intro = function () {
		//Clear canvas
		this._canvasBufferContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
		// Update flicker & intro
		this._flicker.Update();
		this._intro.Update();
		
		// Draw flicker & intro
		this._flicker.Draw(this._canvasBufferContext);
		this._intro.Draw(this._canvasBufferContext);
		
		// Draw buffer on screen
		this._canvasContext.drawImage(this._canvasBuffer, 0, 0); 
	}
	
	/* Displays the current levels "name" before it starts */
	this.LevelIntro = function (firstCall) {
		if (firstCall) {
			this._firstLevelIntroCall = false;
			this._pauseUntil = this._gameLoop + 200;
			
			// Clear
			this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
			this._canvasBufferContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
			
			// Set black background
			this._canvasContext.fillStyle = "#000000";
			this._canvasContext.beginPath();
			this._canvasContext.rect(0, 0, this._canvas.width, this._canvas.height);
			this._canvasContext.closePath();
			this._canvasContext.fill();
			
			// Set level completed text
			this._canvasContext.beginPath();
			this._canvasContext.font = '30pt Calibri';
			this._canvasContext.textAlign = 'center';
			this._canvasContext.fillStyle = 'red';
			this._canvasContext.fillText("Level " + (this._levelIndex + 1), (this._canvas.width / 2), 200);
			this._canvasContext.fillText(this._levels[this._levelIndex]._name, (this._canvas.width / 2), 300);
			this._canvasContext.closePath();
			this._canvasContext.fill();
			
			//draw buffer on screen
			this._canvasContext.drawImage(this._canvasBuffer, 0, 0);
		}
		
		// When level intro condition has been displayed long enough
		if (this._gameLoop > this._pauseUntil) {
			this._pauseUntil = 0;
			this._levelIntro = false;
			this._firstLevelIntroCall = true;
		}
	}
	
	this.Win = function (firstCall) {
		//cancelAnimFrame(this._gameLoop);	
		if (firstCall) {
			this._firstWinCall = false;
			this._pauseUntil = this._gameLoop + 500;
			
			this.PlaySound('levelcompleted');
		
			// Clear
			this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
			this._canvasBufferContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
			
			// Set black background
			this._canvasContext.fillStyle = "#000000";
			this._canvasContext.beginPath();
			this._canvasContext.rect(0, 0, this._canvas.width, this._canvas.height);
			this._canvasContext.closePath();
			this._canvasContext.fill();
			
			// Set level completed text
			this._canvasContext.beginPath();
			this._canvasContext.font = '40pt Calibri';
			this._canvasContext.textAlign = 'center';
			this._canvasContext.fillStyle = 'red';
			this._canvasContext.fillText('Level completed!', (this._canvas.width / 2), 300);
			this._canvasContext.closePath();
			this._canvasContext.fill();
			
			// Draw buffer on screen
			this._canvasContext.drawImage(this._canvasBuffer, 0, 0); 
		} 
		
		// When win condition has been displayed long enough
		if (this._gameLoop > this._pauseUntil) {
			this._pauseUntil = 0;
			this._win = false;	
			this._levelIndex = this._levelIndex + 1;
            this._levelIntro = true;
		}
	}
	
	this.GameOver = function () {
		cancelAnimFrame(this._gameLoop);
		
		this.PlaySound('gameover');
		
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
		this._canvasContext.textAlign = 'center';
		this._canvasContext.fillStyle = 'red';
		this._canvasContext.fillText('Game over!', (this._canvas.width / 2), 300);
		this._canvasContext.closePath();
		this._canvasContext.fill();
		
		// Draw buffer on screen
		this._canvasContext.drawImage(this._canvasBuffer, 0, 0); 
	}
		
	this.KeyDown = function (evt) {
		// Prevent keydown events before game is started
		if (!this._gameLoop) {
			return
		}
		
		// Handle keydown events
		switch (evt.keyCode) {
			case 37:  /* Left arrow was pressed */
				this._player.SetDirection(-1);
                evt.preventDefault();
                break;
			case 39:  /* Right arrow was pressed */
				this._player.SetDirection(1);
                evt.preventDefault();
				break;
			case 32: /* Space bar */
				var shot = new Shot();
				shot.Init((this._player._posX + (this._player._width / 2)) , this._player._posY);
				this._shots.push(shot);
				this.PlaySound('shot');
                evt.preventDefault();
				break;
			case 27: /* Escape */
				if (!!this._intro && !this._intro._introFinished) { /* Skip intro */
					this._intro.EndIntro();
				}
                evt.preventDefault();
				break;
		}
	}
	
	this.Update = function () {
		// update game variables, handle user input, perform calculations etc.
				
		// Play game music 
		if (!this._musicStarted) {
			this.PlayMusic();
		}
		
		// Check if level is completed
		if (this._levels[this._levelIndex].IsWin()) {
			this._win = true;
			this._firstWinCall = true;
		}
		// Update stars
		this._stars.Update();
	
		// Update monsters
		this._levels[this._levelIndex].Update(this._canvas.width, this._canvas.height);
		if (this._levels[this._levelIndex].CausesGameOver())
			this._gameOver = true;
		
		// Remove inactive shots
		this._shots = this._shots.filter(function (e) {
			return e.IsActive();
		});
	
		// Update shots
		var i = 0;
		for (; i < this._shots.length; i = i + 1) {		
			this._shots[i].Update(this._canvas.width, this._canvas.height);
		
			// Determine shot -> monster collisions & play sound
			if (this._levels[this._levelIndex]._monsters.CheckHit(this._shots[i])) {
				this.PlaySound('explode');
			}
		}
	
		//Update player
		this._player.Update(this._canvas.width, this._canvas.height);
	}

	this.Draw = function () {
		//Clear canvas
		this._canvasBufferContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
		// Draw stars and background
		this._stars.Draw(this._canvasBufferContext);
	
		//Draw level & monsters
		this._levels[this._levelIndex].Draw(this._canvasBufferContext);
			
		//Draw player
		this._player.Draw(this._canvasBufferContext);
	
		//Draw shots
		var i = 0;
		for (; i < this._shots.length; i = i + 1) {
			this._shots[i].Draw(this._canvasBufferContext);
		}
				
		// Draw buffer on screen
		this._canvasContext.drawImage(this._canvasBuffer, 0, 0); 
	}
}