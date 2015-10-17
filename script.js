//ERROR: increasing level doesn't speed up game! Currently commented out of HTML file.
// generates the grid and assigns each square a co-ordinate, starting from (1,1) in the top left hand corner.
function generate(r, c) {
	$('#grid').append("<div class='row'></div>")
	for (var i = 0; i < c; i++) {
		$('.row').append("<div class='square'></div>");
		$('.row').children('.square:last').addClass('x' + (i+1));
		$('.row').children('.square:last').addClass('y1');
	};
	var $row = $('.row');
	for (var i = 0; i < r - 1; i++) {
		$('#grid').append($row.clone());
		$row = $('.row:last');
		$row.children().removeClass('y' + (i+1));
		$row.children().addClass('y' + (i+2));
	};
};

function snake(gridsize) {
	var initial = [[5, 5], [4, 5], [3, 5]];
	var foodx = 0;
	var foody = 0;

	var snake = {
		position: cloneArray(initial),
		direction: 'r'
	};
	//change snake.direction if arrow key pressed
	document.onkeydown = function(i) {
		switch (i.keyCode) {
			case 37:
				snake.direction = 'l';
				break;
			case 38:
				snake.direction = 'u';
				break;
			case 39:
				snake.direction = 'r';
				break;
			case 40:
				snake.direction = 'd';
				break;
		};
	};

	//function moving the snake
	function move() {
		//Clear all squares, add the food and update the snake.position array
		var location = cloneArray(snake.position);
		$('.square').css('background', 'white');
		$('.x' + foodx + '.y' + foody).css('background', 'yellow');
		switch (snake.direction) {
			case 'u':
				snake.position[0][1] -= 1;
				break;
			case 'r':
				snake.position[0][0] += 1;
				break;
			case 'd':
				snake.position[0][1] += 1;
				break;
			case 'l':
				snake.position[0][0] -= 1;
				break;
		};
		for (var i = 1; i < snake.position.length; i++) {
			snake.position[i][0] = location[(i-1)][0];
			snake.position[i][1] = location[(i-1)][1];
		};
		//If food was eaten on the previous turn, extend the snake.
		if (just_eaten == true) {
			snake.position.push(location[(location.length - 1)]);
			just_eaten = false;
			console.log(snake.position);
		};
		//if the snake head has gone off the screen, or collided with itself, end the game. Else draw the updated snake on the page.
		if (offgrid() || duplicates(snake.position)) {
			clearInterval();
			snake.position = cloneArray(initial);
			snake.direction = 'r';
			score = 0;
			level = 1;
			$('span.points').empty();
			$('span.points').append(score);
			$('span.level').empty();
			$('span.level').append(level);
			alert("Game over!");
		} else {
			//If snake head is on top of food, generate new food, update score and increase the level.
			if ((snake.position[0][0] === foodx) && (snake.position[0][1] === foody)) {
				newfood();
				just_eaten = true;
				score++;
				$('span.points').empty();
				$('span.points').append(score);
				if (score % 5 == 0) {
					level += 1;
					$('span.level').empty();
					$('span.level').append(level);
					turnlength = turnlength * 0.8;
					console.log(turnlength);
				}
			};
			for (var i = 0; i < snake.position.length; i++) {
				$('.x' + snake.position[i][0] + '.y' + snake.position[i][1]).css('background', 'black');
			};
		};
	};
	//can simplify. remove var, simply return true. And only check head of snake?
	function offgrid() {
		var off_grid = false;
		for (var i = 0; i < snake.position.length; i++) {
			if ((snake.position[i][0] > gridsize) || (snake.position[i][1] > gridsize) || (snake.position[i][0] < 1) || (snake.position[i][1] < 1)) {
				off_grid = true;
			};
		};
		if (off_grid == true) {
			return true;
		};
	};

	//defines the location of the food
	function newfood() {
		foodx = Math.floor(Math.random() * gridsize + 1);
		foody = Math.floor(Math.random() * gridsize + 1);
		$('.x' + foodx + '.y' + foody).css('background', 'yellow');
		console.log(foodx);
		console.log(foody);
	}
	//moves the snake each turn. Turn length is in ms.
	newfood();
	var just_eaten = false;
	var score = 0;
	var level = 1;
	var turnlength = 250;
	setInterval(move, turnlength);
};

function cloneArray(arr) {  
  // Deep copy arrays. Going one level deep seems to be enough.
  var clone = [];
  for (i=0; i<arr.length; i++) {
    clone.push( arr[i].slice(0) )
  }
  return clone;
}

//Check if an array contains duplicate values.
var duplicates = function(a) {
    var counts = [];
    for(var i = 0; i <= a.length; i++) {
        if(counts[a[i]] === undefined) {
            counts[a[i]] = 1;
        } else {
            return true;
        }
    }
    return false;
}

$(document).ready(function() {
	var square = 40;
	generate(square, square);
	snake(square);
});


// https://github.com/imousterian/OdinProject/blob/master/Project5_3_Snake/js/snake.js
// file:///C:/Users/Rafi/Documents/Rafi%27s%20Work/Programming/Snake/index.html