# dbindjs

**dbindjs** is data binding for Javascript.

**dbindjs** incorporates a couple of advantages over existing Javascript data binding libraries:
* data binding only
* relatively easy to use
* merged updates
* separation thru namespaces
* advanced fine-tuning
* consistent protection
* pause/resume features
* introduces the concept of 'binding pool'

Import with `const { dbind } = require('dbindjs')`

**Example:**

```
function queryDatabase() {
	console.log('queryDatabase: ', arguments[0]);
	var query = "SELECT chapters FROM books_contents WHERE book_id='%'";
	query = query.replace('%', arguments[0]);
	console.log('query: ', query);
	// ...
}

// define a binding pool containing a basic property and a basic binding relation
dbind({
	a: 1,
	b: function() {
		queryDatabase(this.a);
	}		
});

// trigger the binding by changing the value of its dependency
// this calls 'queryDatabase(23)'
dbind({ a: 23 });
```

## Others
Version 2.0.0 is a compatibility port aimed at NPM and GitHub package managers.

Further developments arriving soon.

**dbindjs** is © Copyright 2017-2020 Nicolae Iotu, nicolae.g.iotu@gmail.com
