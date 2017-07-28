# mapreduce for EZS plugin

This package cannot be used alone. EZS has to be installed.

## Example

```ini
#!/usr/bin/env ezs

[use]
plugin = distinct 

[distinct]
field = A
field = B

```

## Installation

    $ git clone https://github.com/touv/node-mapreduce.git
    $ cd node-mapreduce
    $ npm install -g ezs
    $ npm install
    $ npm link
    $ npm run build 
    $ cat examples/data.csv | ./examples/mapreduce.ezs


## Statements


### distinct
-  **field** = access key for field

## count
-  **field** = access key for field

## distinct
-  **field** = access key for field

## graph
-  **field** = access key for field

## groupby
-  **field** = access key for field

## keys
-  **field** = access key for field

## max
-  **field** = access key for field

## merge
-  **field** = access key for field

## min
-  **field** = access key for field

## stats
-  **field** = access key for field

## ventilate
-  **field** = access key for field


## Run examples

```bash

$ npm run build
$ ./examples/csv-max.ezs < ./examples/data/csv

```
