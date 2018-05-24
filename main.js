var terminal;
var mainstring;
var codemirror;
var timerId;
var started = false;
var input = [];
var defaultPrompt;
var waitLine = null;

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
});

function run() {
	if (!started) {
		started = true;
		mainstring = codemirror.getLine(codemirror.lastLine());
	}
	timerId = setInterval (function() {
		codemirror.eachLine(codemirror.firstLine(), codemirror.lastLine(), function(line) {
			if (line.text == "") {
				return 0;
			}
			text = line.text.split(" -> ");
			if (text.length == 2) {
				var n = mainstring.search(text[0]);
				if (n >= 0) {
					var a = mainstring.substring(0 , n);
					var b = mainstring.substring(n + text[0].length);
					if (text[1] == '~') {
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
						terminal.echo('[[b;green;]' + text[1].slice(1) + ']');
						mainstring = a + b;
					} else {
						mainstring = a + text[1] + b;
					}
					if (waitLine === null) {
						terminal.set_prompt('[[b;green;]' + mainstring + ']');
					}
				}
			}
		});
	}, 100);
}

function pause() {
	clearInterval(timerId);
}

function stop() {
	pause();
	started = false;
}
