(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

  module.exports = function(samjs) {
    var Model, _plugins;
    _plugins = [];
    return samjs.Mongo = Model = (function() {
      function Model(name) {
        this.remove = bind(this.remove, this);
        this.update = bind(this.update, this);
        this.insert = bind(this.insert, this);
        this.count = bind(this.count, this);
        this.find = bind(this.find, this);
        var i, len, plugin;
        this.onceLoaded = samjs.io.onceLoaded.then(function(nsp) {
          return nsp("/" + name);
        });
        this.onceLoaded.then((function(_this) {
          return function(nsp) {
            nsp.socket.on("inserted", function(id) {
              return _this.emit("inserted", id);
            });
            nsp.socket.on("updated", function(id) {
              return _this.emit("updated", id);
            });
            return nsp.socket.on("removed", function(id) {
              return _this.emit("removed", id);
            });
          };
        })(this));
        samjs.events(this);
        for (i = 0, len = _plugins.length; i < len; i++) {
          plugin = _plugins[i];
          plugin.bind(this)();
        }
      }

      Model.plugins = function() {
        var i, len, plugin, plugins, ref, results;
        plugins = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        ref = samjs.parseSplats(plugins);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          plugin = ref[i];
          results.push(_plugins.push(plugin));
        }
        return results;
      };

      Model.prototype.find = function(query) {
        if (query == null) {
          query = {};
        }
        return this.onceLoaded.then(function(nsp) {
          return nsp.getter("find", query);
        });
      };

      Model.prototype.count = function(query) {
        if (query == null) {
          query = {};
        }
        return this.onceLoaded.then(function(nsp) {
          return nsp.getter("count", query);
        });
      };

      Model.prototype.insert = function(obj) {
        return this.onceLoaded.then(function(nsp) {
          return nsp.getter("insert", obj);
        });
      };

      Model.prototype.update = function(obj) {
        return this.onceLoaded.then(function(nsp) {
          return nsp.getter("update", obj);
        });
      };

      Model.prototype.remove = function(obj) {
        return this.onceLoaded.then(function(nsp) {
          return nsp.getter("remove", obj);
        });
      };

      return Model;

    })();
  };

}).call(this);
