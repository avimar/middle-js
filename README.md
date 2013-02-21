MIDDLE lets you specify a start and end byte point in a file to extract.

##Install
`npm install middle-js -g`

##Sample use
To extract bytes 3000->4500 of file myfile.txt:

`middle -f myfile.txt -s 3000 -e 4500 > newfile.txt`

##Flags:
* -f, --file: file path
* -s, --start: starts bytes, defaults to start of file.
* -e, --end: end byte, defaults to entire file.
* -l, --length: offset from start. If specified, overrides -e.
* -h, --help: this help.


*If only -f is required, and will act like "CAT".
*If only -f and --end are specified, it will act like "HEAD".
*If only -f and --start are specified, it will act like "TAIL", but counting from the start.

##POSSIBLE ISSUES:
The byte offsets might be off by one or two, I couldn't quite put my finger on how it was supposed to work.
* --start is the real-number byte it should start with (the first byte is not 0)
* --end is the last byte it should include



[There apparently doesn't exist a program that does this.
HEAD will let you specify a start offset (in bytes or lines)...
TAIL lets you specify an end offset (in bytes or lines)...
but both otherwise read the entire file. If we know the exact bytes we want, that can be quite wasteful for large files.
DD lets you do this, but requires setting a blocksize of 1, which makes it run extremely slowly.
This should probably be written in C...]