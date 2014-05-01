// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:

var getElementsByClassName = function (className) {
    var $result = [], $body = document.body;

    function checkChildNodes (element) {
		if (element.classList.contains(className)) $result.push(element);
		if (element.hasChildNodes()) {
			var childNodeArr = element.childNodes;

			_.each(childNodeArr, function (childNode) {
				if (childNode.nodeType === 1) checkChildNodes(childNode);
			});
		}
	}
    checkChildNodes($body);

    return $result;
};

