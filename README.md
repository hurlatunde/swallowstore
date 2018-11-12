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
      apiKey: "AIzaQQZIxwSyB8_EPfEZWfBQLUrbWOTMTiZoByA",
      authDomain: "my-first-project.firebaseapp.com",
      databaseURL: "https://my-first-project.firebaseio.com",
      projectId: "my-first-project",
      storageBucket: "my-first-project.appspot.com",
      messagingSenderId: "288194683984"
  })

  // Get all users
  swallowInstance.findAll('users').then(response => {
    console.log(response);
  });
  ```
  Available Methods: *findById(), findOne(), findAll(), saveAndUpdate(), delete()*


# API Reference

##### `.initialize(firebaseConfig: object)`

Set collection firebase Config.

**Parameters:**
- `object` firebase config setting

  ```javascript  
  //swallowstore initialize with firestore config
  swallowInstance.initialize({
      apiKey: "AIzaSyB8_EPfEZWfBQLUrbWOTMTiZoByQQZIxwA",
      authDomain: "my-first-project-5961c.firebaseapp.com",
      databaseURL: "https://my-first-project-5961c.firebaseio.com",
      projectId: "my-first-project-5961c",
      storageBucket: "my-first-project-5961c.appspot.com",
      messagingSenderId: "281946839884"
  })
  ```
  
##### `.findById(collectionName: string, id: string ): Promise<Document[]>`

Get One document in a collection by ID.

**Parameters:**
- `id` The document ID

**Returns:**
- A `Document` object or `null`

**Sample Code:**
```javascript

// Get user by id 
swallowInstance.findById('users', '5ixWj00cZYDirdz9CCJd').then(response => {
    console.log("users with id '5ixWj00cZYDirdz9CCJd' detail:", response);
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
const userObject = {
    current_project: 'swallowstore',
};

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