const _ = require("lodash");

var users = [
  { user: "barney", age: 36 },
  { user: "fred", age: 40 },
  { user: "pebbles", age: 1 },
];

var youngest = _.chain(users)
  .sortBy("age")
  .map((o) => {
    return o.user + " is " + o.age;
  })
  .head()
  .value();

console.log(youngest);

_.isNil(null);
// => true
 
_.isNil(void 0);
// => true
 
_.isNil(NaN);
// => false

let a = null;
let b = NaN;

if (!b) {
  console.log('!b');
} else {
  console.log('b');
}
// console.log('isNil: ', _.isNil())