const interval: number = 100;
const inputRequest: string = 'Enter a string:';

let mainstring: string = '';
let running: boolean = false;			// True if the timer is set to run program
let started: boolean = false;			// True if the program should be killed before running
let timerId: number;
let waitForInput: boolean = false;
let iterCount: number;


// Start running the program
function run(code: string) : void {
	// Check if the program is not running
	if (!running) {

		// Parse the code
		let lines: Array<string> = code.split('\n');
		let program: Array<Array<string>> = [];
		lines.slice(0, -1).forEach((item: string, i: number) => {
			program.push(item.split(' -> '));
		});

		// If we are not continuing the program,
		if (!started) {
			// Read mainstring
			mainstring = lines[lines.length - 1];
			// Reset the iteration counter
			iterCount = 0;
		}
		
		started = true;

		// Run the program
		timerId = setInterval(() => {

			// Pass program if we aren't waiting for input
			if (!waitForInput || input.length != 0) {
				setPrompt(mainstring);
				waitForInput = false;

				let edited = passProgram(program);

				if (!edited) {
					finish();
				} else {
					iterCount++;
				}
			}

		}, interval);
	} else {
		error("Program has been started");
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
	echo('Program completed in ' + iterCount + ' iterations.');
	setDefaultPrompt();
	kill();
}


// Run every command in passed program
// Returns true, if something has been edited, false otherwise
function passProgram(program: Array<Array<string>>) : boolean {

	let edited: boolean = false;
	
	program.forEach((item: Array<string>, i: number, arr: Array<Array<string>>) => {
		if (waitForInput) {
			return null;
		}

		if (item.length == 2) {
			let index = mainstring.indexOf(item[0]);
			if (index != -1) {

				// mainstring == a + item[0] + b
				let a: string = mainstring.slice(0, index);
				let b: string = mainstring.slice(index + item[0].length);

				if (item[1] == '~') {
					// Get input
					if (input.length != 0) {
						// If input is not empty, get a string
						mainstring = a + input.pop() + b;
					} else {
						// Else start waiting for input
						waitForInput = true;
						echo(mainstring);
						echo(inputRequest);
						setDefaultPrompt();
					}
				} else if (item[1][0] == '~') {
					// Print
					echoGreen(item[1].slice(1));
					mainstring = a + b;
				} else {
					// Replace
					mainstring = a + item[1] + b;
				}
				// If a substring to replace has been found, set edited true
				edited = true;
			}
		}
	});

	return edited;
}