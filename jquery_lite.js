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

  root.$l = function (arg) {

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

  root.$l.extend = function(base) {
    var otherObjs = Array.prototype.slice.call(arguments, 1);
    otherObjs.forEach(function (obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          base[prop] = obj[prop];
        }
      }
    });
    return base;
  };

  var toQueryString = function(obj) {
    var result = "";
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        result += prop + "=" + obj[prop] + "&";
      }
    }
    return result.substring(0, result.length-1); //take off last "&"
  };


  root.$l.ajax = function(options) {
    var request = new XMLHttpRequest();
    var defaults = {
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      method: "GET",
      url: "",
      success: function(){},
      error: function(){},
      data: {},
    };
    options = root.$l.extend(defaults, options);

    if (options.method.toUpperCase() === "GET") {
      options.url += "?" + toQueryString(options.data);
    }

    request.open(options.method, options.url, true);
    request.onload = function (e) {
      if (request.status === 200) {
        options.success(request.response);
      } else {
        options.error(request.response);
      }
    };
    request.send(JSON.stringify(options.data));
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
