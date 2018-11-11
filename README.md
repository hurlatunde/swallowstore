Swallowstore
=========

A flexible easy to use Google Cloud Firestore API Wrapper class for Node.JS

## Installation

  `npm install swallowstore`
  
## Sample Usage
  ```javascript
  const swallowInstance = require('swallowstore');
  
  //swallowstore initialize with firestore config
  swallowInstance.initialize({
      apiKey: "AIzaSyB8_EPfEZWfBQLUrbWOTMTiZoByQQZIxwA",
      authDomain: "my-first-project-5961c.firebaseapp.com",
      databaseURL: "https://my-first-project-5961c.firebaseio.com",
      projectId: "my-first-project-5961c",
      storageBucket: "my-first-project-5961c.appspot.com",
      messagingSenderId: "281946839884"
  })

  // Get all users
  swallowInstance.findAll('users').then(response => {
    console.log(response);
  });
  ```
  Available Methods: *findById(), findOne(), findAll(), save(), update(), delete()*


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

// Get all users by id
swallowInstance.findOne('users', '5ixWj00cZYDirdz9CCJd').then(response => {
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

// Get user by condition
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

// Get all users by condition
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