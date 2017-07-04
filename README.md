# js-sheets

A javascript array manipulation library that mimics spreadsheet and database functionality in code.

### What and Why
js-sheets was born out of a need to manipulate, inspect, and merge large json array files in javascript.

It initially supported array lookup by field, and merging data from two arrays, but was quickly expanded to support indexing for efficient lookup, saving/loading to file, and more. 

Now it is being developed as a fully featured "in-code" database.

### Installing

Install using npm:
```
npm install js-sheets --save
```
Include in your code:

```
const Sheets = require('js-sheets');
let arr = new Sheets();
```

## Usage
js-sheets has many use-cases, including:
* Index and lookup data by object properties in an object-array
* Save/load js-sheets from json files
* Sort by field
* On the fly indexing

### Extends Array
js-sheets extends the native Array class, so you can treat it like you would a normal array.

```js
let arr = new Sheets();
arr[0] = {foo:'bar'};
arr.push({foo:'baz'});
arr.forEach(item=>{
    console.log(item.foo);
});
```

### Indexes
TO DOCUMENT

### Exporting/Importing to JSON
TO DOCUMENT

### Sorting
TO DOCUMENT

## Development Roadmap
Planned features:
* Aggregation operations on fields (avg, sum, count)
* Set operations between sheets (union, intersect, etc.)
* Advanced querying
* 100% test coverage

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
