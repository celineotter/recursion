// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function (obj) {

    function arrObjGuide (obj, openQ, closeQ) {
        var historyArr = [];

        _.each(obj, function (value, key) {
            if (openQ === '[') historyArr.push(guide(value));
            else ((guide(value)) ? historyArr.push(guide(key) + ':' + guide(value)) : value);
        });
        return openQ + historyArr.join(',') + closeQ;
    }

    function guide (value) {
        if (typeof value === 'string') return '"' + value + '"';
        else if (typeof value === 'boolean' || typeof value === 'number'|| value === null) return '' + value + '';
        else if (typeof value === 'object' && typeof obj !== 'function') {
            return (Array.isArray(value) ? arrObjGuide(value, '[', ']') : arrObjGuide(value, '{', '}'));
        }
		else return undefined;
    }

    return guide(obj);
};
