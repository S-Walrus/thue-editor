var terminal;

CodeMirror.defineMode("thue", function() {
	return {
		token: function(stream, state) {

			if (stream.match("->") ) {
				return "keyword";
			} else {
				stream.next();
				return "def";
			}
		}
	};
});

$(document).ready(function() {
	terminal = $('#terminal').terminal(function(command, term) {

	}, {
		greetings: "JQuery Terminal:\nCopyright (c) 2011-2018 Jakub Jankiewicz <http://jcubic.pl/me>"
	});

	var codemirror = CodeMirror.fromTextArea($("textarea").get(0), {
		theme: "duotone-dark",
		lineNumbers: true,
		mode: "thue"
	});
});
