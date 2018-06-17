function check(code, inputList, outputList) {
    kill();
    var lines = code.split('\n');
    var program = [];
    lines.slice(0, -1).forEach(function (item, i) {
        program.push(item.split(' -> '));
    });
    var mainstring = lines[lines.length - 1];
    for (var i = 0; i < outputList.length; i++) {
        var result = runTest(program, mainstring, inputList[i]);
        if (result == outputList[i]) {
            echoGreen('Test ' + (i + 1) + ' completed');
        }
        else {
            error('Wrong answer at test ' + (i + 1));
            return false;
        }
    }
    echoGreen('All tests completed!');
    return true;
}
function runTest(program, mainstring, input) {
    var edited = true;
    var mainstringSave;
    while (edited) {
        mainstringSave = mainstring;
        program.forEach(function (command, i) {
            if (command.length == 2) {
                var index = mainstring.indexOf(command[0]);
                if (index != -1) {
                    var a = mainstring.slice(0, index);
                    var b = mainstring.slice(index + command[0].length);
                    if (command[1] == '~') {
                        if (input.length != 0) {
                            mainstring = a + input.pop() + b;
                        }
                    }
                    else if (command[1][0] == '~') {
                        mainstring = a + b;
                    }
                    else {
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
var interval = 100;
var inputRequest = 'Enter a string:';
var mainstring = '';
var running = false;
var started = false;
var timerId;
var waitForInput = false;
var iterCount;
function run(code) {
    if (!running) {
        var lines = code.split('\n');
        var program_1 = [];
        lines.slice(0, -1).forEach(function (item, i) {
            program_1.push(item.split(' -> '));
        });
        if (!started) {
            mainstring = lines[lines.length - 1];
            iterCount = 0;
        }
        started = true;
        timerId = setInterval(function () {
            if (!waitForInput || input.length != 0) {
                setPrompt(mainstring);
                waitForInput = false;
                var edited = passProgram(program_1);
                if (!edited) {
                    finish();
                }
            }
        }, interval);
    }
    else {
        error("Program has been started");
    }
}
function pause() {
    clearInterval(timerId);
    running = false;
}
function kill() {
    pause();
    mainstring = '';
    input = [];
    running = false;
    started = false;
}
function finish() {
    echoGreen(mainstring);
    echo('Program completed in ' + iterCount + ' iterations.');
    setDefaultPrompt();
    kill();
}
function passProgram(program) {
    var edited = false;
    program.forEach(function (item, i, arr) {
        if (waitForInput) {
            return null;
        }
        if (item.length == 2) {
            var index = mainstring.indexOf(item[0]);
            if (index != -1) {
                var a = mainstring.slice(0, index);
                var b = mainstring.slice(index + item[0].length);
                if (item[1] == '~') {
                    if (input.length != 0) {
                        mainstring = a + input.pop() + b;
                    }
                    else {
                        waitForInput = true;
                        echo(mainstring);
                        echo(inputRequest);
                        setDefaultPrompt();
                    }
                }
                else if (item[1][0] == '~') {
                    echoGreen(item[1].slice(1));
                    mainstring = a + b;
                }
                else {
                    mainstring = a + item[1] + b;
                }
                edited = true;
                iterCount++;
            }
        }
    });
    return edited;
}
