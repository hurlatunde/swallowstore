'use strict';

/**
 * @ref https://firebase.google.com/docs/firestore/quickstart
 * @type {firebase}
 */
const firebase = require("firebase");
require("firebase/firestore");

/**
 * @type {{LessThan: string, LessThanOrEqual: string, Equal: string, GreaterThan: string, GreaterThanOrEqual: string}}
 */
const operators = require('./operators');

/**
 * @type {_|_.LoDashStatic}
 * @private
 */
const _ = require("lodash");

/**
 * @class FirestoreDataModel
 */
class FirestoreDataModel {

    static UNDEFINED() {
        return "undefined";
    }

    constructor(firebaseParams) {
        this.config = null;
        this.firestore = null;
        this.firesbase = firebaseParams;
        this.version = '0.1.1';
    }

    initialize(config) {
        this.firestore = this.firesbase.initializeApp(config).firestore();
        const settings = {timestampsInSnapshots: true};
        this.firestore.settings(settings);
    }

    appVersion() {
        return this.version;
    }

    setter(params) {
        this.config = params;
    }

    getter() {
        return this.config;
    }

    /**
     * @since 0.1.0
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
                return reject("Error getting document:" + error);
            });
        });
    }

    initFindOneQuery(collection, queries) {
        return new Promise((resolve, reject) => {
            let self = this;
            if (!queries.id || queries.id === "undefined") {
                this.collectionInstance = this.initCollection(collection);
                let whereQuery = queries.where;
                let query = self.collectionInstance;

                /**
                 * whereQueryvar
                 */
                if (whereQuery !== undefined) {
                    const whereLoopQuery = self.whereLoop(whereQuery);
                    if (!whereLoopQuery.error || whereLoopQuery.error === FirestoreDataModel.UNDEFINED) {
                        query = self.whereLoop(whereQuery);
                    } else {
                        return reject(whereLoopQuery.error);
                    }
                }

                return resolve(query.get());
            } else {
                return self.initQueryById(collection, queries.id);
            }
        });
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
        let query = self.collectionInstance;
        const promises = [];

        let count = 0;
        for (let i in whereQuery) {
            let whereStatement = whereQuery[i];

            if (typeof whereStatement === 'string') {
                promises.push('The WHERE query needs to be an array');
                break;
            }

            if (whereStatement.length !== 3) {
                promises.push('The WHERE query needs to be 3 argument, but ' + whereStatement.length + ' was given');
                break;
            }

            /**
             * @type {firebase.firestore.field | firebase.firestore.operator | firebase.firestore.value
             */
            if (!Object.values(operators).includes(whereStatement[1])) {
                promises.push('You need to set an operator');
                break;
            }
            query = query.where(whereStatement[0], whereStatement[1], whereStatement[2]);
            count++;

            if (whereQuery.length === count) {
                return query;
            }
        }

        return {error: promises};
    }

    /**
     * @param collection
     * @return {firebase.firestore.CollectionReference | firebase.firestore.CollectionReference}
     */
    initCollection(collection) {
        return this.firestoreInit().collection(collection);
    }

    /**
     * @param collection
     * @param id
     */
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

    /**
     * @return {null|*}
     */
    firestoreInit() {
        return this.firestore;
    }
}

/**
 * @type {FirestoreDataModel}
 */
module.exports = new FirestoreDataModel(firebase);