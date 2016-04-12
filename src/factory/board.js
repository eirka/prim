// functions to help control per board data
angular.module('prim').factory('BoardData', function($rootScope, LocalStore) {

    // our ibdata store key
    var ibstorename = 'data';

    var BoardData = {
        // create a new authstate object
        new: function(group) {
            return {
                group: group
            };
        },
        // return the default settings
        default: function() {
            return BoardData.set(1);
        },
        // set rootscope authstate with new parameters
        set: function(group) {
            $rootScope.ibData = BoardData.new(group);
        },
        // get current authstate object
        get: function() {
            return $rootScope.ibData;
        },
        // reset back to default
        reset: function() {
            $rootScope.ibData = BoardData.default();
        },
        // saves the user cache
        saveIbData: function() {
            LocalStore.set(ibstorename, BoardData.get());
        },
        // gets the user cache
        getIbData: function() {
            return LocalStore.get(ibstorename);
        }
    };

    return BoardData;

});
