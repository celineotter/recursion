// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function (obj) {
    var firstObj, subeqObj,strLength, i=0, synthaxError = false;

    //account for backslashes infront of quotes within strings
    function reduceBackstroke (gpStart,gpEnd) {
        var str ='';
        while (gpStart < gpEnd) {
            var slashIndex = obj.indexOf('\\', gpStart);
            if(slashIndex !== -1){
				if (slashIndex >= gpEnd-1) synthaxError = true;
				str += obj.slice(gpStart, slashIndex) + obj.slice(slashIndex +1,slashIndex +2);
                gpStart = slashIndex +2;
            } else {
                str += obj.slice(gpStart,gpEnd);
                gpStart = gpEnd;
            }
        }
        return str;
    }

    //string gp func:
    function findString (gpStart, gpEnd) {
        var getQuote = obj.indexOf('"', gpStart);
        var getSlashQuote = obj.indexOf('\\"', gpStart);
        
        return (getSlashQuote < getQuote && getSlashQuote !== -1 ?
        	reduceBackstroke(gpStart,gpEnd) : obj.slice(gpStart, getQuote));
    }

    //numb func:
    function findNumb (gpStart) {
        var gpEnd;
        for (var n=gpStart; /[0-9-.]/.test(obj[n]); n++) {
            gpEnd = n;
        }
        return obj.slice(gpStart, gpEnd +1);
    }
    
    function indexOf2nd (gpStart, elementOpen, elementClose) {
        var newPairTrack = 0;
        while(newPairTrack >= 0) {
            var gpEnd = obj.indexOf(elementClose, gpStart);
            var check = obj.indexOf(elementOpen, gpStart);
            if (check < gpEnd && check !== -1) {newPairTrack++; gpStart = check +1;}
            else {newPairTrack--; gpStart = gpEnd +1;}
        }
        return gpEnd;
    }
    // // obj + array get inside string func:
    function getLengthBtwnBrackets(gpStart, openBracketType, closeBracketType) {
        var gpEnd = indexOf2nd(gpStart, openBracketType, closeBracketType);
        if (gpEnd === -1) synthaxError = true;
        return gpEnd-gpStart;
    }

// same in arr and obj:
function commonFunc(start, openQ, closeQ) {
    if (openQ === '[') var subseqObj = [];
    else var subseqObj = {};
    var count = 0, propertiesArr = [], valuesArr = [];
    var initCount = start;
    
    var strLengthInsideBrackets = getLengthBtwnBrackets(start, openQ, closeQ);

    if (strLengthInsideBrackets > 0) {
        var objMaxLength = strLengthInsideBrackets + initCount;
        
        while (start < objMaxLength && start !== 0) {
            var elementFromStrObj = guideMappingByType(start, objMaxLength -1);

            if (typeof elementFromStrObj === 'object' && elementFromStrObj !== null && !Array.isArray(elementFromStrObj)){
                strLength = elementFromStrObj.objToStrLength;
                delete elementFromStrObj.objToStrLength;
            }
            if (Array.isArray(elementFromStrObj)) strLength = elementFromStrObj.pop();
            
            if (openQ === "[") subseqObj.push(elementFromStrObj);
            else if (count === 0) {propertiesArr.push(elementFromStrObj); count++;}
            else {valuesArr.push(elementFromStrObj); count--;}

            if (typeof elementFromStrObj === 'string') start += elementFromStrObj.length +1;
            else start += strLength;

            if (count === 1) start = obj.indexOf(':', start) +1;
            else start = obj.indexOf(',', start) +1;
        }
        if (openQ ==='{'){
            for ( var i = 0; i < valuesArr.length; i++) {
                subseqObj[propertiesArr[i]] = valuesArr[i];
            }
        }
    }
        if (openQ === '[') subseqObj.push(strLengthInsideBrackets);
        else {subseqObj['objToStrLength'] = strLengthInsideBrackets;}
        return subseqObj;
    }


    //===============================================//

    function guideMappingByType (start, objMaxLength) {
        //find string
        if (obj[start] === '"') return findString(start +1, objMaxLength);
        //find number        
        else if (/-|[0-9]/.test(obj[start]) ) {
            var rslt = findNumb(start); strLength = rslt.length; 
            return Number(rslt);
        }
        //find null, true, false
        else if (obj.slice(start, start +4) === 'null') {strLength = 4; return null;}
        else if (obj.slice(start,start +4) === 'true') {strLength = 4; return true;}
        else if (obj.slice(start,start +5) === 'false') {strLength = 5; return false;}
        
        //if arr
        else if (obj[start] === '[') return commonFunc(++start, '[',']');
        // if obj
        else if (obj[start] === '{') return commonFunc(++start, '{','}');
        else return (start < objMaxLength ? guideMappingByType(++start, objMaxLength) : undefined);
    }
    //===============================================//
    firstObj = guideMappingByType(0);
    if (synthaxError) firstObj = undefined;
    if (Array.isArray(firstObj)) firstObj.pop();
    else if(typeof firstObj === 'object' && firstObj !== null) delete firstObj['objToStrLength'];

    return firstObj;

};