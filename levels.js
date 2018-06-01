var levels;

// Download a levels data
// The file is downloaded from GitHub because it throws an error when the file is downloaded from local server
$.getJSON("https://raw.githubusercontent.com/S-Walrus/thue-editor/master/levels.json", function(data) {
  levels = data;
});


// Returns true if the test is completed, false otherwise
function runTest(input, output, test_num) {
	var code = codemirror.getValue().split('\n');
	var mainstring = code.pop();
	var edited = true;

	while (edited) {
		edited = false;
		$.each(code, function(index, com) {
			com = com.split(' -> ');
			if (com.length > 1) {
				var n = mainstring.search(com[0]);
				if (n >= 0) {
					var a = mainstring.substring(0, n);
					var b = mainstring.substring(n + com[0].length);

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
		var input_list = levels[selectedLevel.attr("level")].input;
		var output_list = levels[selectedLevel.attr("level")].output;
		for (var i = 0; i < input_list.length; i++) {
			var result = runTest(input_list[i], output_list[i], i+1);
			if (!result) {
				break;
			}
		}
	} else {
		terminal.error('Select a level to run tests');
	}
}