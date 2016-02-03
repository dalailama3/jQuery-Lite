(function (root) {

  window.$l = function (arg) {

    var returnValue;
    switch(typeof(arg)) {
      case("string"):
        returnValue = getNodesFromDom(arg);
        break;

      case("object"):
        if (arg instanceof HTMLElement) {
          returnValue = new DomNodeCollection([arg]);
        }
        break;
    }

    return returnValue;
  };

  var getNodesFromDom = function (selector) {

    var nodeList = document.querySelectorAll(selector);
    var nodes = [].slice.call(nodeList, 0);
    return new DomNodeCollection(nodes);
  };

  var DomNodeCollection = function DomNodeCollection(nodes) {
    this.nodes = Array.prototype.slice.call(nodes);
  };






})(this);