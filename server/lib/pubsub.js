'use strict';
module.exports = {
    publish: (socket, options) => {
        if (options) {
            var collection = options.collection;
            var method = options.method;
            var data = options.data;
            var modelId = options.modelId;
            var name;
            if (method === 'POST') {
                name = '/' + collection + '/' + method;
                socket.emit(name, data);
            } else {
                name = '/' + collection + '/' + modelId + '/' + method;
                socket.emit(name, data);
            }
            console.log('publish', name, data);
        } else {
            throw 'Error: Option must be an object type';
        }
    },
    onSave: (socket, options) => {
        let name = options.collection + ':' + options.method;
        console.log('save', name, options.data);
        socket.emit(name, options.data);
    },
    isEmpty: (obj) => {
        let hasOwnProperty = Object.prototype.hasOwnProperty;
        // null and undefined are "empt"y
        if (obj === null) return true;
        // Asssume if it has a lenth prperty with a non-zero value
        // that that preperty is correct
        if (obj.length > 0) return false;
        if (obj.length === 0) return true;
        // Otherwise, does ie have an properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumaration bus in IE < 9
        for (let key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }
};
