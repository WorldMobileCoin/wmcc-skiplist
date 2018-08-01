'use strict';

const SkipList = require('../lib/skiplist');

class SkipListTest {
  constructor(options) {
    this.list = new SkipList(options);
    this.values = ['not included', 'skip this'];
  }

  insert() {
    console.log(`INSERT ITEMS:`);
    let insert = [];
    for(let i=0; i<1000; i++) {
      const random = rand(10000, 99999);
      const value = `a${random}`;
      if (this.list.insert(value))
        insert.push(value);
      if (i>=990)
        this.values.push(value); // this.list.head.value
    }
    console.log(`Inserted value:\n${insert.join(' -> ')}`);
    console.log(`List length: ${this.list.length}`);
    console.log(`List level: ${this.list.level}`);

    for (let i = this.list.level - 1; i > -1; i--) {
      console.log(`Level: ${i}`);
      let item = this.list.head.items[i];
      let vals = [];
      while(item) {
        vals.push(item.value);
        item = item.items[i];
      }
      console.log(`Values:\n${vals.join(' -> ')}`);
    }
  }

  delete() {
    console.log(`\nDELETE ITEMS:`);
    let del = [];
    const initial = this.list.length;
    for (let value of this.values) {
      const item = this.list.find(value);
      if (item) {
        del.push(value);
        this.list.delete(item);
      }
    }
    console.log(`Deleted value:\n${del.join(' -> ')}`);
    console.log(`Initial length: ${initial}`);
    console.log(`Final length: ${this.list.length}`);
    console.log(`List level: ${this.list.level}`);
  }

  iter() {
    const values = [];
    const iter = this.list.iter();

    let count = 0;
    for(;;) {
      const item = iter.next();
      if (!item)
        break;

      values.push(item.value);
      this.list.delete(item);
      count ++;
    }
    console.log(`\nITERATOR:`);
    console.log(`Iter value:\n${values.join(' -> ')}`);
    console.log(`Iter count: ${count}`);
    console.log(`Final length: ${this.list.length}`);
  }
}

function strcmp(a, b) {
  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    if (a[i] < b[i])
      return -1;
    if (a[i] > b[i])
      return 1;
  }

  if (a.length < b.length)
    return -1;

  if (a.length > b.length)
    return 1;

  return 0;
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const list = new SkipListTest({compare: strcmp});

list.insert();
list.delete();
list.iter();