angular.module('prim').controller('getTagList', function(config, internal, TagList, TagTypes, NewTag, $scope, Utils) {

    // Get tag types for selector
    TagTypes.get(function(data) {
        $scope.tagTypes = data.tagtypes;
    }, function(error) {
        Utils.apiError(error.status);
    });

    // get taglist json
    $scope.updateTags = function() {
        $scope.data = TagList.get();
        $scope.error = null;
    };

    $scope.updateTags();

    // Function for adding a tag, updates tag list on success
    $scope.newTag = function() {
        NewTag.save({
            name: $scope.name,
            type: $scope.selected,
            ib: config.ib_id,
            askey: internal.as_key
        }, function() {
            $scope.updateTags();
        }, function(error) {
            $scope.error = error.data;
        });
    };

    // predicate for sorting
    $scope.predicate = 'total';

});
