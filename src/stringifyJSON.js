// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function (obj) {
    var historyArr = [], count = 0, resultStr;

    function guideFunc (value) {
        if (typeof value === 'string') return '"' + value + '"';
        else if (typeof value === 'boolean' || typeof value === 'number'|| value === null) return value;
        else if (Array.isArray(value)) return arrObjGuide(value, '[', ']');
        else if (typeof value === 'object' && typeof obj !== 'function') return arrObjGuide(value, '{', '}');
		else return undefined;
    }

    function arrObjGuide (obj, openQ, closeQ) {
        var x = count++;
        historyArr[x] = [];

        _.each(obj, function (value, key) {
            if (openQ === '[') historyArr[x].push(guideFunc(value));
            else {
                var keyStr = guideFunc(key);
                var valueStr = guideFunc(value);
                if (keyStr !== undefined && valueStr !== undefined) historyArr[x].push( keyStr + ':' + valueStr);
            }
        });
        return openQ + historyArr[x].join(',') + closeQ;
    }
 
    return (typeof obj === 'object' && obj !== null ? guideFunc(obj) : '' + guideFunc(obj)+ '');
};
