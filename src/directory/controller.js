angular.module('prim').controller('getDirectory', function(Directory, $scope, Utils) {

    Directory.get(function(data) {
        $scope.data = data;
    }, function(error) {
        Utils.apiError(error.status);
    });

    // predicate for sorting
    $scope.predicate = '-last_post';

});
