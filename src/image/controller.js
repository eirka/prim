angular.module('prim').controller('ImageCtrl', function($scope, $routeParams, $location, $filter, Handlers, UserHandlers, ModHandlers, toaster, user_messages, hotkeys, Utils, AuthService, config, internal) {

    // using controllerAs
    var self = this;

    // if mod controls should be shown or not
    self.showModControls = AuthService.showModControls();

    // Get the image json from pram
    Handlers.image.get({
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
    });

    // check to see if an image is starred or not
    self.checkFavorite = function() {
        UserHandlers.favorite.get({
            id: $routeParams.id
        }, function(data) {
            self.starred = data.starred;
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

    // if authed check fav state
    if ($scope.authState.isAuthenticated) {
        self.checkFavorite();
    }

    self.tagList = {};

    // async tag search
    self.searchTags = function(term) {
        return Handlers.tagsearch.get({
            search: term
        }).$promise.then(function(data) {
            return self.tagList = $filter('limitTo')(data.tagsearch, 6);
        });
    };

    // handles the input for ui-bootstrap typeahead, its broken otherwise
    self.formatLabel = function(model) {
        var tag;
        angular.forEach(self.tagList, function(value) {
            if (angular.equals(model, value.id)) {
                tag = value.tag;
            }
        });
        return tag;
    };

    // Update image json
    self.updateTags = function() {
        Handlers.image.get({
            id: $routeParams.id
        }, function(data) {
            self.tags = data.image.tags;
            self.selected = null;
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

    // Add a tag to the image and update list
    self.addTag = function() {
        if (angular.isNumber(self.selected) && angular.equals((self.selected % 1), 0)) {
            Handlers.addtag.save({
                tag: self.selected,
                image: self.data.image.id,
                ib: config.ib_id,
                askey: internal.as_key
            }, function(data) {
                self.updateTags();
                toaster.pop('success', data.success_message);
            }, function(error) {
                toaster.pop('error', error.data.error_message);
            });
        } else {
            toaster.pop('error', user_messages.noTag);
        }

    };

    // Function for deleting a tag, updates tag list on success
    self.deleteTag = function(image_id, tag_id) {
        if (confirm("Are you sure you want to delete this tag?")) {
            ModHandlers.deleteimagetag.delete({
                image: image_id,
                tag: tag_id
            }, function(data) {
                self.updateTags();
                toaster.pop('success', data.success_message);
            }, function(error) {
                toaster.pop('error', error.data.error_message);
            });
        };
    };

    // Add an image to a users favorite list
    self.addFavorite = function() {
        UserHandlers.addfavorite.save({
            image: self.data.image.id
        }, function(data) {
            // refresh star state
            self.checkFavorite();
            toaster.pop('success', data.success_message);
        }, function(error) {
            toaster.pop('error', error.data.error_message);
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
