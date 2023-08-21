const moment = require('moment');

function messageObject(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = messageObject;
