var interval = 100;
var inputRequest = 'Enter a string:';
var mainstring = '';
var running = false;
var started = false;
var timerId;
var waitForInput = false;
function run(code) {
    if (!running) {
        var lines = code.split('\n');
        mainstring = lines[lines.length - 1];
        var program_1 = [];
        lines.forEach(function (item, i) {
            program_1.push(item.split(' -> '));
        });
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
            }
        }
    });
    return edited;
}
