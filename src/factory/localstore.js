// the store that holds our local ib data
angular.module('prim').factory('LocalStore', function(store, config) {
    var localstore = 'ib' + config.ib_id;
    return store.getNamespacedStore(localstore);
});
