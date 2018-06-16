let terminal;
let codemirror;
let input = [];
let defaultPrompt;
let selectedLevel;

CodeMirror.defineMode("thue", function() {
	return {
		token: function(stream, state) {

			if (stream.match(" -> ")) {
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
		run(codemirror.getValue());
	});

	$('#pause').on('click', function() {
		pause();
	});

	$('#stop').on('click', function() {
		finish();
	});

	$('#check').on('click', function() {
		check();
	});
});


// Functions for thue.ts
function setPrompt(text) {
	terminal.set_prompt('[[b;green;]' + text + ']');
}

function setDefaultPrompt() {
	terminal.set_prompt(defaultPrompt);
}

function echo(text) {
	terminal.echo(text);
}

function echoGreen(text) {
	terminal.echo('[[b;green;]' + text + ']');
}

function error(text) {
	reminal.error(text);
}