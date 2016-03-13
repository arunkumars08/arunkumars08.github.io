var Car = Car || {};

Car.race = (function () {
	var flag, fn, api, dynamic;
	flag = {
		'gameInterval': '',
		'gameArea': jQuery('#game_area'),
		'car': {
			'self': jQuery('.car'),
			'front': jQuery('.front'),
			'left': jQuery('.left'),
			'right': jQuery('.right')
		},
		'loops': 0,
		'road': jQuery('.road'),
		'lamp': jQuery('.lamp'),
		'hurdles': jQuery('.hurdles'),
		'startBtn': jQuery('.start'),
		'stopBtn': jQuery('.stop'),
		'collision': 0,
		'miss': 0,
		'reset': 0,
		'gameStatus': false,
		'pauseStatus': false,
		'nextUpgrade': 1,
		'baseUpgrade': 1
	};
	dynamic = {
		'baseCarPerformance': 10,
		'carPerformance': 10,
		'loopSpeed': 100,
		'baseLoopSpeed': 100
	};
	fn = {
		_init: function () {
			//fn._positionHurdles();
			//fn._handleEvents();
			//fn._startGame();
			jQuery(document)	.on ('keydown.carmanualnoremove', function (event){
				keyCode = event.keyCode;
				switch ( keyCode ) {
					case 32:
						//Space Bar
						fn._toggleGameModes();
						break;
					case 27:
						//Escape
						fn._pauseGame();
						break;
				}
			});
		},
		_removeEvents: function () {
			jQuery(document)	.off ('keydown.carmanual');
		},
		_handleEvents: function () {
			var keyCode = '';
			
			jQuery(document)	.on ('keydown.carmanual', function (event){
				keyCode = event.keyCode;
				switch ( keyCode ) {
					case 32:
						//Space Bar
						fn._toggleGameModes();
						break;
					case 37:
						//Left Arrow
						break;
					case 38:
						//Up Arrow
						fn._moveUp();
						break;
					case 39:
						//Right Arrow
						break;
					case 40:
						//Down Arrow
						fn._moveDown();
						break;
				}
			});
			flag['startBtn']	.on('click.car', function (event) {
				fn._startGame();
			});
			flag['stopBtn']	.on('click.car', function (event) {
				fn._stopGame();
			});
		},
		_showCollision: function ( dir ) {
			flag['road']	.addClass('collided-class');
			fn._pauseGame();
		},
		_moveUp: function () {
			var left = flag['car']	.left.offset().top;
			var moveDistance = dynamic['carPerformance'];
			
			var roadTop = flag['road']	.offset().top;
			if ( left <= roadTop ) {
				fn._showCollision( 'left' );
				return;
			}
			flag['car']	.self.css('top', '-=' + moveDistance + 'px');
			return;
		},
		_moveDown: function () {
			var right = flag['car']	.right.offset().top + flag['car']	.right.height();
			var moveDistance = 10;
			var roadTop = flag['road']	.offset().top;
			var roadBottom = roadTop + flag['road']	.height();
			if ( right >= roadBottom ) {
				fn._showCollision( 'right' );
				return;
			}
			flag['car']	.self.css('top', '+=' + moveDistance + 'px');
			return;
		},
		_positionHurdles: function () {
			var road = flag['road']	.height() - 50;
			flag['hurdles']	.each(function () {
				var randTop = parseInt ( Math.random() * road );
				jQuery(this)	.css( { 'left': '', 'right': '0px', 'top': randTop + 'px' } );
			});
		},
		_toggleGameModes: function () {
			if ( flag['gameStatus'] ) {
				fn._stopGame();
			}
			else {
				fn._startGame();
			}
		},
		_interval: function () {
			if ( flag['pauseStatus'] ) {
				return;
			}
			if ( flag['loops'] >= flag['nextUpgrade'] ) {
				fn._upgradeGame( parseInt(flag['loops'] / flag['baseUpgrade'] ) );
				return;
			}
			var road = jQuery('.road')	.height() - 50;
			var _thisLamp = '';
			var _roadEnd = jQuery(window)	.width();
			(function () {
				var left = flag['hurdles']	.offset().left;
				var lampLeft = flag['lamp']	.offset().left;
				if ( left <= 0 ) {
					//hurdles	.each(function () {
						var randTop = parseInt ( Math.random() * road );
						flag['hurdles']	.css( { 'left': '', 'right': '0px', 'top': randTop + 'px' } );
					//});
					flag['reset'] = 0;
					++ flag['loops'];
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
		},
		_startGame: function () {
			fn._handleEvents();
			flag['gameStatus'] = true;
			flag['gameInterval'] = setInterval( fn._interval, dynamic['loopSpeed'] );
		},
		_showUpgradeMsg: function ( msg ) {
			jQuery('.msg')	.remove();
			jQuery('<p class="msg">' + msg + '</p>' )	.appendTo ( '.grass:first' );
			setTimeout (function () {
				jQuery('.msg')	.remove();
			}, 3000);
		},
		_upgradeGame: function ( level ) {
			clearInterval( flag['gameInterval'] );
			dynamic['loopSpeed'] = dynamic['baseLoopSpeed'] - level * 20;
			dynamic['carPerformance'] = dynamic['baseCarPerformance'] * 2 * level;
			flag['gameInterval'] = setInterval( fn._interval, dynamic['loopSpeed'] );
			flag['nextUpgrade'] += 1;
			fn._showUpgradeMsg ( 'You have been upgraded! to level: ' + level + ', you\'re car performance has been upgraded to: ' + dynamic['carPerformance'] );
		},
		_checkCollision: function ( hurdleLeft ) {
			var carFront= flag['car']	.front.offset().left + flag['car']	.front.outerWidth();
			var carTopEdge = flag['car']	.self.offset().top;
			var carBottomEdge = carTopEdge + flag['car']	.self.height();
			
			var hurdleTopEdge = flag['hurdles']	.offset().top;
			var hurdleBottomEdge = hurdleTopEdge + flag['hurdles']	.height();
			if ( hurdleLeft <= flag['car'].self.offset().left + flag['car'].self.width() && flag['reset'] == 0 ) {
				if ( (hurdleTopEdge <= carTopEdge && hurdleBottomEdge >= carTopEdge) || (hurdleTopEdge <= carBottomEdge && hurdleBottomEdge >= carBottomEdge) ) {
					if ( flag['reset'] == 0 ) {
						fn._showCollision( 'front' );
						++ flag['collision'];
						++ flag['reset'];
						console.log ( 'Boom' );
						return;
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
		_pauseGame: function () {
			if ( !flag['pauseStatus'] ) {
				fn._removeEvents();
				flag['pauseStatus'] = true;
			}
			else {
				fn._handleEvents();
				flag['pauseStatus'] = false;
			}
		},
		_resumeGame: function () {
			flag['gameInterval'] = setInterval( fn._interval, 50 );
		},
		_stopGame: function () {
			console.log ( 'Number of accidents: ' + flag['collision'] + ', No. of misses: ' + flag['miss'] );
			fn._resetGame();
		},
		_resetGame: function () {
			flag['gameStatus'] = false;
			flag['loops'] = 0;
			clearInterval ( flag['gameInterval'] );
			fn._removeEvents();
			flag['pauseStatus'] = false;
			flag['road']	.removeClass('collided-class');
			flag['collision'] = 0;
			flag['miss'] = 0;
			flag['reset'] = 0;
			flag['hurdles']	.css( { 'left': '', 'right': '0px', 'top': 0 + 'px' } );
			flag['car']	.self.css( 'top', '50px' );
			dynamic = {
				'baseCarPerformance': 10,
				'carPerformance': 10,
				'loopSpeed': 100,
				'baseLoopSpeed': 100
			};
			flag['nextUpgrade'] = flag['baseUpgrade'];
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