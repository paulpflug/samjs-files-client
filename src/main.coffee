# out: ../lib/main.js
module.exports = (samjs) ->
  _plugins = []
  samjs.Mongo = class Model
    constructor: (name)->
      @onceLoaded = samjs.io.onceLoaded
        .then (nsp) -> return nsp("/#{name}")
      @onceLoaded.then (nsp) =>
        nsp.socket.on "inserted", (id) =>
          @emit "inserted", id
        nsp.socket.on "updated", (id) =>
          @emit "updated", id
        nsp.socket.on "removed", (id) =>
          @emit "removed", id
      samjs.events(@)
      for plugin in _plugins
        plugin.bind(@)()
    @plugins: (plugins...) ->
      for plugin in samjs.parseSplats(plugins)
        _plugins.push plugin
    find: (query={}) =>
      @onceLoaded.then (nsp) ->
        nsp.getter("find", query)

    count: (query={}) =>
      @onceLoaded.then (nsp) ->
        nsp.getter("count", query)

    insert: (obj) =>
      @onceLoaded.then (nsp) ->
        nsp.getter("insert", obj)

    update: (obj) =>
      @onceLoaded.then (nsp) ->
        nsp.getter("update", obj)

    remove: (obj) =>
      @onceLoaded.then (nsp) ->
        nsp.getter("remove", obj)
