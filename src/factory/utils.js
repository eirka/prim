angular.module('prim').factory('Utils', function($location, config) {

    // holds the quote text
    var commentQuote = "";

    // image source address
    var imgsrc = config.img_srv + '/src/';
    // thumb source address
    var thumbsrc = config.img_srv + '/thumb/';

    // holds the error code
    var errorCode;

    return {
        // sets the quote
        setQuote: function(quote) {
            if (anguar.isDefined(quote)) {
                commentQuote += ">>" + quote + " ";
            }
        },
        // gets the quote
        getQuote: function() {
            return commentQuote;
        },
        clearQuote: function() {
            commentQuote = "";
        },
        // sets the error code from the request and forwards to error page
        apiError: function(code) {
            errorCode = code;
            $location.path('/error');
        },
        // gets the error code
        getError: function() {
            return errorCode;
        },
        // generates the action for the post/reply form
        getFormAction: function(addr) {
            return config.api_srv + addr;
        },
        // generates the src url for an image with the img server from the config
        getImgSrc: function(filename) {
            return imgsrc + filename;
        },
        // generates the thumb url for an image with the img server from the config
        getThumbSrc: function(filename, source) {
            var src;

            if (!!source && angular.equals(source.split('.').pop(), "gif")) {
                src = imgsrc + source;
            } else {
                src = thumbsrc + filename;
            }

            return src;
        },
        // generates the avatar src
        getAvatar: function(id) {
            return config.img_srv + '/avatars/' + id + '.png';
        },
        // select the css class depending on user group
        usergroupClass: function(group) {
            switch (group) {
                case 2:
                    return "group_registered";
                case 3:
                    return "group_moderator";
                case 4:
                    return "group_admin";
                default:
                    return "group_guest";
            }
        }
    };
});
