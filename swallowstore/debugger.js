'use strict';

/**
 * https://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number
 * @param gState
 * @param klass
 * @return {*}
 * @constructor
 */
const Debugger = function (gState, klass) {
    const debug = {};
    // console.log(console);
    // if (!window.console) return function () {
    // }

    console.log(gState, klass)

    if (gState && klass.isDebug) {
        for (let m in console)
            if (typeof console[m] === 'function')
                debug[m] = console[m].bind(console, klass.toString() + ": ")
    } else {
        for (let m in console)
            if (typeof console[m] === 'function')
                debug[m] = function () {
                }
    }
    return debug
}

module.exports = Debugger;