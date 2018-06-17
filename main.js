let terminal;
let codemirror;
let input = [];
let defaultPrompt;
let selectedLevel;
let problems;

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
	// Download tests' data
	// The file is downloaded from GitHub because it throws an error when the file is downloaded from local server
	$.getJSON("https://raw.githubusercontent.com/S-Walrus/thue-editor/master/levels.json", function(data) {
		problems = data;
		// Generate HTML for level box
		for (let i = 0; i < data.length; i++) {
			$('#level-box').append('<div class="level" level=' + i + '>' + data[i].title + '</div>');
		};

		// On click
		$('.level').on('click', function() {
			// Remove last selected level style
			if (selectedLevel != null) {
				selectedLevel.css('box-shadow', 'none');
				let html = selectedLevel.html();
			}
			// Set new selected level
			selectedLevel = $(this);
			selectedLevel.css('box-shadow', 'inset 5px 0 0 0 #D7443F');
			terminal.echo(' ');
			terminal.echo('[[b;green;]' + selectedLevel.html() + ']');
			terminal.echo(problems[selectedLevel.attr('level')].description);
		});
	});

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
		if (selectedLevel != undefined) {
			let inputList = problems[selectedLevel.attr("level")].input;
			let outputList = problems[selectedLevel.attr("level")].output;
			check(codemirror.getValue(), inputList, outputList);
		} else {
			terminal.error('Select a level to run tests');
		}
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
	terminal.error(text);
}