angular.module('prim').controller('ImageCtrl', function($scope, $routeParams, $location, hotkeys, ImageHandler, ImageAddTag, TagsHandler, ImageAddFavorite, ImageGetFavorite, Utils, config, internal) {

    // using controllerAs
    var self = this;

    // Get the image json from pram
    ImageHandler.get({
        id: $routeParams.id
    }, function(data) {
        self.data = data;
        // Set page title from image id
        $scope.page.setTitle('Image ' + self.data.image.id);
        self.tags = data.image.tags;
        // generate image src link
        self.src = Utils.getImgSrc(data.image.filename);
        // get file ext to check if video or image
        self.ext = data.image.filename.split('.').pop();
    }, function(error) {
        Utils.apiError(error.status);
    });

    // check to see if an image is starred or not
    self.checkFavorite = function() {
        ImageGetFavorite.get({
            id: $routeParams.id
        }, function(data) {
            self.starred = data.starred;
        }, function(error) {
            self.error = error.data;
        });
    };

    // if authed check fav state
    if ($scope.authState.isAuthenticated) {
        self.checkFavorite();
    }

    self.tagList = {};

    // Get taglist for typeahead
    TagsHandler.get(function(data) {
        self.tagList = data.tags;
    }, function(error) {
        self.error = error.data;
    });

    // handles the input for ui-bootstrap typeahead, its broken otherwise
    self.formatLabel = function(model) {
        for (var i = 0; i < self.tagList.length; i++) {
            if (model === self.tagList[i].id) {
                return self.tagList[i].tag;
            }
        }
    };

    // Update image json
    self.updateTags = function() {
        ImageHandler.get({
            id: $routeParams.id
        }, function(data) {
            self.tags = data.image.tags;
            self.error = null;
            self.selected = null;
        }, function(error) {
            self.error = error.data;
        });
    };

    // Add a tag to the image and update list
    self.addTag = function() {
        if (typeof self.selected === 'number' && (self.selected % 1) === 0) {
            ImageAddTag.save({
                tag: self.selected,
                image: self.data.image.id,
                ib: config.ib_id,
                askey: internal.as_key
            }, function() {
                self.updateTags();
            }, function(error) {
                self.error = error.data;
            });
        } else {
            self.data.error_message = 'Tag does not exist';
            self.error = self.data;
        }

    };

    // Add an image to a users favorite list
    self.addFavorite = function() {
        ImageAddFavorite.save({
            image: self.data.image.id
        }, function(data) {
            // refresh star state
            self.checkFavorite();
        }, function(error) {
            self.error = error.data;
        });
    };

    hotkeys.bindTo($scope)
        .add({
            combo: 'left',
            description: 'Previous Image',
            callback: function() {
                if (self.data.image.prev) {
                    $location.path('/image/' + self.data.image.prev);
                }
            }
        })
        .add({
            combo: 'right',
            description: 'Next Image',
            callback: function() {
                if (self.data.image.next) {
                    $location.path('/image/' + self.data.image.next);
                }
            }
        });


});
