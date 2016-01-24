// embed adds links, youtubes, and images to posts
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

    // regex for italic text
    var italicRegex = /(\*)(.*?)\1/ig;

    // regex for bold text
    var boldRegex = /(\*\*)(.*?)\1/ig;

    // link embed
    var link = function(input) {
        return '<link-embed url="' + input + '"></link-embed>';
    };

    // image embed
    var image = function(input) {
        return '<image-embed url="' + input + '"></image-embed>';
    };

    // youtube embed
    var youtube = function(input) {
        var match = youtubeRegex.exec(input);

        return '<youtube-embed url="' + match[3] + '"></youtube-embed>';
    };

    // email embed
    var email = function(input) {
        var match = emailRegex.exec(input);

        return match[1] + ' at ' + match[2];
    };

    return {
        // sanitizes the input and adds our embed directives
        filterComment: function(input) {

            // check if undefined or null
            if (angular.isUndefined(input) || angular.isObject(input) || angular.equals(input, null)) {
                return;
            }

            return input
                .replace(urlRegex, function(url) {

                    // check for an email
                    if (emailRegex.test(url)) {
                        return email(url);
                    }

                    // add a protocol to the link if there isnt one
                    if (!protocolRegex.test(url)) {
                        url = 'http://' + url;
                    }

                    // embed image
                    if (imageRegex.test(url)) {
                        return image(url);
                    }

                    // embed youtube video
                    if (youtubeRegex.test(url)) {
                        return youtube(url);
                    }

                    return link(url);

                })
                .replace(boldRegex, '<strong>$2</strong>')
                .replace(italicRegex, '<em>$2</em>');

        }
    };
});
