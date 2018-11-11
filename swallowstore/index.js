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

const Debugger = require('./debugger');

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
        this.isDebug = true //local state turn me off to see
        this.debug = Debugger(this.isDebug, this);
        this.debug.warn('swallowstore is working');
        this.config = null;
        this.firestore = null;
        this.firesbase = firebaseParams;
        this.version = '0.1.1';
        this._limit = 3;
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
     * https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
     * @param collection
     * @param id
     * @return {Promise}
     */
    findById(collection, id) {
        return new Promise((resolve, reject) => {

            if (!collection || collection === FirestoreDataModel.UNDEFINED) {
                return reject('You need to set collection as the first parameter before making any queries');
            }

            if (!id || id === FirestoreDataModel.UNDEFINED) {
                return reject('#findById needs "id" params');
            }

            let self = this;
            return self.initQueryById(collection, id).then((doc) => {
                if (!doc.exists) {
                    return resolve('No such document!');
                } else {
                    const data = doc.data();
                    return resolve(_.merge(data, {node_id: doc.id, id: doc.id}));
                }
            }).catch((error) => {
                return reject("Error getting document:" + error);
            })
        });
    }

    /**
     * @since 0.1.0
     * https://firebase.google.com/docs/firestore/query-data/queries#simple_queries
     * @param collection
     * @param params
     * @return {Promise}
     */
    findAll(collection, params = {}) {
        return new Promise((resolve, reject) => {

            if (!collection || collection === FirestoreDataModel.UNDEFINED) {
                return reject('You need to set collection as the first parameter before making any queries');
            }

            if (params.id) {
                return reject('#findAll does not support "id" params, use #findOne to be able to use query by "id"');
            }

            if ((params.where && params.where === FirestoreDataModel.UNDEFINED)) {
                return reject('You need to set collection queries, like "where"');
            }

            let where = params.where;
            let id = params.id;
            let orderBy = params.orderBy;
            let limit = params.limit;
            let self = this;

            if (!limit || limit === FirestoreDataModel.UNDEFINED) {
                limit = this._limit;
            } else {
                limit = parseInt(limit);
            }

            return self.initCollectionWithQueries(collection, {
                'where': where,
                'orderBy': orderBy,
                'limit': limit
            }).then((res) => {
                let count = res.size;
                let response = res.empty;

                let data = [];
                res.docs.forEach(function (childSnapshot) {
                    let key = childSnapshot.id;
                    let childData = childSnapshot.data();
                    childData.node_id = key;
                    childData.id = key;
                    data.push(childData);
                });

                if (count > 0) {
                    response = true;
                } else {
                    response = false;
                }
                return resolve({data: data, response: response, response_count: count});

            }).catch((error) => {
                return reject("Error getting documents:" +error);
            })
        });
    }

    /**
     * @since 0.1.0
     * https://firebase.google.com/docs/firestore/query-data/queries#simple_queries
     * @param collection
     * @param params
     * @return {Promise}
     */
    findOne(collection, params = {}) {
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
            let limit = 1;
            let self = this;

            return self.initCollectionWithQueries(collection, {
                'where': where,
                'limit': limit,
                'id': id
            }).then((doc) => {
                if (_.isEmpty(id) !== false) {
                    let response = doc.docs[0];
                    if (_.isEmpty(response) === false) {
                        const data = response.data();
                        return resolve(_.merge(data, {node_id: response.id, id: response.id}));
                    } else {
                        return resolve({});
                    }
                } else {
                    const data = doc.data();
                    return resolve(_.merge(data, {node_id: doc.id, id: doc.id}));
                }
            }).catch((error) => {
                return reject("Error getting document:" + error);
            });
        });
    }

    initCollectionWithQueries(collection, queries) {
        return new Promise((resolve, reject) => {
            let self = this;
            if (!queries.id || queries.id === "undefined") {
                this.collectionInstance = this.initCollection(collection);
                let whereQuery = queries.where;
                let orderByQuery = queries.orderBy;
                let limitQuery = queries.limit;
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

                /**
                 * orderByQuery
                 */
                if (orderByQuery !== undefined) {
                    query = self.collectionInstance.orderBy(orderByQuery);
                }

                return resolve(query.limit(limitQuery).get());
            } else {
                return resolve(self.initQueryById(collection, queries.id));
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
     * @return {null|firestore init}
     */
    firestoreInit() {
        return this.firestore;
    }

    _debugger(params) {
        return this.debug.warn(params);
    }
}

/**
 * @type {FirestoreDataModel}
 */
module.exports = new FirestoreDataModel(firebase);