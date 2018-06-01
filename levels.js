var levels;

// Download a levels data
// The file is downloaded from GitHub because it throws an error when the file is downloaded from local server
$.getJSON("https://raw.githubusercontent.com/S-Walrus/thue-editor/master/levels.json", function(data) {
  levels = data;
});


function runTest(input, output) {
	// TODO
}


function check() {
	terminal.set_prompt(defaultPrompt);
	if (selectedLevel != undefined) {
		var input_list = levels[selectedLevel.attr("level")].input;
		var output_list = levels[selectedLevel.attr("level")].output;
		for (var i = 0; i < input_list; i++) {
			runTest(input_list[i], output_list[i]);
		}
	} else {
		// TODO error
	}
}