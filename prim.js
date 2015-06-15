/*global angular:true */

var prim = angular.module('Prim', ['ui.bootstrap', 'ngSanitize', 'ngRoute', 'ngResource', 'ngMessages']);

// Internal constants
prim.constant('internal', {
    // Set antispam key
    as_key: 'j5ebMACL'
});

prim.config(['$routeProvider', '$locationProvider', '$compileProvider', function($routeProvider, $locationProvider, $compileProvider) {
        $routeProvider
            .when('/', {
                title: 'Index',
                templateUrl: '/pages/main.html',
                controller: 'getIndex'
            })
            .when('/page/:id', {
                title: 'Index',
                templateUrl: '/pages/main.html',
                controller: 'getIndex'
            })
            .when('/thread/:id/:page', {
                templateUrl: '/pages/thread.html',
                controller: 'getThread'
            })
            .when('/post/:id/:post', {
                templateUrl: '/pages/post.html',
                controller: 'getPost'
            })
            .when('/directory', {
                title: 'Threads',
                templateUrl: '/pages/directory.html',
                controller: 'getDirectory'
            })
            .when('/image/:id', {
                templateUrl: '/pages/image.html',
                controller: 'getImage'
            })
            .when('/tags', {
                title: 'Tags',
                templateUrl: '/pages/tags.html',
                controller: 'getTagList'
            })
            .when('/tag/:id/:page', {
                templateUrl: '/pages/tag.html',
                controller: 'getTag'
            })
            .when('/error', {
                templateUrl: '/pages/error.html',
                controller: 'errorHandler'
            })
            .otherwise({
                redirectTo: '/error'
            });

        $compileProvider.debugInfoEnabled(false);
        $locationProvider.html5Mode(true);
    }
]);

prim.run(['config', '$rootScope', function(config, $rootScope) {
        // Add page.title scope for dynamic page titles
        $rootScope.page = {
            setTitle: function(title) {
                this.title = title + ' | ' + config.title;
            }
        };

        // Change page title on route change
        $rootScope.$on('$routeChangeSuccess', function(event, current) {
            $rootScope.page.setTitle(current.$$route.title || '');
        });
    }
]);

// Index json
prim.service('Index', ['$resource', 'config', function($resource, config) {
        return $resource('/api/get/index/:ib/:id', {
            ib: config.ib_id,
            id: '@id'
        }, {
            get: {
                method: 'GET'
            }
        });
    }
]);


// Taglist json
prim.service('TagList', ['$resource', 'config', function($resource, config) {
        return $resource('/api/get/tags/:ib', {
            ib: config.ib_id
        }, {
            get: {
                method: 'GET'
            }
        });
    }
]);

// Directory json
prim.service('Directory', ['$resource', 'config', function($resource, config) {
        return $resource('/api/get/directory/:ib', {
            ib: config.ib_id
        }, {
            get: {
                method: 'GET'
            }
        });
    }
]);

// Thread json
prim.service('Thread', ['$resource', 'config', function($resource, config) {
        return $resource('/api/get/thread/:ib/:id/:page', {
            ib: config.ib_id,
            id: '@id',
            page: '@page'
        }, {
            get: {
                method: 'GET'
            }
        });
    }
]);

// Single post json
prim.service('Post', ['$resource', 'config', function($resource, config) {
        return $resource('/api/get/post/:ib/:thread/:id', {
            ib: config.ib_id,
            thread: '@thread',
            id: '@id'
        }, {
            get: {
                method: 'GET',
                cache: true
            }
        });
    }
]);

// Single image json
prim.service('Image', ['$resource', 'config', function($resource, config) {
        return $resource('/api/get/image/:ib/:id', {
            ib: config.ib_id,
            id: '@id'
        }, {
            get: {
                method: 'GET'
            }
        });
    }
]);

// Tag types list json
prim.service('TagTypes', ['$resource', function($resource) {
        return $resource('/api/get/tagtypes', {}, {
            get: {
                method: 'GET',
                cache: true
            }
        });
    }
]);

// Single tag json
prim.service('Tag', ['$resource', 'config', function($resource, config) {
        return $resource('/api/get/tag/:ib/:id/:page', {
            ib: config.ib_id,
            id: '@id',
            page: '@page'
        }, {
            get: {
                method: 'GET'
            }
        });
    }
]);

// Add tag to image
prim.service('AddTag', ['$resource', function($resource) {
        return $resource('/api/post/tag/add', {}, {
            save: {
                method: 'POST'
            }
        });
    }
]);

// Create tag
prim.service('NewTag', ['$resource', function($resource) {
        return $resource('/api/post/tag/new', {}, {
            save: {
                method: 'POST'
            }
        });
    }
]);

// Add to top button
prim.directive('topBox', function() {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'pages/totop.html',
            controller: ['$scope', '$window', function($scope, $window) {
                angular.element($window).bind("scroll", function() {
                    $scope.showbox = false;

                    if (window.pageYOffset > 300) {
                        $scope.showbox = true;
                    } else {
                        $scope.showbox = false;
                    }

                    $scope.$applyAsync();

                });

                $scope.scrollToTop = function() {

                    $window.scrollTo(0, 0);

                };

            }]
        };
    });

// Compiles quote links and adds hover box
prim.directive('quoteBox', ['Post', '$compile', function(Post, $compile) {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                ids: '=',
                thread: '='
            },
            templateUrl: "pages/hover.html",
            link: function($scope, $element, $attrs) {
                // Compile link html from commenthandler
                var element = angular.element($scope.links);
                var test = $compile(element)($scope);
                element.append(test);

                // Hoverbox code
                $scope.show = {};
                $scope.show.card = false;
                $scope.hoverTmplUrl = $attrs.hoverTmplUrl;
                $scope.onHoverIn = $scope.$eval($attrs.onHoverIn);
                $scope.onHoverOut = $scope.$eval($attrs.onHoverOut);

                // Get single post on hover
                $scope.getPost = function(post_id) {
                    Post.get({
                        thread: $scope.thread.id,
                        id: post_id
                    }, function(data) {
                        $scope.quotebox = data;
                    });
                };

            }

        };
    }
]);

// Uses regex to grab quote from comment
prim.directive('commentHandler', function() {
        return {
            restrict: 'A',
            scope: {
                post: '=',
                thread: '='
            },
            templateUrl: "pages/comment.html",
            controller: ['$scope', function($scope) {
                // Match quote format
                var re = /(>>(\d{1,4}))/;
                var raw = $scope.post.comment;
                var html = [];
                var id = [];
                var match;

                function addText(text) {
                    html.push(text);
                }

                // makes a link
                function addLink(url) {
                    //link.push('<a href="post/' + $scope.thread.id + '/' + url + '">' + text + '</a> ');
                    id.push(url);
                }

                // Run regex on comment and grab matches
                while (match = raw.match(re)) {
                    // Get second group (just the post num)
                    var url = match[2];
                    var i = match.index;
                    // Add non matches to html array
                    addText(raw.substr(0, i));
                    // Create link with matches
                    addLink(url, match[0]);
                    raw = raw.substring(i + match[0].length);
                }

                addText(raw);
                // join the html array and sanitize
                $scope.post.comment = html.join('');
                // add link to scope
                //$scope.post.quote_link = link;
                // add post num to scope
                $scope.post.quote_id = id;

            }]
        };
    });

// Handles passing messages between controllers
prim.factory('MessageHandler', ['$location', function($location) {

        // holds the quote text
        var commentQuote = "";
        // holds the error code
        var errorCode = "";

        return {
            // sets the quote
            setQuote: function(quote) {
                commentQuote += ">>" + quote + " ";
            },
            // gets the quote
            getQuote: function() {
                return commentQuote
            },
            clearQuote: function() {
                commentQuote = ""
            },
            // sets the error code from the request and forwards to error page
            apiError: function(code) {
                errorCode = code
                $location.path('/error');
            },
            // gets the error code
            getError: function() {
                return errorCode
            }
        }
    }
]);

// Handle errors
prim.controller('errorHandler', ['$scope', 'MessageHandler', function($scope, MessageHandler) {

        $scope.errorcode = MessageHandler.getError()

        if ($scope.errorcode === "") {
            $scope.errorcode = "???"
        }

        switch ($scope.errorcode) {
            case 404:
                $scope.page.setTitle("Not Found");
                break;
            case 502:
                $scope.page.setTitle("API Down");
                break;
            default:
                $scope.page.setTitle("Error");
                break;
        }

    }
]);

// Get a thread
prim.controller('getThread', ['config', 'internal', 'Thread', '$window', '$location', '$scope', '$routeParams', 'MessageHandler', function(config, internal, Thread, $window, $location, $scope, $routeParams, MessageHandler) {

        $scope.as_key = internal.as_key;
        $scope.ib_id = config.ib_id;
        // Variable for grid or list view as default
        $scope.layout = 'list';

        // if there is no page number go to page 1
        if (!$routeParams.page) {
            $routeParams.page = 1;
        }

        $scope.quote = MessageHandler.getQuote()

        // clear the quote if page change
        $scope.$on('$locationChangeStart', function() {
            MessageHandler.clearQuote();
        });

        // Get thread json and set scope
        Thread.get({
            id: $routeParams.id,
            page: $routeParams.page
        }, function(data) {
            $scope.data = data;
            $scope.thread = data.thread.items;
            // Set page title from thread title
            $scope.page.setTitle($scope.thread.title);
            // Pagination items from json
            $scope.totalItems = data.thread.total;
            $scope.currentPage = data.thread.current_page;
            $scope.numPages = data.thread.pages;
            $scope.itemsPerPage = data.thread.per_page;
            $scope.maxSize = 3;

        }, function(error) {
            MessageHandler.apiError(error.status)
        });

        // add post num to comment box
        $scope.replyQuote = function(id) {
            MessageHandler.setQuote(id);
            $scope.quote = MessageHandler.getQuote()
            $window.scrollTo(0, 0);
        };

    }
]);

// Gets the thread directory
prim.controller('getDirectory', ['Directory', '$scope', 'MessageHandler', function(Directory, $scope, MessageHandler) {

        Directory.get(function(data) {
            $scope.data = data;
        }, function(error) {
            MessageHandler.apiError(error.status)
        });

        // predicate for sorting
        $scope.predicate = '-last_post';

    }
]);

// Gets a post
prim.controller('getPost', ['Post', '$location', '$routeParams', '$scope', 'MessageHandler', function(Post, $location, $routeParams, $scope, MessageHandler) {

        // Get tag page json
        Post.get({
            thread: $routeParams.id,
            id: $routeParams.post
        }, function(data) {
            $scope.data = data;
            $scope.post = data.post;
            // Set page title with tag name
            $scope.page.setTitle('Post ' + $scope.post.thread_id + '/' + $scope.post.num);

            $scope.replyQuote = function(id, thread, last) {
                MessageHandler.setQuote(id);
                $location.path('/thread/' + thread + '/' + last);
            };

        }, function(error) {
            MessageHandler.apiError(error.status)
        });


    }
]);

// Gets tag list
prim.controller('getTagList', ['config', 'internal', 'TagList', 'TagTypes', 'NewTag', '$scope', 'MessageHandler', function(config, internal, TagList, TagTypes, NewTag, $scope, MessageHandler) {

        // Get tag types for selector
        TagTypes.get(function(data) {
            $scope.tagTypes = data.tagtypes;
        }, function(error) {
            MessageHandler.apiError(error.status)
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

    }
]);

// Get single image
prim.controller('getImage', ['config', 'internal', 'Image', 'TagList', 'AddTag', '$routeParams', '$scope', 'MessageHandler', function(config, internal, Image, TagList, AddTag, $routeParams, $scope, MessageHandler) {

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

            $scope.webm = '/src/' + $scope.image.filename;
        }, function(error) {
            MessageHandler.apiError(error.status)
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

    }

]);

// Gets tag page
prim.controller('getTag', ['$scope', 'Tag', '$routeParams', 'MessageHandler', function($scope, Tag, $routeParams, MessageHandler) {

        // Get tag page json
        Tag.get({
            id: $routeParams.id,
            page: $routeParams.page
        }, function(data) {
            $scope.data = data;
            $scope.tag = data.tag.items;

            // Pagination items from json
            $scope.totalItems = data.tag.total;
            $scope.currentPage = data.tag.current_page;
            $scope.numPages = data.tag.pages;
            $scope.itemsPerPage = data.tag.per_page;
            $scope.maxSize = 3;

            // Set page title with tag name
            $scope.page.setTitle($scope.tag.tag);
        }, function(error) {
            MessageHandler.apiError(error.status)
        });

    }
]);

// Get index page 
prim.controller('getIndex', ['config', 'internal', '$scope', '$location', 'Index', '$routeParams', 'MessageHandler', function(config, internal, $scope, $location, Index, $routeParams, MessageHandler) {

        $scope.as_key = internal.as_key;
        // Set imageboard id
        $scope.ib_id = config.ib_id;

        // if there is no page number go to page 1
        if (!$routeParams.id) {
            $routeParams.id = 1;
        }

        // Get index json
        Index.get({
            id: $routeParams.id
        }, function(data) {
            $scope.data = data;

            // Pagination items from json
            $scope.totalItems = data.index.total;
            $scope.currentPage = data.index.current_page;
            $scope.numPages = data.index.pages;
            $scope.itemsPerPage = data.index.per_page;
            $scope.maxSize = 5;

            // Add quote post num to scope and forward to threads last page
            $scope.replyQuote = function(id, thread, last) {
                MessageHandler.setQuote(id);
                $location.path('/thread/' + thread + '/' + last);
            };

        }, function(error) {
            MessageHandler.apiError(error.status)
        });

    }
]);
