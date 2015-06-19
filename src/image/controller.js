angular.module('prim').controller('getImage', function(config, internal, Image, TagList, AddTag, $routeParams, $scope, Utils) {

    // generate image src link
    $scope.getImgSrc = Utils.getImgSrc;

    // Get the image json
    Image.get({
        id: $routeParams.id
    }, function(data) {
        $scope.data = data;
        $scope.image = data.image;
        // Set page title from image id
        $scope.page.setTitle('Image ' + $scope.image.id);
        $scope.tags = data.image.tags;
        $scope.ext = data.image.filename.split('.').pop();

    }, function(error) {
        Utils.apiError(error.status);
    });

    // Get taglist
    TagList.get(function(data) {
        $scope.tagList = data.tags;
    });

    $scope.tagList = {};

    // handles the input for the typeahead, its broken otherwise
    function inputFormat(model) {
        for (var i = 0; i < $scope.tagList.length; i++) {
            if (model === $scope.tagList[i].id) {
                return $scope.tagList[i].tag;
            }
        }
    }

    $scope.formatLabel = inputFormat;

    // Update image tags json
    $scope.updateTags = function() {
        Image.get({
            id: $routeParams.id
        }, function(data) {
            $scope.tags = data.image.tags;
            $scope.error = null;
            $scope.selected = null;
        });
    };

    // Add a tag to the image and update list
    $scope.addTag = function() {

        if (typeof $scope.selected === 'number' && ($scope.selected % 1) === 0) {
            AddTag.save({
                tag: $scope.selected,
                image: $scope.image.id,
                ib: config.ib_id,
                askey: internal.as_key
            }, function() {
                $scope.updateTags();
            }, function(error) {
                $scope.error = error.data;
            });
        } else {
            $scope.data.error_message = 'Tag does not exist';
            $scope.error = $scope.data;
        }

    };

});
