'use strict';

/**
 * @ref https://firebase.google.com/docs/firestore/quickstart
 * @type {firebase}
 */
const firebase = require("firebase");
const operation = require('operators');
require("firebase/firestore");

/**
 * @type {_|_.LoDashStatic}
 * @private
 */
const _ = require("lodash");



/**
 * @class FirestoreDataModel
 */
class FirestoreDataModel {

    static UNDEFINED = "undefined";

    constructor(firebaseParams) {
        this.config = null;
        this.firestore = 1;
        this.firesbase = firebaseParams;
    }

    initialize(config) {
        this.firestore = this.firesbase.initializeApp(config).firestore();
        const settings = {timestampsInSnapshots: true};
        this.firestore.settings(settings);
    }

    setter(params) {
        this.config = params;
    }

    getter() {
        return this.config;
    }

    /**
     * https://firebase.google.com/docs/firestore/query-data/queries#simple_queries
     * @param collection
     * @param params
     */
    findOne(collection, params, onSnapshot = false) {

        return new Promise((resolve, reject) => {

            if (!collection || collection === FirestoreDataModel.UNDEFINED) {
                return reject('You need to set collection as the first parameter before making any queries');
            }
            if (!params || params === FirestoreDataModel.UNDEFINED) {
                return reject('No params to making any queries');
            }

            if ((!params.where || params.where === FirestoreDataModel.UNDEFINED) && (!params.id || params.id === FirestoreDataModel.UNDEFINED)) {
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
                return reject("Error getting document:"+ error);
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

    /**
     * @url https://firebase.google.com/docs/firestore/query-data/queries#compound_queries
     * @param whereQuery || Compound queries
     * @return {*}
     * @desc where() methods to create more specific queries (logical AND). However, to combine the equality operator (==)
     * with a range or array-contains clause (<, <=, >, >=, or array_contains),
     */
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

            /**
             * @type {firebase.firestore.field | firebase.firestore.operator | firebase.firestore.value
             */
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

    firestoreInit() {
        // const config = this.getter();
        // this.firestore = this.firesbase.initializeApp(config).firestore();

        return this.firestore;
    }
}

const swallowInstance = new FirestoreDataModel(firebase);
module.exports = swallowInstance;

/**
 * @des Operation for query against the collection
 * @type {{LessThan: string, LessThanOrEqual: string, Equal: string, GreaterThan: string, GreaterThanOrEqual: string}}
 * The where() method takes three parameters: a field to filter on, a comparison operation, and a value. The comparison can be <, <=, ==, >, >=, or array_contains
 */
// const operators = {
//     LessThan: '>',
//     LessThanOrEqual: '<=',
//     Equal: '==',
//     GreaterThan: '>',
//     GreaterThanOrEqual: '>=',
//     ArrayContain: 'array-contains',
// };


// exports [ swallowStoreInstance, operators];

// export default swallowStoreInstance



// export const Operators = {[
//     LessThan = '>',
//     LessThanOrEqual = '<=',
//     Equal = '==',
//     GreaterThan = '>',
//     GreaterThanOrEqual = '>='
//     ]}
//

// export const {
//     swallowStoreInstance = new FirestoreDataModel(firebase)
// }
// export.exports enum Operators {
//     LessThan = '>',
//         LessThanOrEqual = '<=',
//         Equal = '==',
//         GreaterThan = '>',
//         GreaterThanOrEqual = '>='
// }
//
// export enum SortType {
//     Ascending = 'asc',
//         Descending = 'desc'
// }