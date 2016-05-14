// the store that holds our global data
angular.module('prim').factory('GlobalStore', function(store) {
    return store.getNamespacedStore('global');
});
