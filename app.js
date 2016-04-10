'use strict';

var config = require('./config');

var util = require('util');
var clc = require('cli-color');
var moment = require('moment');

var isDebugLevel = function(value) {
    if(Number.isInteger(value) && value < config.debugLevels.length) {
        return true;
    }

    return false;
};

var brackify = function(value) {
    return config.brackets[0] + value + config.brackets[1];
};

var colorify = function(value, color, debugLevel) {
    if(debugLevel) {
        color = config.debugColors[debugLevel];
    }

    if(color) {
        if(Array.isArray(color)) {
            return clc[color[0]][color[1]](value);
        }

        return clc[color](value);
    }

    return value;
};

var note = function() {
    var args = Array.prototype.slice.call(arguments);

    var handle = '';
    var debugLevel = 0;
    var msgs = args;

    if(isDebugLevel(args[0])) {
        debugLevel= args[0];
        msgs = args.slice(1);
    }

    if(typeof args[0] === 'string' && args[1]) {
        handle = args[0];
        msgs = args.slice(1);

        if(isDebugLevel(args[1])) {
            debugLevel = args[1];
            msgs = args.slice(2);
        }
    }

    msgs = msgs.map(function(msg) {
        if(msg instanceof Error && msg.stack) {
            if(config.autoError !== false) {
                debugLevel = config.autoError;
            }

            return msg.stack;
        }

        return msg;
    });

    if(config.handleLength > 0) {
        handle = handle.slice(0, config.handleLength);

        while(handle.length < config.handleLength) {
            handle = config.handlePadding + handle;
        }
    }

    if(config.capitalizeHandle) {
        handle = handle.toUpperCase();
    }

    var dateNode = colorify(brackify(moment().format(config.dateFormat)), config.dateColor);
    var handleNode = colorify(brackify(handle), config.handleColor);
    var debugNode = colorify(brackify(config.debugLevels[debugLevel]), null, debugLevel);
    var msgsNode = colorify(msgs.join(', '), null, debugLevel);

    console.log(dateNode + handleNode + debugNode + ' ' + msgsNode);
};

note.config = function(newConfig) {
    Object.keys(newConfig).forEach(function(item) {
        config[item] = newConfig[item];
    });
}

module.exports = note;
