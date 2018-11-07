'use strict';

/**
 * @ref https://firebase.google.com/docs/firestore/quickstart
 * @type {firebase}
 */
const firebase = require("firebase");
require("firebase/firestore");
const _ = require("lodash");

// /**
//  * Adds commas to a number
//  * @param {number} number
//  * @param {string} locale
//  * @return {string}
//  */
// module.exports = function(number, locale) {
//     return number.toLocaleString(locale);
// };


class FirestoreDataModel {

    // static firebaseInitialized(params = null) {
    //     return params;
    // }
    // static firestore(params = null) {
    //     return params;
    // };
    //
    //
    //
    //
    //


    constructor(firebaseParams) {

        this.config = null;
        this.firestore = 1;
        this.firesbase = firebaseParams;

        console.log('1', this.config);
        console.log('2',this.config);


        // this.firestore =

        // this.firestore = this.initializeApp(firebaseParams);
        // this.settings = {timestampsInSnapshots: true};
        // this.firestore.settings(this.settings);

        //this.messages = [];
    }

    initialize(config) {

        // check for null/ not set here
        //this.setter(config);
        // const config = this.getter();
        // this.firestore ++;
        // console.log('firestore', this.firestore);
        this.firestore = this.firesbase.initializeApp(config).firestore();
        const settings = {timestampsInSnapshots: true};
        this.firestore.settings(settings);
        // console.log('firestore', this.firestore);
        //return config;
    }

    setter(params) {
        this.config = params;
    }

    getter(){
        return this.config;
    }

    /**
     * https://firebase.google.com/docs/firestore/query-data/queries#simple_queries
     * @param collection
     * @param params
     */
    findOne(collection, params) {
        return new Promise((resolve, reject) => {

            if (!collection || collection === "undefined") {
                return reject('You need to set collection as the first parameter before making any queries');
            }
            if (!params || params === "undefined") {
                return reject('No params to making any queries');
            }

            if ((!params.where || params.where === "undefined") && (!params.id || params.id === "undefined")) {
                return reject('You need to set collection queries, like "where" or "id"');
            }

            let where = params.where;
            let id = params.id;
            let self = this;

            return self.initFindOneQuery(collection, {'where': where, 'id': id}).then(function (doc) {
                let response = doc.docs[0];
                if (_.isEmpty(response) === false) {
                    const data = response.data();
                    if (_.isEmpty(id) === false) {
                        return resolve(_.merge(data, {id: id, node_id: response.id}));
                    } else {
                        return resolve(data);
                    }
                } else {
                    return resolve({});
                }
            }).catch(function (error) {
                return reject("Error getting document:", error);
            });
        });
    }

    initFindOneQuery(collection, queries) {

        let self = this;
        if (!queries.id || queries.id === "undefined") {
            this.collectionInstance = this.initCollection(collection);
            let whereQuery = queries.where;
            var query = self.collectionInstance;

            /**
             * whereQueryvar
             */
            if (whereQuery !== undefined) {
                query = self.whereLoop(whereQuery);
            }
            return query.get();
        } else {
            return self.initQueryById(collection, queries.id);
        }
    }

    whereLoop(whereQuery) {
        let self = this;
        var query = self.collectionInstance;

        var count = 0;
        for (let i in whereQuery) {
            let whereStatement = whereQuery[i];

            // if (typeof whereStatement === 'string') {
            //     return {error: 'The WHERE query needs to be an array'};
            // }
            // if (whereQuery.length !== 3) {
            //     return {error: 'The WHERE query needs to be 3 argument, but ' + whereQuery.length + ' was given'};
            // }

            query = query.where(whereStatement[0], whereStatement[1], whereStatement[2]);
            count++;

            if (whereQuery.length === count) {
                return query;
            }
        }
    }

    initCollection(collection) {
        return this.firestoreInit().collection(collection);
    }

    initQueryById(collection, id) {
        return this.initCollection(collection).doc(id).get();
    }

    initUpdate(collection, doc, objectData) {
        return this.initCollection(collection).doc(doc).update(objectData);
    }

    initCreate(collection, objectData) {
        if (!objectData.node_id || objectData.node_id === "undefined") {
            return this.initCollection(collection).add(objectData);
        } else {
            const node_id = objectData.node_id;
            return this.initCollection(collection).doc(node_id).set(objectData);
        }
    }

    firestoreInit(){
        // const config = this.getter();
        // this.firestore = this.firesbase.initializeApp(config).firestore();

        return this.firestore;
    }
}

const swallowStoreInstance = new FirestoreDataModel(firebase);
module.exports = swallowStoreInstance;