'use strict';

/**
 * @des Operation for query against the collection
 * @type {{LessThan: string, LessThanOrEqual: string, Equal: string, GreaterThan: string, GreaterThanOrEqual: string}}
 * The where() method takes three parameters: a field to filter on, a comparison operation, and a value. The comparison can be <, <=, ==, >, >=, or array_contains
 */

const operators = {
    LessThan: '>',
    LessThanOrEqual: '<=',
    Equal: '==',
    GreaterThan: '>',
    GreaterThanOrEqual: '>=',
    ArrayContain: 'array-contains',
}

module.exports = operators