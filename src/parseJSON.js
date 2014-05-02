// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function (obj) {debugger;
    var createdObj, strLength, i = 0, synthaxError = false;

    //account for backslashes infront of quotes within strings
    function checkBackstrokes (gpStart, gpEnd) {
        var str ='';
        while (gpStart < gpEnd) {
            var slashIndex = obj.indexOf('\\', gpStart);
            if(slashIndex !== -1){
                if (slashIndex >= gpEnd-1) synthaxError = true;
                str += obj.slice(gpStart, slashIndex) + obj.slice(slashIndex +1, slashIndex +2);
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
            checkBackstrokes(gpStart,gpEnd) : obj.slice(gpStart, getQuote));
    }

    //numb func:
    function findNumb (gpStart) {
        var endIndex;
        for (var n = gpStart; /[0-9-.]/.test(obj[n]); n++) {
            endIndex = n;
        }
        return obj.slice(gpStart, endIndex +1);
    }
    
    function indexOf2nd (startIndex, openB, closeB) {
        var newBracketCount = 0;
        while(newBracketCount >= 0) {
            var endIndex = obj.indexOf(closeB, startIndex);
            var checkForNested = obj.indexOf(openB, startIndex);
            if (checkForNested < endIndex && checkForNested !== -1) {newBracketCount++; startIndex = checkForNested +1;}
            else {newBracketCount--; startIndex = endIndex +1;}
        }
        return endIndex;
    }
    // // obj + array get inside string func:
    function getLengthBtwnBrackets(startIndex, openB, closeB) {
        var endIndex = indexOf2nd(startIndex, openB, closeB);
        if (endIndex === -1) synthaxError = true;
        return endIndex - startIndex;
    }

// same in arr and obj:
function commonFunc(start, openB, closeB) {
    var buildingObj = (openB === '[' ? [] : {});
    var insertKeyNext = true, keysArr = [], valuesArr = [];
    var frozenStart = start;
    
    var strLengthInsideBrackets = getLengthBtwnBrackets(start, openB, closeB);
    var objCloseIndex = strLengthInsideBrackets + frozenStart;
        
        while (start < objCloseIndex && start !== 0 && strLengthInsideBrackets > 0) {
            var elementFromStrObj = mapByType(start, objCloseIndex -1);

            if (typeof elementFromStrObj === 'object' && elementFromStrObj !== null && !Array.isArray(elementFromStrObj)){
                strLength = elementFromStrObj.objToStrLength;
                delete elementFromStrObj.objToStrLength;
            }
            if (Array.isArray(elementFromStrObj)) strLength = elementFromStrObj.pop();
            
            if (openB === "[") buildingObj.push(elementFromStrObj);
            else if (insertKeyNext) {keysArr.push(elementFromStrObj); insertKeyNext = false;}
            else {valuesArr.push(elementFromStrObj); insertKeyNext = true;}
            
            start += (typeof elementFromStrObj === 'string' ? elementFromStrObj.length +1 : strLength);
            start = obj.indexOf((insertKeyNext ? ',' : ':'), start) +1;
        }
        if (openB ==='{') {
            for ( var i = 0; i < valuesArr.length; i++) {
                buildingObj[keysArr[i]] = valuesArr[i];
            }
        }
        if (openB === '[') buildingObj.push(strLengthInsideBrackets);
        else {buildingObj['objToStrLength'] = strLengthInsideBrackets;}
        return buildingObj;
    }
    //===============================================//

    function mapByType (start, objMaxLength) {
        //find string
        if (obj[start] === '"') return findString(start +1, objMaxLength);
        //find number        
        else if (/-|[0-9]/.test(obj[start])) {
            var numberStr = findNumb(start); strLength = numberStr.length;
            return Number(numberStr);
        }
        //find null, true, false
        else if (obj.slice(start, start +4) === 'null') {strLength = 4; return null;}
        else if (obj.slice(start, start +4) === 'true') {strLength = 4; return true;}
        else if (obj.slice(start, start +5) === 'false') {strLength = 5; return false;}
        
        //if arr
        else if (obj[start] === '[') return commonFunc(++start, '[',']');
        // if obj
        else if (obj[start] === '{') return commonFunc(++start, '{','}');
        else return (start < objMaxLength ? mapByType(++start, objMaxLength) : undefined);
    }
    //===============================================//

    createdObj = mapByType(0);
    if (synthaxError) createdObj = undefined;
    if (Array.isArray(createdObj)) createdObj.pop();
    else if(typeof createdObj === 'object' && createdObj !== null) delete createdObj['objToStrLength'];

    return createdObj;

};