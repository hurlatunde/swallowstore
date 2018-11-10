Swallowstore
=========

A flexible easy to use Google Cloud Firestore API Wrapper class for Node.JS

## Installation

  `npm install swallowstore`
  
## Sample Usage
  ```javascript
  const swallowInstance = require('swallowstore');
  
  //swallowstore already did the instantiating for Firestore to make thing much more easier 
  swallowInstance.initialize({
      apiKey: "AIzaSyB8_EPfEZWfBQLUrbWOTMTiZoByQQZIxwA",
      authDomain: "my-first-project-5961c.firebaseapp.com",
      databaseURL: "https://my-first-project-5961c.firebaseio.com",
      projectId: "my-first-project-5961c",
      storageBucket: "my-first-project-5961c.appspot.com",
      messagingSenderId: "281946839884"
  })

  // Get all users
  swallowInstance.findOne('users').then(users => {
    console.log(users);
  });
  ```
  Available Methods: *findOne(), findAll(), save(), update(), delete()*


## Getting Started


  `npm install swallowstore`