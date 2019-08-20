Swallowstore
=========

[![npm version](https://badge.fury.io/js/swallowstore.svg)](https://badge.fury.io/js/swallowstore)
[![NPM](https://nodei.co/npm/swallowstore.png?mini=true)](https://nodei.co/npm/swallowstore/)
[![GitHub file size](https://img.shields.io/github/size/webcaetano/craft/build/phaser-craft.min.js.svg)](https://github.com/hurlatunde/swallowstore)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/hurlatunde/swallowstore)
[![GitHub](https://david-dm.org/hurlatunde/swallowstore.svg)](https://github.com/hurlatunde/swallowstore)


A flexible easy to use Google Cloud Firestore API Wrapper class for Node.JS

## Installation

  `npm install swallowstore`
  
## Sample Usage
  ```javascript
  const swallowInstance = require('swallowstore');
  
  //swallowstore initialize with firestore config
  swallowInstance.initialize({
      databaseURL: "https://my-first-project.com",
      projectId: "my-first-project",
  })

  // Get all users
  swallowInstance.findAll('users').then(response => {
    console.log(response);
  });
  ```
  Available Methods: *findById(), findOne(), findAll(), saveAndUpdate(), paginator(), delete()*


# API Reference

##### `.initialize(firebaseConfig: object)`

Set collection firebase Config.

**Parameters:**
- `object` firebase config setting

  ```javascript  
  //swallowstore initialize with firestore config
  swallowInstance.initialize({
      databaseURL: "https://my-first-project.com",
      projectId: "my-first-project",
  })
  ```
  
##### `.findById(collectionName: string, id: string ): Promise<Document[]>`

Get One document in a collection by ID.

**Parameters:**
- `id` The document ID /  `ids` The document IDs

**Returns:**
- A `Document` object or `null`

**Sample Code:**
```javascript
// Get user by id 
swallowInstance.findById('users', '5ixWj00cZYDirdz9CCJd').then(response => {
    console.log("users with id '5ixWj00cZYDirdz9CCJd' detail:", response);
});

// Get user by ids
swallowInstance.findById('users', ['0Qq4GEfXPsc2ixvDZv8MFEcu2ek1', '0Qq4GEfXPsc2ixvDZv8MFEcu2ek1']).then(response => {
    console.log("users with ids '['0Qq4GEfXPsc2ixvDZv8MFEcu2ek1', '0Qq4GEfXPsc2ixvDZv8MFEcu2ek1']' detail:", response);
});
```

  
##### `.findOne(collectionName: string, { conditions: Array<Condition> = null } ): Promise<Document[]>`

Get One document in a collection by ID or by conditions.

**Parameters:**
- `conditions` Array of conditions
- `id` The document ID

**Returns:**
- A `Document` object or `null`

**Sample Code:**
```javascript

// Get user by id
swallowInstance.findOne('users', { id: '5ixWj00cZYDirdz9CCJd' }).then(response => {
    console.log("users with id '5ixWj00cZYDirdz9CCJd' detail:", response);
});

// Get user by condition(s)
const conditions = {
    'where': [
        ['email', '==', 'hurlatunde@gmail.com']
        ['password', '==', 'password']
    ]
};

swallowInstance.findOne('users', conditions).then(response => {
    console.log("user:", response);
});
```


##### `.saveAndUpdate(collectionName: string, data: Object, id: String ): Promise<ResultData>`

Add / Update a document.

**Parameters:**
- `data` A document object
- `id` The document ID

**Returns:**
- `ResultData` object or `null`

**Sample Code:**
```javascript
// Add a user with auto-generated ID
const userObject = {
    name: 'Kat',
    email: 'kat@email.com',
    gender: 'female'
};

swallowInstance.saveAndUpdate('users', userObject).then(response => {
    console.log("Add Result (auto-generated ID):", response);
});
// response { node_id: 'BQFNY9pQDhZOarvmoMSB' }

// Add a user with custom ID
const userObject = {
    node_id: 'BQFNY9pQDhZOarvmoMSB',
    name: 'Gary',
    email: 'gary@email.com',
    gender: 'male'
};

swallowInstance.saveAndUpdate('users', userObject).then(response => {
    console.log("Add Result (custom ID):", response);
});
// response { node_id: 'BQFNY9pQDhZOarvmoMSB' }


// Update a user with ID
swallowInstance.saveAndUpdate('users', userObject, 'BQFNY9pQDhZOarvmoMSB').then(response => {
    console.log("Updated Result:", response);
});
// response { node_id: 'BQFNY9pQDhZOarvmoMSB' }

```


##### `.findAll(collectionName: string, { conditions: Array<Condition> = null, orderBy: Array<OrderBy> = null, limit: number = null } ): Promise<Document[]>`

Get document in a collection.

**Parameters:**
- `conditions` Array of conditions
- `orderBy` Field name to order by
- `limit` Number of documents to retrieve || default is 20

**Returns:**
- Array of `Document` object

**Sample Code:**
```javascript

// Get all users
swallowInstance.findAll('users').then(response => {
    console.log("All users: ", response);
});

// Get all users by condition(s)
const conditions = {
    'where': [
        ['age', '>=', 20]
        ['likes', '>=', 200]
    ],
    'limit': 5
};

swallowInstance.findAll('users', conditions).then(response => {
    console.log("All users with age >= '20' & likes >= '200', limit '5':", response);
});
```

##### `.paginator(collectionName: string): paginatorDocument{}`

Get paginate document in a collection.

**Parameters:**
- `conditions` Array of conditions
- `orderBy` Field name to order by
- `limit` Number of documents to retrieve || default is 20

**Returns:**
- Array of `Document` object

**Sample Code:**
```javascript

// Get all users
let paginateInit;
paginateInit = swallowInstance.paginator('users');
paginateInit.params({'limit': 2, 'orderBy': 'full_name'}).then(({data}) => {
    console.log(data);
});
    
// Get the next index of user collection by condition(s)
paginateInit.next().then(({data}) => {
    console.log("next users collection: ",data);
});

// Get the previous index of user collection by condition(s)
paginateInit.previous().then(({data}) => {
    console.log("previous users collection: ",data);
});
```

##### `delete(collectionName: string, id: string): Promise<ResultData>`

Delete a document

**Parameters:**
- `id` The document ID

**Returns:**
- `ResultData` object or `null`

**Sample Code:**
```javascript
// Delete a user by ID
swallowInstance.delete('users', {'id' : 'HnjIzeysNmi4DLL2tFUJ'}).then((res) => {
    console.log("Delete Result:", result);
});
```