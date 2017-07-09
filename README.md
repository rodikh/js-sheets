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
js-sheets can be configured to index properties of the objects that are stored in it's array using hash-maps.

To index fields, pass an array of field names to the constructor as options.indices.
```js
let arr = new Sheets([
    {weight: 10, color: 'red'},
    {weight: 12, color: 'blue'},
    {weight: 8, color: 'red'}
], {indices: ['weight', 'color']});
 
let list1 = arr.findByField('weight', 12);      // list1 = [{weight: 12, color: 'blue'}]
let list2 = arr.findByField('color', 'red');    // list2 = [{weight: 10, color: 'red'},{weight: 8, color: 'red'}]
```
Operations done on indexed properties will use hash-map lookups instead of looping over the array.

### Exporting/Importing to JSON
js-sheets includes convenience functions for saving and loading arrays from files.
```js
let filearray = Sheets.fromFile(path, options);
filearray.push({foo:'bar'});
filearray.save(); // saves back to the original file
filearray.save(path); // saves a new copy, without changing the original file
```

## Methods

### sortByField
```js
let arr = new Sheets([
    {weight: 10, color: 'red'},
    {weight: 12, color: 'blue'},
    {weight: 8, color: 'red'}
]);
arr.sortByField('weight');                                      // sort in-place
let sorted = arr.sortByField('weight', -1, {sortCopy:true});    // returns a sorted copy in ASC order, without changing the original array
console.log(sorted[0] === arr[2]);                              // true
``` 

## Development Roadmap
Planned features:
* Aggregation operations on fields (avg, sum, count)
* Set operations between sheets (union, intersect, etc.)
* Advanced querying
* 100% test coverage

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
