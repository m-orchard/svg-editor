export default function() {
    let called = false;
    let callCount = 0;
    let lastEvent;

    function callback() {
        called = true;
        callCount++;

        if(arguments.length == 0) {
            lastEvent = undefined;
        } else if(arguments.length == 1) {
            lastEvent = arguments[0];
        } else {
            const args = [];
            for(let i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            lastEvent = args;
        }
    }

    callback.called = function() {
        return called;
    }

    callback.callCount = function() {
        return callCount;
    }

    callback.lastEvent = function() {
        return lastEvent;
    }

    return callback;
}