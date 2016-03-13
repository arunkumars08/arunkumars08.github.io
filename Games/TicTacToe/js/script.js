var App = App || {};
App.intelligence = (function (window, ns) {
	var fn, api;
	fn = {
		_init: function () {
			jQuery ( '<div />' )	.addClass ( 'intelligence-bar hide-me' )
									.appendTo ( 'body' );
			
			jQuery ( '<div />' )	.addClass ( 'message' )
									.appendTo ( '.intelligence-bar' );
		},
		_setStorage: function ( key, value ) {
			if ( window.localStorage !== undefined ) {
				window.localStorage.setItem( key, JSON.stringify(value) );
			}
			else {
				document.cookie = key + '=' + JSON.stringify(value);
			}
		},
		_getStorage: function ( key ) {
			var names = null;
			if ( window.localStorage !== undefined ) {
				names = window.localStorage.getItem( key );
				if ( names != null ) {
					return JSON.parse( names );
				}
			}
			else {
				names = document.cookie.split(key + '=')[1].split(';')[0];
				if ( names != null ) {
					return JSON.parse( names );
				}
			}
			return names;
		},
		_postMessage: function () {
			if ( jQuery('.intelligence-bar').length === 0 ) fn._init();
			if ( arguments !== undefined ) {
				var message = arguments[0];
				jQuery ( '.message' )	.html ( message );
				jQuery('.intelligence-bar')	.removeClass ( 'hide-me' );
			}
		},
		_prompt: function () {
			var message = '<input type="text" placeholder="Player 1" value="" id="prompt_p1" /><input type="text" placeholder="Player 2" value="" id="prompt_p2" /><button id="prompt_save">Save</button>';
			fn._postMessage( message );
			jQuery ( '.intelligence-bar' )	.on ( 'click.intel', function ( event ) {
				if ( jQuery(event.target)	.attr('id') === 'prompt_save' ) {
					var names = {};
					names['player1'] = jQuery ( '#prompt_p1' )	.val();
					names['player2'] = jQuery ( '#prompt_p2' )	.val();
					fn._setStorage ( 'players', names );
					jQuery('.intelligence-bar')	.addClass ( 'hide-me' );
					App.tictactoe.playerInfo( names['player1'], names['player2'] );
				}
			});
		}
	};
	api = {
		ping: function () {
			return fn._postMessage.apply(this, arguments);
		},
		prompt: function () {
			return fn._prompt.apply(this, arguments);
		},
		getStorage: function () {
			return fn._getStorage.apply(this, arguments);
		},
		setStorage: function () {
			return fn._setStorage.apply(this, arguments);
		}
	};
	return api;
})(window, App);
App.tictactoe = (function (window, ns) {
	var fn, api, match, dom, flag;
	flag = {
		'STORAGE_KEY': 'players'
	};
	match = {
		'player1': {
			'name': 'Player 1',
			'score': 0,
			'marker': 'X',
			'color': 'RED'
		},
		'player2': {
			'name': 'Player 2',
			'score': 0,
			'marker': 'O',
			'color': 'GREEN'
		},
		'turns': 1,
		'filled': 0
	};
	fn = {
		_init: function () {
			fn._loadInterface( arguments );
			fn._eventHandlings ();
			fn._intelligence();
		},
		_intelligence: function () {
			var names = App.intelligence.getStorage ( flag['STORAGE_KEY'] );
			if ( names !== null ) {
				App.intelligence.ping ( 'Welcome back! ' +  names.player1 + ', ' + names.player2 );
			}
			else {
				App.intelligence.prompt();
			}
		},
		
		_eventHandlings: function () {
			var player = '';
			jQuery ( '.game_arena' )	.on ( 'click.game', function ( event ) {
				$_this = jQuery ( event.target );
				if ( $_this.hasClass ( 'tile' ) ) {
					if ( $_this.text() === '' ) {
						player = match['player' + match['turns']];
						$_this.html ( '<span style="color: ' + player.color + ';">' + player.marker + '</span>' );
						fn._gameStatus( $_this.attr('id') );
					}
				}
			});
		},
		_toggleTurn: function () {
			if ( match['turns'] === 1 ) match['turns'] = 2;
			else match['turns'] = 1;
		},
		_gameStatus: function ( id ) {
			id = parseInt (id, 0);
			match['filled'] += 1;
			var arr = [];
			switch ( id ) {
				case 1:
					arr[0] = [];
					arr[0].push(1);
					arr[0].push(2);
					arr[0].push(3);
					
					arr[1] = [];
					arr[1].push(1);
					arr[1].push(4);
					arr[1].push(7);
					
					arr[2] = [];
					arr[2].push(1);
					arr[2].push(5);
					arr[2].push(9);
					break;
				case 2:
					arr[0] = [];
					arr[0].push(1);
					arr[0].push(2);
					arr[0].push(3);
					
					arr[1] = [];
					arr[1].push(2);
					arr[1].push(5);
					arr[1].push(8);
					break;
				case 3:
					arr[0] = [];
					arr[0].push(1);
					arr[0].push(2);
					arr[0].push(3);
					
					arr[1] = [];
					arr[1].push(3);
					arr[1].push(5);
					arr[1].push(7);
					
					arr[2] = [];
					arr[2].push(3);
					arr[2].push(6);
					arr[2].push(9);
					break;
				case 4:
					arr[0] = [];
					arr[0].push(4);
					arr[0].push(5);
					arr[0].push(6);
					
					arr[1] = [];
					arr[1].push(1);
					arr[1].push(4);
					arr[1].push(7);
					break;
				case 5:
					arr[0] = [];
					arr[0].push(1);
					arr[0].push(5);
					arr[0].push(9);
					
					arr[1] = [];
					arr[1].push(2);
					arr[1].push(5);
					arr[1].push(8);
					
					arr[2] = [];
					arr[2].push(3);
					arr[2].push(5);
					arr[2].push(7);
					
					arr[3] = [];
					arr[3].push(4);
					arr[3].push(5);
					arr[3].push(6);
					break;
				case 6:
					arr[0] = [];
					arr[0].push(3);
					arr[0].push(6);
					arr[0].push(9);
					
					arr[1] = [];
					arr[1].push(4);
					arr[1].push(5);
					arr[1].push(6);
					break;
				case 7:
					arr[0] = [];
					arr[0].push(1);
					arr[0].push(2);
					arr[0].push(3);
					
					arr[1] = [];
					arr[1].push(3);
					arr[1].push(5);
					arr[1].push(7);
					
					arr[2] = [];
					arr[2].push(7);
					arr[2].push(8);
					arr[2].push(9);
					break;
				case 8:
					arr[0] = [];
					arr[0].push(2);
					arr[0].push(5);
					arr[0].push(8);
					
					arr[1] = [];
					arr[1].push(7);
					arr[1].push(8);
					arr[1].push(9);
					break;
				case 9:
					arr[0] = [];
					arr[0].push(1);
					arr[0].push(5);
					arr[0].push(3);
					
					arr[1] = [];
					arr[1].push(3);
					arr[1].push(6);
					arr[1].push(9);
					
					arr[2] = [];
					arr[2].push(7);
					arr[2].push(8);
					arr[2].push(9);
					break;
			}
			var flag = 0;
			for ( var i = 0; i < arr.length; ++ i ) {
				if ( jQuery('#' + arr[i][0]).text() !== '' && jQuery('#' + arr[i][0]).text() === jQuery('#' + arr[i][1]).text() && jQuery('#' + arr[i][0]).text() === jQuery('#' + arr[i][2]).text() ) {
					flag = 0;
					break;
				}
				else {
					flag = 1;
				}
			}
			if ( flag === 0 ) {
				fn._endGame ( match['turns'] );
			}
			else {
				fn._toggleTurn();
				fn._continueGame();
			}
		},
		_continueGame: function () {
			if ( match['filled'] == 9 ) fn._endGame ( null );
			else fn._game();
		},
		_loadInterface: function () {
			var matrix = 9;
			for ( var i = 0; i < matrix; ++ i ) {
				(function (i) {
					jQuery ( '<div id="' + (i + 1) + '"class="tile"></div>' )	.appendTo ( '.game_arena' );
					if ( i === matrix - 1 ) {
						fn._startGame();
					}
				})(i);
			}
		},
		_postMessage: function ( message ) {
			jQuery ( '#message_area' )	.text ( message );
		},
		_resetGame: function () {
			jQuery('.tile')	.html( '' );
			match['turns'] = 1;
			match['filled'] = 0;
		},
		_game: function () {
			jQuery ( '#message_area' )	.text ( 'It is ' + match['player' + match['turns']].name + '\'s turn now' );
		},
		_startGame: function () {
			fn._game();
		},
		_endGame: function ( no ) {
			if ( no === null ) fn._postMessage ( 'Game Drawn' );
			else {
				match['player' + no].score += 1;
				fn._postMessage ( 'Game Won by ' + match['player' + no].name );
				fn._score();
			}
			fn._resetGame();
		},
		_freezeMatch: function () {
			jQuery ( '<div />' )	.addClass ( 'freeze-game' )
									.appendTo ( 'body' )
									.text ( 'Game Frozen' );
			
		},
		_score: function () {
			jQuery ( '#score_board' )	.find ( '.player1' )
										.find ( '.points' )
										.text ( match['player1'].score );
			jQuery ( '#score_board' )	.find ( '.player2' )
										.find ( '.points' )
										.text ( match['player2'].score );
			
			if ( match['player1'].score >= 5 ) {
				fn._postMessage ( 'Congratulations ' + match['player1'].name );
				fn._freezeMatch ();
			}
			else if ( match['player2'].score >= 5 ) {
				fn._postMessage ( 'Congratulations ' + match['player2'].name );
				fn._freezeMatch ();
			}
		},
		_resetPlayerInfo: function () {
			jQuery('.player1')	.find('h4')
								.text(match['player1'].name);
			jQuery('.player2')	.find('h4')
								.text(match['player2'].name);
			fn._startGame();
		},
		_playerInfo: function () {
			match['player1'].name = arguments[0];
			match['player2'].name = arguments[1];
			fn._resetPlayerInfo();
		}
	};
	api = {
		init: function () {
			return fn._init.apply(this, arguments);
		},
		playerInfo: function () {
			return fn._playerInfo.apply(this, arguments);
		}
	};
	return api;
})(window, App);
App.tictactoe.init();