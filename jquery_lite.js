(function (root) {

  var docReady = false, docReadyCallbacks = [];

  document.addEventListener("DOMContentLoaded", function () {
    docReady = true;
    docReadyCallbacks.forEach(function (callback) {
      callback();
    });
  });

  var queueCallbacks = function(cb) {
    if (!docReady) {
      docReadyCallbacks.push(cb);
    } else {
      cb();
    }
  };

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

      case("function"):
        queueCallbacks(arg);
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
      if (this.nodes.length > 0) return;
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

    remove: function() {
      this.each(function (node) {
        node.parentNode.removeChild(node);
      });
    },

    attr: function(key, val) {
      if (typeof val === "string") {
        this.each(function (node) {
          node.setAttribute(key, val);
        });
      } else {
        return this.nodes[0].getAttributes(key);
      }
    },

    addClass: function(newClass) {
      this.each(function (node){
        node.classList.add(newClass);
      });
    },

    removeClass: function(oldClass) {
      this.each(function (node) {
        node.classList.remove(oldClass);
      });
    },

    children: function () {
      var children = [];
      this.each(function (node) {
        var nodeChildren = [].slice.call(node.children);
        children = children.concat(nodeChildren);
      });
      return new DomNodeCollection(children);
    },

    parent: function () {
      var parents = [];
      this.each(function (node) {
        parents.push(node.parentNode);

      });
      return new DomNodeCollection(parents);
    },

    find: function (selector) {
      var foundNodes = [];
      this.each(function (node) {
        var nodeList = node.querySelectorAll(selector);
        foundNodes = foundNodes.concat([].slice.call(nodeList));
      });
      return new DomNodeCollection(foundNodes);
    },

    on: function(eventType, cb) {
      this.each(function (node) {
        node.addEventListener(eventType, cb);
      });
    },

    off: function(eventType, cb) {
      this.each(function (node) {
        node.removeEventListener(eventType, cb);
      });
    }



  };






})(this);
