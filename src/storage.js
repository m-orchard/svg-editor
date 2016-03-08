export default {
    get: function(key) {
        const value = localStorage.getItem(key);
        if(value) {
            try {
                return JSON.parse(value);
            } catch(e) {
                return value;
            }
        }
        return value;
    },

    set: function(key, value) {
        let stringifiedValue;
        try {
            stringifiedValue = JSON.stringify(value);
        } catch(e) {
            stringifiedValue = value;
        }
        localStorage.setItem(key, stringifiedValue);
    },

    clear: function(key) {
        localStorage.removeItem(key);
    }
};