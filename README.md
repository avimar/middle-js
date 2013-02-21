MIDDLE lets you specify a start and end byte point in a file to extract.

#Status
Status: Unnecessary.

In the process of benchmarking this, I realized (oops!) that if you `cat $file | head -n 2` the cat quits once the head has satisfied its count.

Merely do: `tail -c +$START $file | head -c $LENGTH > $new_file`


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

##Possible Issue:
The byte offsets might be off by one or two, I couldn't quite put my finger on how it was supposed to work.
* --start is the real-number byte it should start with (the first byte is not 0)
* --end is the last byte it should include

#Benchmark:
`ls -l large_file.avi`
-rwxrwxrwx 1 avi avi 262008832 2009-06-01 03:05 large_file

Clear cache, MAY BE UNSAFE:
`sync ; echo 3 | sudo tee /proc/sys/vm/drop_caches`

##middle.js
`time middle -f large_file -s 220000000 -l 10000000 > newfile`
real	0m0.301s
user	0m0.040s
sys	0m0.052s

## DD
`time dd bs=1 if=large_file skip=220000000 count=10000000 of=newfile2`
real	0m9.665s
user	0m0.680s
sys	0m8.945s
(same results using `of=newfile2` or `>newfile2`)

(This is very slow because it's not buffering, with bs block size set to 1. However, if you don't, then you are limited in granularity to block sizes rather than a byte position.)

## Tail/head
How to use tail? I have to start counting from the end. So, 262008832-220000000 = 42008832
`time tail -c 42008832 large_file | head -c 10000000 > newfile3`

real	0m0.244s
user	0m0.000s
sys	0m0.032s

or better, using a `+` lets you tell head where to start from:
`time tail -c +220000001 large_file | head -c 10000000 > newfile4`
real	0m0.251s
user	0m0.004s
sys	0m0.032s


[There apparently doesn't exist a program that does this.
HEAD will let you specify a start offset (in bytes or lines)...
TAIL lets you specify an end offset (in bytes or lines)...
but both otherwise read the entire file. If we know the exact bytes we want, that can be quite wasteful for large files.
DD lets you do this, but requires setting a blocksize of 1, which makes it run extremely slowly.
This should probably be written in C...]