
var _game,
	animFrame = window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				null,
	cancelAnimFrame = window.cancelAnimationFrame || 
					  window.mozCancelAnimationFrame;
	
				
				
document.addEventListener('DOMContentLoaded', function () {

	_game = new Game();

	window.addEventListener('keydown', function (e) { _game.KeyDown(e); },true);
	
	_game.Run(animFrame);
	
	
});

