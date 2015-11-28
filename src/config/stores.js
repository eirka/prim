// the store that holds our global data
angular.module('prim').factory('GlobalStore', function(store) {
    return store.getNamespacedStore('global');
});

// the store that holds our local ib data
angular.module('prim').factory('LocalStore', function(store, config) {
    var localstore = 'ib' + config.ib_id;
    return store.getNamespacedStore(localstore);
});
