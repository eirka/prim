// Utils provides numerous services to controllers
angular.module('prim').factory('Utils', function($location, config) {

    // holds the quote text
    var commentQuote = "";
    // holds the error code
    var errorCode;
    // to break image cache on avatars
    var queryDate = new Date().getTime();

    // image source address
    var imgsrc = config.img_srv + '/src/';
    // thumb source address
    var thumbsrc = config.img_srv + '/thumb/';
    // avatar source address
    var avatarsrc = config.img_srv + '/avatars/';

    var Utils = {
        // sets the quote
        setQuote: function(quote) {
            if (angular.isDefined(quote) && angular.isNumber(quote)) {
                // make sure this exists first
                if (!angular.isDefined(commentQuote) || !angular.isString(commentQuote)) {
                    Utils.clearQuote();
                }
                // append the quote number
                commentQuote += ">>" + quote + " ";
            }
        },
        // gets the quote
        getQuote: function() {
            if (angular.isDefined(commentQuote) && angular.isString(commentQuote)) {
                return commentQuote;
            }
            Utils.clearQuote();
            return commentQuote;
        },
        clearQuote: function() {
            commentQuote = "";
        },
        // sets the error code from the request and forwards to error page
        apiError: function(code) {
            if (angular.isDefined(code)) {
                errorCode = code;
                $location.path('/error');
            }
        },
        // gets the error code
        getError: function() {
            return errorCode;
        },
        // generates the action for the post/reply form
        getFormAction: function(addr) {
            if (angular.isDefined(addr) && angular.isString(addr)) {
                return config.api_srv + addr;
            }
        },
        // generates the src url for an image with the img server from the config
        getImgSrc: function(filename) {
            if (angular.isDefined(filename) && angular.isString(filename)) {
                return imgsrc + filename;
            }
        },
        // generates the thumb url for an image with the img server from the config
        getThumbSrc: function(filename, source) {
            var src;
            if (angular.isDefined(filename) && angular.isDefined(source)) {
                // if the file is a gif show the full file for wacky animations
                if (!!source && angular.equals(source.split('.').pop(), "gif")) {
                    src = imgsrc + source;
                } else {
                    src = thumbsrc + filename;
                }
            }
            return src;
        },
        // generates the avatar src
        getAvatar: function(id) {
            if (angular.isDefined(id)) {
                return avatarsrc + id + '.png?' + queryDate;
            }
        },
        // select the css class depending on user group
        usergroupClass: function(group) {
            if (angular.isDefined(group)) {
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
        }
    };

    return Utils;

});
