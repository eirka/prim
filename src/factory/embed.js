angular.module('prim').factory('embed', function() {

    // global url regex from https://gist.github.com/dperini/729294
    var urlRegex = /(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/ig;

    // detects protocol to see if its missing
    var protocolRegex = /^[a-z]+\:\/\//i;


    // detects an email
    var emailRegex = /(\S{3,})@(\S*[^\s.;,(){}<>"\u201d\u2019])/i;

    // youtube regex
    var youtubeRegex = /(https?)?:\/\/(www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/i;

    // image regex
    var imageRegex = /(https?:\/\/|(www\.)|[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019](?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)/i;

    return {
        // sanitizes the input and adds our embed directives
        filterComment: function(input) {

            // check if undefined or null
            if (angular.isUndefined(input) || angular.isObject(input) || angular.equals(input, null)) {
                return;
            }

            // replace all the items with our directives
            var strReplaced = input.replace(urlRegex, function(url) {

                // check for an email
                if (emailRegex.test(url)) {
                    var emailmatch = emailRegex.exec(url);

                    return emailmatch[1] + ' at ' + emailmatch[2];
                }

                // add a protocol to the link if there isnt one
                if (!protocolRegex.test(url)) {
                    url = 'http://' + url;
                }

                // embed image
                if (imageRegex.test(url)) {
                    return '<image-embed url="' + url + '"></image-embed>';
                }

                // embed youtube video
                if (youtubeRegex.test(url)) {
                    // just get the video id
                    var youtubematch = youtubeRegex.exec(url);

                    return '<youtube-embed url="' + youtubematch[3] + '"></youtube-embed>';
                }

                // if all else fails create a link
                return '<link-embed url="' + url + '"></link-embed>';

            });

            return strReplaced;
        }
    };
});

// link embed template
angular.module('prim').directive('linkEmbed', function() {
    return {
        restrict: 'E',
        scope: {
            url: "@"
        },
        template: '<a ng-href="{{url}}" target="_blank" href>{{url}}</a>'
    };
});

// image embed template
angular.module('prim').directive('imageEmbed', function() {
    return {
        restrict: 'E',
        scope: {
            url: "@"
        },
        template: '<a ng-href="{{url}}" target="_blank" href><img class="external_image" ng-src="{{url}}" /></a>'
    };
});

// youtube embed template
angular.module('prim').directive('youtubeEmbed', function($sce) {
    return {
        restrict: 'E',
        scope: {
            url: "@"
        },
        template: '<div class="auto-resizable-iframe"><div><iframe ng-src="{{video}}" frameborder="0" allowfullscreen></iframe></div></div>',
        link: function(scope) {

            // create video link
            scope.video = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + scope.url);

        }
    };
});
