const interval: number = 100;

let mainstring: string = '';
let running: boolean = false;			// True if the timer is set to run program
let started: boolean = false;			// True if the program should be killed before running
let timerId: number;


// Start running the program
function run(code: string) : void {
	// Check if the program is not running
	if (!running) {

		// Parse the code
		let lines: Array<string> = code.split('\n');
		mainstring = lines[lines.length - 1];
		let program: Array<Array<string>> = [];
		lines.forEach((item: string, i: number) => {
			program.push(item.split(' -> '));
		});

		// Run the program
		timerId = setInterval(() => {

			let edited = passProgram(program);
			setPrompt(mainstring);

			if (!edited) {
				finish();
			}

		}, interval);
	} else {
		// TODO raise error
	}
}

// Stop running the program
function pause() : void {
	clearInterval(timerId);
	running = false;
}

// Reset all temporary parameters and finish running the program
function kill() : void {
	pause();
	mainstring = '';
	input = [];
	running = false;
	started = false;
}

// Finish running the program and print result
function finish() {
	echoGreen(mainstring);
	setDefaultPrompt();
	kill();
}


// Run every command in passed program
// Returns true, if something has been edited, false otherwise
function passProgram(program: Array<Array<string>>) : boolean {

	let edited: boolean = false;
	
	program.forEach((item: Array<string>, i: number, arr: Array<Array<string>>) => {
		if (item.length == 2) {
			let index = mainstring.search(item[0]);
			if (index != -1) {
				if (item[0] == '~') {
					// Get input
				} else if (item[0][0] == '~') {
					// Print
				} else {
					// Replace
					// mainstring == a + item[0] + b
					let a: string = mainstring.slice(0, index);
					let b: string = mainstring.slice(index + item[0].length);
					mainstring = a + item[1] + b;
				}
				// If a substring to replace has been found, set edited true
				edited = true;
			}
		}
	});

	return edited;
}