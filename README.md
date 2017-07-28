# mapreduce for EZS plugin

This package cannot be used alone. EZS has to be installed.

## Example

```js
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


<a id="distinct"></a>
### distinct
-  **field** = access key for field

disctinct groupe bield by value

