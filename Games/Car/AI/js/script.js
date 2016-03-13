var Car = Car || {};

Car.race = (function () {
	var flag, fn, api;
	flag = {
		'gameInterval': '',
		'car': {
			'self': jQuery('.car'),
			'front': jQuery('.front'),
			'left': jQuery('.left'),
			'right': jQuery('.right')
		},
		'road': jQuery('.road'),
		'lamp': jQuery('.lamp'),
		'hurdles': jQuery('.hurdles'),
		'startBtn': jQuery('.start'),
		'stopBtn': jQuery('.stop'),
		'collision': 0,
		'miss': 0,
		'reset': 0
	};
	fn = {
		_init: function () {
			//fn._positionHurdles();
			fn._handleEvents();
			//fn._startGame();
		},
		_handleEvents: function () {
			flag['startBtn']	.on('click.car', function (event) {
				fn._startGame();
			});
			flag['stopBtn']	.on('click.car', function (event) {
				fn._stopGame();
			});
		},
		_positionHurdles: function () {
			var road = flag['road']	.height() - 50;
			flag['hurdles']	.each(function () {
				var randTop = parseInt ( Math.random() * road );
				jQuery(this)	.css( { 'left': '', 'right': '0px', 'top': randTop + 'px' } );
			});
		},
		_startGame: function () {
			var road = jQuery('.road')	.height() - 50;
			var _thisLamp = '';
			var _roadEnd = jQuery(window)	.width();
			flag['gameInterval'] = setInterval(function () {
				(function () {
					var left = flag['hurdles']	.offset().left;
					var lampLeft = flag['lamp']	.offset().left;
					if ( left <= 0 ) {
						//hurdles	.each(function () {
							var randTop = parseInt ( Math.random() * road );
							flag['hurdles']	.css( { 'left': '', 'right': '0px', 'top': randTop + 'px' } );
						//});
						flag['reset'] = 0;
					}
					else {
						flag['hurdles']	.css( { 'left': left - 40 +'px' } );
						fn._checkCollision ( left - 40 );
					}
					
					flag['lamp']	.each(function () {
						_thisLamp = jQuery(this);
						if ( _thisLamp.offset().left <= 0 ) {
							_thisLamp	.css( {'left': _roadEnd + 400 + 'px' } );
						}
						else {
							flag['lamp']	.css( {'left': '-=5' + 'px' } );
						}
					});
				})();
			}, 50);
		},
		_moveCar: function () {
			var left = flag['car']	.left.offset().top;
			var right = flag['car']	.right.offset().top + flag['car']	.right.height();
			
			var moveDistance = 10;
			
			var roadTop = flag['road']	.offset().top;
			var roadBottom = roadTop + flag['road']	.height();
			
			randomizeDirection = parseInt ( Math.random() * 2 );
			if ( randomizeDirection == 0 ) {
				moveL();
			}
			else {
				moveR();
			}
			
			function moveR() {
				if ( right >= roadBottom ) {
					moveL();
					return;
				}
				flag['car']	.self.css('top', '+=' + moveDistance + 'px');
				return;
			}
			
			function moveL() {
				if ( left <= roadTop ) {
					moveR();
					return;
				}
				flag['car']	.self.css('top', '-=' + moveDistance + 'px');
				return;
			}
		},
		_checkCollision: function ( hurdleLeft ) {
			var carFront= flag['car']	.front.offset().left + flag['car']	.front.outerWidth();
			var carTopEdge = flag['car']	.self.offset().top;
			var carBottomEdge = carTopEdge + flag['car']	.self.height();
			
			var hurdleTopEdge = flag['hurdles']	.offset().top;
			var hurdleBottomEdge = hurdleTopEdge + flag['hurdles']	.height();
			if ( hurdleLeft <= carFront ) {
				if ( (hurdleTopEdge <= carTopEdge && hurdleBottomEdge >= carTopEdge) || (hurdleTopEdge <= carBottomEdge && hurdleBottomEdge >= carBottomEdge) )
					fn._moveCar();
			}
			if ( hurdleLeft <= flag['car'].self.offset().left + flag['car'].self.width() && flag['reset'] == 0 ) {
				if ( (hurdleTopEdge <= carTopEdge && hurdleBottomEdge >= carTopEdge) || (hurdleTopEdge <= carBottomEdge && hurdleBottomEdge >= carBottomEdge) ) {
					if ( flag['reset'] == 0 ) {
						++ flag['collision'];
						++ flag['reset'];
						console.log ( 'Boom' );
					}
				}
				else {
					// Not collided
					++ flag['reset'];
					++ flag['miss'];
				}
			}
			else {
				
			}
		},
		_stopGame: function () {
			clearInterval ( flag['gameInterval'] );
			console.log ( 'Number of accidents: ' + flag['collision'] + ', No. of misses: ' + flag['miss'] );
			fn._resetGame();
		},
		_resetGame: function () {
			flag['collision'] = 0;
			flag['miss'] = 0;
			flag['reset'] = 0;
			flag['hurdles']	.css( { 'left': '', 'right': '0px', 'top': 0 + 'px' } );
			flag['car']	.self.css( 'top', '50px' );
		}
	};
	api = {
		start: function () {
			return fn._init.apply(this, arguments);
		},
		stop: function () {
			return fn._stopGame.apply(this, arguments);
		}
	};
	return api;
})();
Car.race.start();