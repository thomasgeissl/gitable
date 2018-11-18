const vorpal = require("vorpal")();
const gunzipFile = require("gunzip-file");
const fs = require("fs");

const file = process.argv[2];
fs.watch(file, (event, filename) => {
	if (filename) {
		console.log(
			`${filename} file Changed`,
			filename.split(".")[0] + ".xml",
			event
		);
		// gunzipFile(filename, filename.split('.')[0] + '.xml')
		gunzipFile(
			'/Users/thomasgeissl/Music/klanglichtstrom\ Project/klanglichtstrom.als',
			"/Users/thomasgeissl/Desktop/klanglichtstrom.xml",
			() => {
				console.log('gunzip done!')
			}
		);
	}
});

vorpal.command("foo", 'Outputs "bar".').action(function (args, callback) {
	this.log("bar");
	callback();
});

vorpal.delimiter("gitable").show();