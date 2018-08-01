/*!
 * Copyright (c) 2018, Park Alter (pseudonym)
 * Distributed under the MIT software license, see the accompanying
 * file COPYING or http://www.opensource.org/licenses/mit-license.php
 *
 * https://github.com/worldmobilecoin/wmcc-skiplist
 * skiplist.js - skiplist for wmcc-exchange.
 */

'use strict';

class SkipList {
  constructor(options) {
    this.length = 0;
    this.level = 1;
    this.free = options.free;
    this.cmp = options.compare;
    this.dup = options.duplicate;
    this.head = new Item(null, this.dup);
  }

  /**
   * @private
   * @return {Number} level
   */
  _randomLevel() {
    let level = 1;
    while (rand(1, Math.floor(0xFFFFFFFF/2) & 0xFFFF) < (SkipList.P * 0xFFFF))
      level++;

    return (level < SkipList.MAX_LEVEL) ? level : SkipList.MAX_LEVEL;
  }

  /**
   * @param {Any} value
   * @return {Object|null} SkipList
   */
  insert(value) {
    let items = [];
    let head = this.head;

    for (let i = this.level - 1; i > -1; i--) {
      while (head.items[i] && this.cmp(head.items[i].value, value) <= 0)
        head = head.items[i];
      items[i] = head;
    }

    if (head.value && this.cmp(head.value, value) === 0)
      return null;

    const level = this._randomLevel();
    if (level > this.level) {
      for (let i = this.level; i < level; i++)
        items[i] = this.head;
      this.level = level;
    }

    const item = new Item(value, this.dup);
    for (let i = 0; i < level; i++) {
      item.items[i] = items[i].items[i];
      items[i].items[i] = item;
    }

    this.length++;

    return this;
  }

  /**
   * @param {Object} Item
   */
  delete(item) {
    let items = [];
    let head = this.head;

    for (let i = this.level - 1; i > -1; i--) {
      while (head.items[i] && this.cmp(head.items[i].value, item.value) < 0)
        head = head.items[i];
      items[i] = head;
    }

    for (let i = 0; i < this.level; i++) {
      if (items[i].items[i] === item)
        items[i].items[i] = item.items[i];
    }

    while (this.level > 1 && this.head.items[this.level - 1] === null)
      this.level--;

    if (this.free)
      this.free(item.value);

    this.length--;
  }

  /**
   * @param {Any} value
   * @return {Object|Boolean} Item
   */
  find(value) {
    let head = this.head;

    for (let i = this.level - 1; i > -1; i--) {
      while (head.items[i] && this.cmp(head.items[i].value, value) <= 0)
        head = head.items[i];
    }

    if (head.value && this.cmp(head.value, value) === 0)
      return head;

    return null;
  }

  /**
   * Release skiplist
   */
  release() {
    let next;
    const curr = this.head.items[0];
    while(this.length--) {
      next = curr.items[0];

      if (this.free)
        this.free(curr.value);

      curr = next;
    }
  }

  iter() {
    return new Iterator(this.head);
  }
}

/**
 * Constant
 */
SkipList.MAX_LEVEL = 16;
SkipList.P = 0.25;

/**
 * Item
 * @private
 */
class Item {
  constructor(value, duplicate) {
    this.items = [];
    if (duplicate)
      this.value = duplicate(value);
    else
      this.value = value;
  }
}

/**
 * Iterator
 * @private
 */
class Iterator {
  constructor(item) {
    this.item = item.items[0];
  }

  next() {
    const item = this.item;
    if (item)
      this.item = item.items[0];

    return item;
  }

  release() {
    this.item = null;
  }
}

/**
 * Helper
 */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Expose
 */
module.exports = SkipList;