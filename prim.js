/*global angular:true */
/*
               __                
 _____   _ __ /\_\    ___ ___    
/\ '__`\/\`'__\/\ \ /' __` __`\  
\ \ \L\ \ \ \/ \ \ \/\ \/\ \/\ \ 
 \ \ ,__/\ \_\  \ \_\ \_\ \_\ \_\
  \ \ \/  \/_/   \/_/\/_/\/_/\/_/
   \ \_\                         
    \/_/                         
           Prim 1.1.8
*/
var prim = angular.module('Prim', ['ngSanitize', 'ngRoute', 'ngResource']);

prim.config(['$routeProvider', '$locationProvider', '$compileProvider',
  function($routeProvider, $locationProvider, $compileProvider) {
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
      .otherwise({
        redirectTo: '/'
      });

    $compileProvider.debugInfoEnabled(false);
    $locationProvider.html5Mode(true);
  }
]);

prim.run(['config', '$rootScope',
  function(config, $rootScope) {
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

    // Scope for index quote to reply page
    $rootScope.reply = {
      setQuote: function(quote) {
        this.quote = ">>" + quote + " ";
      }
    };

  }
]);

// Index json
prim.service('Index', ['$resource', 'config',
  function($resource, config) {
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
prim.service('TagList', ['$resource', 'config',
  function($resource, config) {
    return $resource('/api/get/tags/:ib', {
      ib: config.ib_id
    }, {
      get: {
        method: 'GET',
        cache: true
      }
    });
  }
]);

// Directory json
prim.service('Directory', ['$resource', 'config',
  function($resource, config) {
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
prim.service('Thread', ['$resource',
  function($resource) {
    return $resource('/api/get/thread/:id/:page', {
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
prim.service('Post', ['$resource',
  function($resource) {
    return $resource('/api/get/post/:thread/:id', {
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
prim.service('Image', ['$resource',
  function($resource) {
    return $resource('/api/get/image/:id', {
      id: '@id'
    }, {
      get: {
        method: 'GET'
      }
    });
  }
]);

// Tag types list json
prim.service('TagTypes', ['$resource',
  function($resource) {
    return $resource('/api/get/tagtypes', {}, {
      get: {
        method: 'GET',
        cache: true
      }
    });
  }
]);

// Single tag json
prim.service('Tag', ['$resource',  'config',
  function($resource, config) {
    return $resource('/api/get/tag/:id/:page', {
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
prim.service('AddTag', ['$resource',
  function($resource) {
    return $resource('/api/post/tag/add', {}, {
      save: {
        method: 'POST'
      }
    });
  }
]);

// Create tag
prim.service('NewTag', ['$resource',
  function($resource) {
    return $resource('/api/post/tag/new', {}, {
      save: {
        method: 'POST'
      }
    });
  }
]);

// Add to top button
prim.directive('topBox', [
  function() {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'pages/totop.html',
      controller: function($scope, $window) {
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

      }
    };
  }
]);

// Compiles quote links and adds hover box
prim.directive('quoteBox', ['Post', '$compile',
  function(Post, $compile) {
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
prim.directive('commentHandler', [
  function() {
    return {
      restrict: 'A',
      scope: {
        post: '=',
        thread: '='
      },
      templateUrl: "pages/comment.html",
      controller: function($scope) {
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

      }
    };
  }
]);

// Get a thread
prim.controller('getThread', ['config', 'Thread', '$window', '$location', '$scope', '$routeParams',
  function(config, Thread, $window, $location, $scope, $routeParams) {

    $scope.as_key = config.as_key;
    $scope.ib_id = config.ib_id;
    // Variable for grid or list view as default
    $scope.layout = 'list';

    // if there is no page number go to page 1
    if (!$routeParams.page) {
      $routeParams.page = 1;
    }

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

    });

    // add post num to comment box
    $scope.replyQuote = function(id) {
      $scope.reply.setQuote(id);
      $window.scrollTo(0,0);
    };

  }
]);

// Gets the thread directory
prim.controller('getDirectory', ['Directory', '$scope', 
  function(Directory, $scope) {

    $scope.data = Directory.get();

    // predicate for sorting
    $scope.predicate = '-last_post';

  }
]);

// Gets a post
prim.controller('getPost', ['Post', '$location', '$routeParams', '$scope',
  function(Post, $location, $routeParams, $scope) {

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
        $scope.reply.setQuote(id);
        $location.path('/thread/' + thread + '/' + last);
      };

    });


  }
]);

// Gets tag list
prim.controller('getTagList', ['config', 'TagList', 'TagTypes', 'NewTag', '$scope',
  function(config, TagList, TagTypes, NewTag, $scope) {

    // Get tag types for selector
    TagTypes.get(function(data) {
      $scope.tagTypes = data.tagtypes;
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
        askey: config.as_key
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
prim.controller('getImage', ['config', 'Image', 'TagList', 'AddTag', '$routeParams', '$scope',
  function(config, Image, TagList, AddTag, $routeParams, $scope) {

    // Get the image json
    Image.get({
      id: $routeParams.id
    }, function(data) {
      $scope.data = data;
      $scope.image = data.image;
      $scope.site_addr = config.site_addr;
      // Set page title from image id
      $scope.page.setTitle('Image ' + $scope.image.id);
      $scope.tags = data.image.tags;
      $scope.ext = data.image.filename.split('.').pop();

      $scope.webm = '/src/' + $scope.image.filename;
    });

    // Get taglist
    TagList.get(function(data) {
      $scope.tagList = data.tags;
    });

$scope.tagList = {};

  // handles the input for the typeahead, its broken otherwise
  function inputFormat(model) {
    for (var i=0; i< $scope.tagList.length; i++) {
      if (model === $scope.tagList[i].id) {
        return $scope.tagList[i].tag;
      }
    }
  };

$scope.formatLabel = inputFormat;

    // Update image tags json
    $scope.updateTags = function() {
      Image.get({
        id: $routeParams.id
      }, function(data) {
        $scope.tags = data.image.tags;
        $scope.error = null;
      });
    };

    // Add a tag to the image and update list
    $scope.addTag = function() {

if (typeof $scope.selected==='number' && ($scope.selected%1)===0) {
      AddTag.save({
        tag: $scope.selected,
        image: $scope.image.id,
        ib: config.ib_id,
        askey: config.as_key
      }, function() {
        $scope.updateTags();
      }, function(error) {
        $scope.error = error.data;
      });
} else {
$scope.data.error_message = 'Input error';
$scope.error = $scope.data;
}

    };

  }

]);

// Gets tag page
prim.controller('getTag', ['$scope', 'Tag', '$routeParams',
  function($scope, Tag, $routeParams) {

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
    });

  }
]);

// Get index page 
prim.controller('getIndex', ['config', '$scope', '$location', 'Index', '$routeParams',
  function(config, $scope, $location, Index, $routeParams) {

    $scope.as_key = config.as_key;
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
      $scope.data = data

      // Pagination items from json
      $scope.totalItems = data.index.total;
      $scope.currentPage = data.index.current_page;
      $scope.numPages = data.index.pages;
      $scope.itemsPerPage = data.index.per_page;
      $scope.maxSize = 5;

      // Add quote post num to scope and forward to threads last page
      $scope.replyQuote = function(id, thread, last) {
        $scope.reply.setQuote(id);
        $location.path('/thread/' + thread + '/' + last);
      };

    });

  }
]);

// Pagination from Angular-UI
prim.run(["$templateCache", function($templateCache) {
  $templateCache.put("template/pagination/pagination.html",
    "<ul class=\"pagination\">\n" +
    "  <li ng-if=\"allLink\"><a href=\"{{ pageName }}/0\">All</a></li>\n" +
    "  <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noPrevious()}\"><a href=\"{{ pageName }}/1\">{{getText('first')}}</a></li>\n" +
    "  <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active}\"><a href=\"{{ pageName }}/{{page.number}}\">{{page.text}}</a></li>\n" +
    "  <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: noNext()}\"><a href=\"{{ pageName }}/{{totalPages}}\">{{getText('last')}}</a></li>\n" +
    "</ul>");
}]);

prim.controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

  this.init = function(ngModelCtrl_, config) {
    ngModelCtrl = ngModelCtrl_;
    this.config = config;

    ngModelCtrl.$render = function() {
      self.render();
    };

    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = config.itemsPerPage;
    }
  };

  this.calculateTotalPages = function() {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.render = function() {
    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
  };

  $scope.selectPage = function(page) {
    if ( $scope.page !== page && page > 0 && page <= $scope.totalPages) {
      ngModelCtrl.$setViewValue(page);
      ngModelCtrl.$render();
    }
  };

  $scope.getText = function( key ) {
    return $scope[key + 'Text'] || self.config[key + 'Text'];
  };
  $scope.noPrevious = function() {
    return $scope.page === 1;
  };
  $scope.noNext = function() {
    return $scope.page === $scope.totalPages;
  };

  $scope.$watch('totalItems', function() {
    $scope.totalPages = self.calculateTotalPages();
  });

  $scope.$watch('totalPages', function(value) {
    setNumPages($scope.$parent, value); // Readonly variable

    if ( $scope.page > value ) {
      $scope.selectPage(value);
    } else {
      ngModelCtrl.$render();
    }
  });
}])

.constant('paginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true
});

prim.directive('pagination', ['$parse', 'paginationConfig', function($parse, paginationConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      firstText: '@',
      previousText: '@',
      nextText: '@',
      lastText: '@',
      pageName: '@',
      allLink: '@'
    },
    require: ['pagination', '?ngModel'],
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pagination.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      // Setup configuration parameters
      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

      paginationCtrl.init(ngModelCtrl, paginationConfig);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      }

      // Create page object used in template
      function makePage(number, text, isActive) {
        return {
          number: number,
          text: text,
          active: isActive
        };
      }

      function getPages(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1, endPage = totalPages;
        var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

        // recompute if maxSize
        if ( isMaxSized ) {
          if ( rotate ) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
            endPage   = startPage + maxSize - 1;

            // Adjust if limit is exceeded
            if (endPage > totalPages) {
              endPage   = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, number === currentPage);
          pages.push(page);
        }

        // Add links to move between page sets
        if ( isMaxSized && ! rotate ) {
          if ( startPage > 1 ) {
            var previousPageSet = makePage(startPage - 1, '...', false);
            pages.unshift(previousPageSet);
          }

          if ( endPage < totalPages ) {
            var nextPageSet = makePage(endPage + 1, '...', false);
            pages.push(nextPageSet);
          }
        }

        return pages;
      }

      var originalRender = paginationCtrl.render;
      paginationCtrl.render = function() {
        originalRender();
        if (scope.page > 0 && scope.page <= scope.totalPages) {
          scope.pages = getPages(scope.page, scope.totalPages);
        }
      };
    }
  };
}]);


// Typeahead from Angular-UI
  prim.factory('$position', ['$document', '$window', function ($document, $window) {

    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, 'position') || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl !== $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        };
      },

      /**
       * Provides coordinates for the targetEl in relation to hostEl
       */
      positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

        var positionStrParts = positionStr.split('-');
        var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

        var hostElPos,
          targetElWidth,
          targetElHeight,
          targetElPos;

        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

        targetElWidth = targetEl.prop('offsetWidth');
        targetElHeight = targetEl.prop('offsetHeight');

        var shiftWidth = {
          center: function () {
            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
          },
          left: function () {
            return hostElPos.left;
          },
          right: function () {
            return hostElPos.left + hostElPos.width;
          }
        };

        var shiftHeight = {
          center: function () {
            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
          },
          top: function () {
            return hostElPos.top;
          },
          bottom: function () {
            return hostElPos.top + hostElPos.height;
          }
        };

        switch (pos0) {
          case 'right':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: shiftWidth[pos0]()
            };
            break;
          case 'left':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: hostElPos.left - targetElWidth
            };
            break;
          case 'bottom':
            targetElPos = {
              top: shiftHeight[pos0](),
              left: shiftWidth[pos1]()
            };
            break;
          default:
            targetElPos = {
              top: hostElPos.top - targetElHeight,
              left: shiftWidth[pos1]()
            };
            break;
        }

        return targetElPos;
      }
    };
  }]);


  prim.directive('bindHtmlUnsafe', function () {
    return function (scope, element, attr) {
      element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe);
      scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
        element.html(value || '');
      });
    };
  });

  prim.factory('typeaheadParser', ['$parse', function ($parse) {

  //                      00000111000000000000022200000000000000003333333333333330000000000044000
  var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;

  return {
    parse:function (input) {

      var match = input.match(TYPEAHEAD_REGEXP);
      if (!match) {
        throw new Error(
          'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
            ' but got "' + input + '".');
      }

      return {
        itemName:match[3],
        source:$parse(match[4]),
        viewMapper:$parse(match[2] || match[1]),
        modelMapper:$parse(match[1])
      };
    }
  };
}]);

  prim.directive('typeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$position', 'typeaheadParser',
    function ($compile, $parse, $q, $timeout, $document, $position, typeaheadParser) {

  var HOT_KEYS = [9, 13, 27, 38, 40];

  return {
    require:'ngModel',
    link:function (originalScope, element, attrs, modelCtrl) {

      //SUPPORTED ATTRIBUTES (OPTIONS)

      //minimal no of characters that needs to be entered before typeahead kicks-in
      var minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1;

      //minimal wait time after last character typed before typehead kicks-in
      var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

      //should it restrict model values to the ones selected from the popup only?
      var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

      //binding to a variable that indicates if matches are being retrieved asynchronously
      var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

      //a callback executed when a match is selected
      var onSelectCallback = $parse(attrs.typeaheadOnSelect);

      var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

      var appendToBody =  attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

      //INTERNAL VARIABLES

      //model setter executed upon match selection
      var $setModelValue = $parse(attrs.ngModel).assign;

      //expressions used by typeahead
      var parserResult = typeaheadParser.parse(attrs.typeahead);

      var hasFocus;

      //create a child scope for the typeahead directive so we are not polluting original scope
      //with typeahead-specific data (matches, query etc.)
      var scope = originalScope.$new();
      originalScope.$on('$destroy', function(){
        scope.$destroy();
      });

      // WAI-ARIA
      var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
      element.attr({
        'aria-autocomplete': 'list',
        'aria-expanded': false,
        'aria-owns': popupId
      });

      //pop-up element used to display matches
      var popUpEl = angular.element('<div typeahead-popup></div>');
      popUpEl.attr({
        id: popupId,
        matches: 'matches',
        active: 'activeIdx',
        select: 'select(activeIdx)',
        query: 'query',
        position: 'position'
      });
      //custom item template
      if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
        popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
      }

      var resetMatches = function() {
        scope.matches = [];
        scope.activeIdx = -1;
        element.attr('aria-expanded', false);
      };

      var getMatchId = function(index) {
        return popupId + '-option-' + index;
      };

      // Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
      // This attribute is added or removed automatically when the `activeIdx` changes.
      scope.$watch('activeIdx', function(index) {
        if (index < 0) {
          element.removeAttr('aria-activedescendant');
        } else {
          element.attr('aria-activedescendant', getMatchId(index));
        }
      });

      var getMatchesAsync = function(inputValue) {

        var locals = {$viewValue: inputValue};
        isLoadingSetter(originalScope, true);
        $q.when(parserResult.source(originalScope, locals)).then(function(matches) {

          //it might happen that several async queries were in progress if a user were typing fast
          //but we are interested only in responses that correspond to the current view value
          var onCurrentRequest = (inputValue === modelCtrl.$viewValue);
          if (onCurrentRequest && hasFocus) {
            if (matches.length > 0) {

              scope.activeIdx = 0;
              scope.matches.length = 0;

              //transform labels
              for(var i=0; i<matches.length; i++) {
                locals[parserResult.itemName] = matches[i];
                scope.matches.push({
                  id: getMatchId(i),
                  label: parserResult.viewMapper(scope, locals),
                  model: matches[i]
                });
              }

              scope.query = inputValue;
              //position pop-up with matches - we need to re-calculate its position each time we are opening a window
              //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
              //due to other elements being rendered
              scope.position = appendToBody ? $position.offset(element) : $position.position(element);
              scope.position.top = scope.position.top + element.prop('offsetHeight');

              element.attr('aria-expanded', true);
            } else {
              resetMatches();
            }
          }
          if (onCurrentRequest) {
            isLoadingSetter(originalScope, false);
          }
        }, function(){
          resetMatches();
          isLoadingSetter(originalScope, false);
        });
      };

      resetMatches();

      //we need to propagate user's query so we can higlight matches
      scope.query = undefined;

      //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later 
      var timeoutPromise;

      var scheduleSearchWithTimeout = function(inputValue) {
        timeoutPromise = $timeout(function () {
          getMatchesAsync(inputValue);
        }, waitTime);
      };

      var cancelPreviousTimeout = function() {
        if (timeoutPromise) {
          $timeout.cancel(timeoutPromise);
        }
      };

      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
      //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
      modelCtrl.$parsers.unshift(function (inputValue) {

        hasFocus = true;

        if (inputValue && inputValue.length >= minSearch) {
          if (waitTime > 0) {
            cancelPreviousTimeout();
            scheduleSearchWithTimeout(inputValue);
          } else {
            getMatchesAsync(inputValue);
          }
        } else {
          isLoadingSetter(originalScope, false);
          cancelPreviousTimeout();
          resetMatches();
        }

        if (isEditable) {
          return inputValue;
        } else {
          if (!inputValue) {
            // Reset in case user had typed something previously.
            modelCtrl.$setValidity('editable', true);
            return inputValue;
          } else {
            modelCtrl.$setValidity('editable', false);
            return undefined;
          }
        }
      });

      modelCtrl.$formatters.push(function (modelValue) {

        var candidateViewValue, emptyViewValue;
        var locals = {};

        if (inputFormatter) {

          locals['$model'] = modelValue;
          return inputFormatter(originalScope, locals);

        } else {

          //it might happen that we don't have enough info to properly render input value
          //we need to check for this situation and simply return model value if we can't apply custom formatting
          locals[parserResult.itemName] = modelValue;
          candidateViewValue = parserResult.viewMapper(originalScope, locals);
          locals[parserResult.itemName] = undefined;
          emptyViewValue = parserResult.viewMapper(originalScope, locals);

          return candidateViewValue!== emptyViewValue ? candidateViewValue : modelValue;
        }
      });

      scope.select = function (activeIdx) {
        //called from within the $digest() cycle
        var locals = {};
        var model, item;

        locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
        model = parserResult.modelMapper(originalScope, locals);
        $setModelValue(originalScope, model);
        modelCtrl.$setValidity('editable', true);

        onSelectCallback(originalScope, {
          $item: item,
          $model: model,
          $label: parserResult.viewMapper(originalScope, locals)
        });

        resetMatches();

        //return focus to the input element if a match was selected via a mouse click event
        // use timeout to avoid $rootScope:inprog error
        $timeout(function() { element[0].focus(); }, 0, false);
      };

      //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
      element.bind('keydown', function (evt) {

        //typeahead is open and an "interesting" key was pressed
        if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
          return;
        }

        evt.preventDefault();

        if (evt.which === 40) {
          scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
          scope.$digest();

        } else if (evt.which === 38) {
          scope.activeIdx = (scope.activeIdx ? scope.activeIdx : scope.matches.length) - 1;
          scope.$digest();

        } else if (evt.which === 13 || evt.which === 9) {
          scope.$apply(function () {
            scope.select(scope.activeIdx);
          });

        } else if (evt.which === 27) {
          evt.stopPropagation();

          resetMatches();
          scope.$digest();
        }
      });

      element.bind('blur', function (evt) {
        hasFocus = false;
      });

      // Keep reference to click handler to unbind it.
      var dismissClickHandler = function (evt) {
        if (element[0] !== evt.target) {
          resetMatches();
          scope.$digest();
        }
      };

      $document.bind('click', dismissClickHandler);

      originalScope.$on('$destroy', function(){
        $document.unbind('click', dismissClickHandler);
      });

      var $popup = $compile(popUpEl)(scope);
      if ( appendToBody ) {
        $document.find('body').append($popup);
      } else {
        element.after($popup);
      }
    }
  };

}]);

  prim.directive('typeaheadPopup', function () {
    return {
      restrict:'EA',
      scope:{
        matches:'=',
        query:'=',
        active:'=',
        position:'=',
        select:'&'
      },
      replace:true,
      templateUrl:'template/typeahead/typeahead-popup.html',
      link:function (scope, element, attrs) {

        scope.templateUrl = attrs.templateUrl;

        scope.isOpen = function () {
          return scope.matches.length > 0;
        };

        scope.isActive = function (matchIdx) {
          return scope.active === matchIdx;
        };

        scope.selectActive = function (matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function (activeIdx) {
          scope.select({activeIdx:activeIdx});
        };
      }
    };
  });

  prim.directive('typeaheadMatch', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
    return {
      restrict:'EA',
      scope:{
        index:'=',
        match:'=',
        query:'='
      },
      link:function (scope, element, attrs) {
        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
        $http.get(tplUrl, {cache: $templateCache}).success(function(tplContent){
           element.replaceWith($compile(tplContent.trim())(scope));
        });
      }
    };
  }]);

  prim.filter('typeaheadHighlight', function() {

    function escapeRegexp(queryToEscape) {
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    return function(matchItem, query) {
      return query ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
    };
  });

prim.run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-match.html",
    "<a tabindex=\"-1\" bind-html-unsafe=\"match.label | typeaheadHighlight:query\"></a>");
}]);

prim.run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-popup.html",
    "<ul class=\"dropdown-menu\" ng-show=\"isOpen()\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\" style=\"display: block;\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
    "    <li ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\" role=\"option\" id=\"{{match.id}}\">\n" +
    "        <div typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
    "    </li>\n" +
    "</ul>");
}]);
