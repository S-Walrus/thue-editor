var terminal;
var mainstring;
var codemirror;
var timerId;
var started = false;
var input = [];
var defaultPrompt;
var waitLine = null;
var selectedLevel;

CodeMirror.defineMode("thue", function() {
	return {
		token: function(stream, state) {

			if (stream.match("->") ) {
				return "keyword";
			} else {
				stream.next();
				return "def";
			}
		}
	};
});

$(document).ready(function() {
	// Init the terminal
	terminal = $('#terminal').terminal(function(command, term) {
		input.push(command);
	}, {
		greetings: "JQuery Terminal:\nCopyright (c) 2011-2018 Jakub Jankiewicz <http://jcubic.pl/me>"
	});

	defaultPrompt = terminal.get_prompt();

	// Init the editor
	codemirror = CodeMirror.fromTextArea($("textarea").get(0), {
		theme: "duotone-dark",
		lineNumbers: true,
		mode: "thue"
	});

	// Levels
	$('.level').on('click', function() {
		// Remove last selected level style
		if (selectedLevel != null) {
			selectedLevel.css('box-shadow', 'none');
			var html = selectedLevel.html();
			selectedLevel.html(html.slice(0, html.search('<')));
		}
		// Set new selected level
		selectedLevel = $(this);
		selectedLevel.css('box-shadow', 'inset 5px 0 0 0 #D7443F');
		selectedLevel.html(selectedLevel.html() + '<div class="level-button" id="run-tests"><i class="fa fa-play"></i></div>');
		// TODO описывать тест в консоли
	});

	// Buttons
	$('#run').on('click', function() {
		run();
	});

	$('#pause').on('click', function() {
		pause();
	});

	$('#stop').on('click', function() {
		stop();
	});

	$('#info').on('click', function() {
		// TODO info page
	});
});

function run() {
	// Get mainstring
	if (!started) {
		started = true;
		mainstring = codemirror.getLine(codemirror.lastLine());
	}
	// Set timer
	timerId = setInterval (function() {
		var edited = false;
		// Go throught each line of code
		codemirror.eachLine(codemirror.firstLine(), codemirror.lastLine(), function(line) {
			// If line.text == "", line.text.split.length doesn't exist
			if (line.text == "") {
				return 0;
			}

			text = line.text.split(" -> ");
			if (text.length == 2) {
				// Index of the first entry
				var n = mainstring.search(text[0]);
				if (n >= 0) {
					var a = mainstring.substring(0, n);
					var b = mainstring.substring(n + text[0].length);
					if (text[1] == '~') {
						// Get input
						if (input.length == 0) {
							if (waitLine === null) {
								terminal.echo(mainstring);
							}
							waitLine = codemirror.getLineNumber(line);
							terminal.set_prompt(defaultPrompt);
						} else {
							mainstring = a + input.pop() + b;
							waitLine = null;
						}
					} else if (text[1][0] == '~') {
						// Output
						terminal.echo('[[b;green;]' + text[1].slice(1) + ']');
						mainstring = a + b;
					} else {
						// Replace
						mainstring = a + text[1] + b;
					}
					if (waitLine === null) {
						terminal.set_prompt('[[b;green;]' + mainstring + ']');
					}
				}
			}
		});
		if (!edited) {
			stop();
		}
	}, 100);
}

function pause() {
	clearInterval(timerId);
}

function stop() {
	pause();
	started = false;
}
