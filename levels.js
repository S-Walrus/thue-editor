let levels;

// Download a levels data
// The file is downloaded from GitHub because it throws an error when the file is downloaded from local server
$.getJSON("https://raw.githubusercontent.com/S-Walrus/thue-editor/master/levels.json", function(data) {
	levels = data;
	console.log(data);
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
		terminal.echo(levels[selectedLevel.attr('level')].description);
	});
});


// Returns true if the test is completed, false otherwise
function runTest(input, output, test_num) {
	let code = codemirror.getValue().split('\n');
	let mainstring = code.pop();
	let edited = true;

	while (edited) {
		edited = false;
		$.each(code, function(index, com) {
			com = com.split(' -> ');
			if (com.length > 1) {
				let n = mainstring.search(com[0]);
				if (n >= 0) {
					let a = mainstring.substring(0, n);
					let b = mainstring.substring(n + com[0].length);

					if (com[1] == '~') {
						mainstring = a + input + b;
						input = '';
					} else if (com[1][0] == '~') {
						mainstring = a + b;
					} else {
						mainstring = a + text[1] + b;
					}

					edited = true;
				}
			}
		});
	}
	if (mainstring == output) {
		terminal.echo('[[b;green;]Test ' + test_num + ' is completed]');
		return true;
	} else {
		terminal.error('Answer for test ' + test_num + ' is incorrect');
		return false;
	}
}


function check() {
	terminal.set_prompt(defaultPrompt);
	terminal.echo(' ');
	if (selectedLevel != undefined) {
		let input_list = levels[selectedLevel.attr("level")].input;
		let output_list = levels[selectedLevel.attr("level")].output;
		for (let i = 0; i < input_list.length; i++) {
			let result = runTest(input_list[i], output_list[i], i+1);
			if (!result) {
				break;
			}
		}
	} else {
		terminal.error('Select a level to run tests');
	}
}