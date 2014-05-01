// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function (className) {
    var $bodyElementsToCheck = [], $body = document.body;

    function checkForChildNodes (element) {
        if (element.hasChildNodes()) {
            var childNodesArr = element.childNodes;	// get childNodes

            for (var k = 0; k < childNodesArr.length; k++) {
                if (childNodesArr[k].nodeType === 1){
                    $bodyElementsToCheck.push(childNodesArr[k]);
                    checkForChildNodes(childNodesArr[k]);
                }
            }
        }
    }

	if ($body.nodeType === 1) {
        $bodyElementsToCheck.push($body);
        checkForChildNodes($body);
    }

    return _.reduce($bodyElementsToCheck, function (memo, $node) {
		if ($node.classList.contains(className)) memo.push($node);
        return memo;
    }, []);
};
