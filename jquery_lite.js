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

  DomNodeCollection.prototype = {
    each: function (callback) {
      this.nodes.forEach(callback);

    },

    html: function (html) {
      if (typeof html === "string") {
        this.each(function (node) {
          node.innerhtml = html;
        });
      } else {
        if (this.nodes.length > 0) {
          this.nodes[0].innerhtml = html;
        }

      }
    },

    empty: function () {
      this.html("");
    },

    append: function(children) {
      if (this.nodes.length > 0) return; //append only works for a single node
      if (typeof children === 'object' &&
          !(children instanceof DomNodeCollection)) {
        children = root.$l(children);

      }
      if (typeof children === "string") {
        this.each(function (node) {
          node.innerhtml += children;
        });
      } else if (children instanceof DomNodeCollection) {
        var node = this.nodes[0];
        children.each(function (childNode) {
          node.appendChild(childNode);
        });
      }
    },



  };






})(this);
