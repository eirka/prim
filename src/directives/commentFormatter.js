// formats the comment text with emoticons and embeds
angular.module('prim').directive('commentFormatter', function($compile, emoticons, config, FindAndReplace) {
    // emoticon image path
    var emoticonSrv = config.img_srv + '/emoticons/';

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

    // regex for emoticons
    var emoticonRegex = /:([\w+-]+):/ig;

    // link embed
    var link = function(input) {
        // a element
        var tag = document.createElement("a");
        tag.setAttribute("href", input);
        tag.setAttribute("target", "_blank");
        tag.textContent = input;
        return tag;
    };

    // image embed
    var image = function(input) {
        // a element
        var tag = document.createElement("a");
        tag.setAttribute("href", input);
        tag.setAttribute("target", "_blank");
        // interior img element
        var image = document.createElement("img");
        image.setAttribute("src", input);
        image.className = "external_image";
        tag.appendChild(image);
        return tag;
    };

    // youtube embed
    var youtube = function(input) {
        // container div with responsive class
        var match = youtubeRegex.exec(input);
        var tag = document.createElement("div");
        tag.className = "auto-resizable-iframe";
        // inner div
        var inner = document.createElement("div");
        tag.appendChild(inner);
        // youtube iframe
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", "https://www.youtube.com/embed/" + match[3]);
        iframe.setAttribute("frameborder", 0);
        iframe.setAttribute("allowfullscreen", true);
        inner.appendChild(iframe);
        return tag;
    };

    // emoticon images
    var emoticon = function(token) {
        // emoticon img 
        var tag = document.createElement("img");
        tag.setAttribute("class", "emoticon");
        tag.setAttribute("title", ":" + token.text + ":");
        tag.setAttribute("src", emoticonSrv + token.image);
        return tag;
    };

    // email embed
    var email = function(input) {
        var match = emailRegex.exec(input);
        return document.createTextNode(match[1] + ' at ' + match[2]);
    };

    return {
        restrict: 'E',
        scope: {
            comment: '='
        },
        link: function(scope, element) {
            // the directive node
            element = element[0];
            // wrap the content in p
            var node = document.createElement("p");
            // set the node text to the trimmed comment
            node.textContent = scope.comment.replace(/(\n){3,}/g, '\n\n').trim();
            // append to directive
            element.appendChild(node);

            // bold text
            FindAndReplace.parse(element, {
                find: boldRegex,
                wrap: 'strong',
                replace: '$2'
            });

            // italic text
            FindAndReplace.parse(element, {
                find: italicRegex,
                wrap: 'em',
                replace: '$2'
            });

            // handle link embeds
            FindAndReplace.parse(element, {
                find: urlRegex,
                replace: function(url) {
                    if (!url) {
                        return;
                    }

                    // an object is returned, we want the text
                    url = url.text;

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
                }
            });

            // emoticons
            FindAndReplace.parse(element, {
                find: emoticonRegex,
                replace: function(input) {
                    var match = emoticonRegex.exec(input.text);
                    var token = emoticons.tokenMap[match[1]];
                    if (angular.isDefined(token)) {
                        return emoticon(token);
                    }
                    return input.text;
                }
            });

            return;

        }
    };
});
