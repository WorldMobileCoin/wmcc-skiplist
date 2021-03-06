# wmcc-skiplist (WorldMobileCoin)

__NOTE__: The first release of wmcc-skiplist.

---

## WMCC SkipList

Utility for WMCC-Exchange.

### Usage:
```js
const Skiplist = require('wmcc-skiplist');

const list = new Skiplist({
  compare: function(a, b) {
    return a === b;
  }
});

list.insert(`val`);
const item = list.find(`val`);
list.delete(item);
```

**WorldMobileCoin** is a new generation of cryptocurrency.

Although still in a beta state, wmcc-skiplist is well tested and aware of all known
consensus rules. It is currently used in production as wallet system front-end 
for https://www.worldmobilecoin.com

## Disclaimer

WorldMobileCoin does not guarantee you against theft or lost funds due to bugs, mishaps,
or your own incompetence. You and you alone are responsible for securing your money.

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work.

## License

--Copyright (c) 2018, Park Alter (pseudonym)  
--Distributed under the MIT software license, see the accompanying  
--file COPYING or http://www.opensource.org/licenses/mit-license.php