var terminal;
var mainstring;
var codemirror;
var timerId;
var started = false;

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
	terminal = $('#terminal').terminal(function(command, term) {

	}, {
		greetings: "JQuery Terminal:\nCopyright (c) 2011-2018 Jakub Jankiewicz <http://jcubic.pl/me>"
	});

	codemirror = CodeMirror.fromTextArea($("textarea").get(0), {
		theme: "duotone-dark",
		lineNumbers: true,
		mode: "thue"
	});

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
			line = line.text.split(" -> ");
			if (line.length == 2) {
				var n = mainstring.search(line[0]);
				if (n >= 0) {
					var a = mainstring.substring(0 , n);
					var b = mainstring.substring(n + line[0].length);
					mainstring = a + line[1] + b;
					terminal.set_prompt('[[b;green;]' + mainstring + ']');
				}
			}
		})
	}, 100);
}

function pause() {
	clearInterval(timerId);
}

function stop() {
	pause();
	started = false;
}
