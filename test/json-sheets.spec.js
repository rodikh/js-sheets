/**
 * Created by rodik on 13/02/2017.
 */
const chai = require('chai');
const expect = chai.expect;

const JSONSheet = require('../js-sheets');

describe('JSON-Sheets', function () {
    const arr = [{a: 1, b: 4}, {a: 2, b: 3, c: 6}, {a: 3, b: 4}];
    const extra_item = {a:5,b:5};

    describe('Array functionality', function () {
        it('should deep clone', function () {
            let fObj = new JSONSheet(arr);
            expect(Array.from(fObj)).to.deep.equal(arr);
            fObj[0].a = 3;
            expect(fObj).to.not.deep.equal(arr);
        });

        it('should have array methods push/unshift', function () {
            let fObj = new JSONSheet(arr);
            fObj.push(extra_item);
            expect(fObj).to.not.deep.equal(arr);
            expect(Array.from(fObj)).to.deep.equal([...arr,extra_item]);
            fObj.unshift(extra_item);
            expect(Array.from(fObj)).to.deep.equal([extra_item, ...arr,extra_item]);
        });

        it('should have array methods pop/shift', function () {
            let fObj = new JSONSheet(arr);
            expect(fObj.pop()).to.deep.equal(arr[2]);
            expect(fObj.shift()).to.deep.equal(arr[0]);
            expect(Array.from(fObj)).to.deep.equal([arr[1]]);
        });

        it('should have array methods forEach/filter/map/reduce', function () {
            fObj = new JSONSheet(arr);
            let count = 0;
            fObj.forEach((item, i) => {
                expect(item).to.deep.equal(arr[i]);
                count++;
            });
            expect(count).to.equal(arr.length);

            expect(fObj.filter(item=>item.a===3)).to.deep.equal(arr.filter(item=>item.a===3));

            expect(fObj.map(item=>item.b)).to.deep.equal(arr.map(item=>item.b));

            let aSum = fObj.reduce((prev, cur) => prev + cur.a, 0);
            expect(aSum).to.equal(6);
        });

        it('should instantiate without passed array', function () {
            let fObj = new JSONSheet();
            expect(Array.from(fObj)).to.deep.equal([]);
        });
    });

    describe("Array accessors", function () {
        it('should access array elements', function () {
            let fObj = new JSONSheet(arr);
            expect(fObj[1]).to.deep.equal(arr[1]);
            expect(fObj[1]).to.not.equal(arr[1]);
            expect(fObj.length).to.equal(arr.length);

            fObj[2].b=5;
            expect(fObj[2]).to.deep.equal({a:3,b:5});
        });
    });

    describe("Indices", function () {
        it("should create indices", function () {
            let fObj = new JSONSheet(arr, {indices: ['a', 'b']});
            expect(Object.keys(fObj.indices).length).to.equal(2);
            expect(Object.keys(fObj.indices['a']).length).to.equal(3);
            expect(fObj.indices['a']['3']).to.deep.equal([arr[2]]);
            expect(fObj.indices['b']['4'].length).to.equal(2);
        });

        it("should findByField", function () {
            let fObj = new JSONSheet(arr, {indices: ['a']});
            expect(fObj.findByField('a',2)).to.deep.equal([arr[1]]);
            expect(fObj.findByField('b',4)).to.deep.equal([arr[0],arr[2]]);
        });

        xit("findByField should return empty array if not found", function () {
        });

        it("should be able to add indices to existing sheets", function () {
            let fObj = new JSONSheet(arr);
            expect(Object.keys(fObj.indices).length).to.equal(0);

            fObj.createIndex('b');
            expect(Object.keys(fObj.indices).length).to.equal(1);
            expect(fObj.indices['b']['4'].length).to.equal(2);

            fObj.createIndex('a');
            expect(Object.keys(fObj.indices['a']).length).to.equal(3);
            expect(fObj.indices['a']['3']).to.deep.equal([arr[2]]);
        });

        it("should update indecies on push/pop/shift/unshift", function () {
            let fObj = new JSONSheet(arr, {indices: ['a']});
            fObj.createIndex('b');

            fObj.push(extra_item);
            expect(fObj.indices['a']['5']).to.deep.equal([extra_item]);

            fObj.pop();
            expect(fObj.indices['a']['5']).to.equal(undefined);

            fObj.shift();
            expect(fObj.indices['b']['4']).to.deep.equal([arr[2]]);

            fObj.unshift(arr[0]);
            expect(fObj.indices['b']['4']).to.deep.equal([arr[2],arr[0]]);
        });

        xit("should update (add and remove) indecies on splice", function () {});

        it('should have array usability without indices', function () {
            let fObj = new JSONSheet();
            fObj.push(arr[0]);
            expect(Array.from(fObj)).to.deep.equal([arr[0]]);
            fObj.pop();
            expect(Array.from(fObj)).to.deep.equal([]);
        });
    });

    describe("Array property", function () {
        xit("should remove from indices upon removal", function () {});
    });

    describe("Sort", function () {
        it("should sort by field", function () {
            let fObj = new JSONSheet(arr, {indices: ['a','b','c']});
            fObj.sortByField('b');
            expect(fObj[0]).to.deep.equal(arr[1]);
        });

        it("should sort by field in descending order", function () {
            let fObj = new JSONSheet(arr, {indices: ['a','b','c']});
            fObj.sortByField('b', -1);
            expect(fObj[2]).to.deep.equal(arr[1]);
        });

        it("should sort by field and not mutate array in sortCopy mode", function () {
            let fObj = new JSONSheet(arr, {indices: ['a','b','c']});
            let sorted = fObj.sortByField('b', 1, {sortCopy:true});
            expect(fObj[0]).to.deep.equal(arr[0]);
            expect(sorted[0]).to.deep.equal(arr[1]);
        });
    });

    describe("Sets", function () {
        xit("should union", function() {});
        xit("should intersect", function() {});
    });

    describe("merge", function () {
        xit("should add properties from another sheet");
    });

    describe("File storage", function () {
        xit('should save to file');
        xit('should load from file');
        xit('should save a copy');
    });
});