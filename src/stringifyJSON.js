// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function (obj) {

    var historyArr = [], count=0, resultStr;

    function guideFunc (value){
        if (typeof value === 'string') {return '"' + value + '"';}
        else if (typeof value === 'boolean' || typeof value === 'number'|| value === null) {return value;}
        else if (Array.isArray(value)){return arrFunc(value);}
        else if (typeof value === 'object' && !Array.isArray(value) && typeof obj !== 'function') {return objectFunc(value);}
		else {return undefined;}
    }
    
    //============================================================//
    function arrFunc (obj){
		var x = count++;
		historyArr[x] = [];
		for (var i=0; i<obj.length; i++) {
			if (guideFunc(obj[i]) === undefined) {
				continue;
			} else {
			historyArr[x].push(guideFunc(obj[i]));
			}
		}
		return '['+ historyArr[x].join(',')+']';
    }
    
    //============================================================//
    
    function objectFunc (obj){
        var x = count++;
        historyArr[x] = [];
        var objKeys = Object.keys(obj);
    
        for(var j=0; j<objKeys.length; j++) {
            var key = guideFunc(objKeys[j]);
            var value = guideFunc(obj[objKeys[j]]);
			if (key === undefined || value === undefined) {
				continue;
			} else {
				historyArr[x].push( key + ':' + value);
			}
        }
    return '{' + historyArr[x].join(',') + '}';
    }
    //============================================================//
    if (Array.isArray(obj)) {return arrFunc(obj);}
    else if (typeof obj === 'object' && !Array.isArray(obj) && obj !==null) {return objectFunc(obj);}
    else {return '' + guideFunc(obj)+ '';}
};
