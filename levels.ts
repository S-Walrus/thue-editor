// Start running tests
// Returns true if all tests competed, false oterwise
// code - full text of program
function check(code: string, inputList: Array<Array<string>>, outputList: Array<string>) : boolean {
	// Stop other processes
	kill();

	// Parse the code
	let lines: Array<string> = code.split('\n');
	let program: Array<Array<string>> = [];
	lines.slice(0, -1).forEach((item: string, i: number) => {
		program.push(item.split(' -> '));
	});
	let mainstring: string = lines[lines.length - 1];

	// Run tests in order
	for (let i = 0; i < outputList.length; i++) {
		// Run test and get output
		let result: string = runTest(program, mainstring, inputList[i]);
		
		if (result == outputList[i]) {
			echoGreen('Test ' + (i+1) + ' completed');
		} else {
			error('Wrong answer at test ' + (i+1));
			return false;
		}
	}

	echoGreen('All tests completed!');
	return true;
}


// Runs program and returns final mainstring
function runTest(program: Array<Array<string>>, mainstring: string, input: Array<string>) : string {
	let edited: boolean = true;
	let mainstringSave: string;

	while (edited) {
		mainstringSave = mainstring;

		program.forEach((command: Array<string>, i: number) => {
			if (command.length == 2) {
				let index: number = mainstring.indexOf(command[0]);
				if (index != -1) {
					let a: string = mainstring.slice(0, index);
					let b: string = mainstring.slice(index + command[0].length);

					if (command[1] == '~') {
						if (input.length != 0) {
							mainstring = a + input.pop() + b;
						}
					} else if (command[1][0] == '~') {
						mainstring = a + b;
					} else {
						mainstring = a + command[1] + b;
					}
				}
			}
		});

		if (mainstring == mainstringSave) {
			edited = false;
		}
	}

	return mainstring;
}