#!/usr/bin/env node

fs = require('fs');

var argv = require('optimist')
	.usage('Return the specified byte portion of a file.')
	.demand(['f'])
	.options('f', {alias: 'file', describe: 'file path'})
	.options('s', {alias: 'start', describe: 'start byte, inclusive','default': 1 })
	.options('e', {alias: 'end', describe: 'end byte (or rest of the file)', 'default': null })
	.options('l', {alias: 'length', describe: 'length / byte offset, how many to read (overrides -e)', 'default': null })
	.options('h', {alias: 'help', describe: 'Show this help screen'})
	.argv;

if(argv.h) {
	console.log(require('optimist').help());
	process.exit();
	}

//if a length/offset is specified, set the "end" to "start" + "length"
if(argv.l) {
	argv.e=argv.s-1+argv.l;
	}

//If "end" is specified, then it must be larger than "start"
if(argv.e && argv.e<argv.s) {
	console.error("End must be larger than start!");
	process.exit();
	}

var options = {
	flags: 'r'
	,encoding: null
	,start: argv.s-1 //Both start and end are inclusive and start at 0.
	};

//If there is an "end" argument given, then add it.
if(argv.e) options.end=argv.e-1;

var readStream=fs.createReadStream(argv.f, options);

readStream.pipe(process.stdout);