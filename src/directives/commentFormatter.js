// formats the comment text with emoticons and embeds
angular.module('prim').directive('commentFormatter', function($compile, emoticons, config) {
    // emoticon image path
    var emoticonSrv = config.img_srv + '/emoticons/';

    // global url regex from https://gist.github.com/dperini/729294
    var urlRegex = /(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/i;

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
    var emoticonRegex = /:([\w+-]+):/g;

    // link embed
    var link = function(input) {
        return angular.element('<link-embed/>').attr('url', input);
    };

    // image embed
    var image = function(input) {
        return angular.element('<image-embed/>').attr('url', input);
    };

    // youtube embed
    var youtube = function(input) {
        var match = youtubeRegex.exec(input);
        return angular.element('<youtube-embed/>').attr('url', match[3]);
    };

    // email embed
    var email = function(input) {
        var match = emailRegex.exec(input);
        return document.createTextNode(match[1] + ' at ' + match[2]);
    };

    // appends html tags to text node
    // http://stackoverflow.com/questions/16662393/insert-html-into-text-node-with-javascript
    var matchText = function(node, regex, callback) {
        var excludeElements = [
            'script', 'style', 'iframe', 'canvas', 'a', 'link-embed', 'youtube-embed', 'image-embed'
        ];
        var child = node.firstChild;
        while (child) {
            switch (child.nodeType) {
                case 1:
                    if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1) {
                        break;
                    }
                    matchText(child, regex, callback);
                    break;
                case 3:
                    var bk = 0;
                    child.data.replace(regex, function replaceMatch(all) {
                        var args = [].slice.call(arguments),
                            offset = args[args.length - 2],
                            newTextNode = child.splitText(offset + bk),
                            tag;
                        bk -= child.data.length + all.length;

                        // create new text node
                        newTextNode.data = newTextNode.data.substr(all.length);
                        // get the element from the callback
                        tag = callback.apply(window, [child].concat(args));
                        if (!tag) {
                            return;
                        }
                        // insert new element and text node
                        child.parentNode.insertBefore(tag, newTextNode);
                        // switch to new text node
                        child = newTextNode;
                    });
                    break;
            }
            child = child.nextSibling;
        }
        return node;
    };

    return {
        restrict: 'E',
        scope: {
            comment: '='
        },
        template: '<p></p>',
        link: function(scope, element) {
            // to hold match
            var match;
            // the raw comment text, formatted and trimmed
            var raw = scope.comment.replace(/(\n){3,}/g, '\n\n').trim();
            // to hold url
            var url;
            // to hold index
            var i;

            // this sets the element to inside the template p element
            var comment = angular.element(element.children());

            // add a text node if it wasnt an embed
            function addText(text) {
                if (!text) {
                    return;
                }

                // text node so theres no xss
                var node = document.createElement("span");
                node.textContent = text;

                // bold text
                node = matchText(node, boldRegex, function(node, input) {
                    var match = boldRegex.exec(input);
                    var span = document.createElement("strong");
                    span.textContent = match[2];
                    return span;
                });

                // italic text
                node = matchText(node, italicRegex, function(node, input) {
                    var match = italicRegex.exec(input);
                    var span = document.createElement("em");
                    span.textContent = match[2];
                    return span;
                });

                // emoticons
                node = matchText(node, emoticonRegex, function(node, input) {
                    var match = emoticonRegex.exec(input);
                    var token = emoticons.tokenMap[match[1]];
                    if (angular.isDefined(token)) {
                        var tag = document.createElement("img");
                        tag.setAttribute("class", "emoticon");
                        tag.setAttribute("title", ":" + token.text + ":");
                        tag.setAttribute("src", emoticonSrv + token.image);
                        return tag;
                    }
                    return document.createTextNode(input);
                });

                return comment.append(node);
            }

            // add an embed directive
            function addEmbed(url) {
                if (!url) {
                    return;
                }

                // check for an email
                if (emailRegex.test(url)) {
                    return comment.append(email(url));
                }

                // add a protocol to the link if there isnt one
                if (!protocolRegex.test(url)) {
                    url = 'http://' + url;
                }

                // embed image
                if (imageRegex.test(url)) {
                    return comment.append($compile(image(url))(scope));
                }

                // embed youtube video
                if (youtubeRegex.test(url)) {
                    return comment.append($compile(youtube(url))(scope));
                }

                // this is a plain old link
                return comment.append($compile(link(url))(scope));

            }

            // loop through all matches for embeds
            while ((match = raw.match(urlRegex))) {
                // the found url
                url = match[0];

                // the index of the match
                i = match.index;

                // add any text up to the index to a text node
                addText(raw.substr(0, i));

                // add the embeds
                addEmbed(url);

                // remove the match
                raw = raw.substring(i + match[0].length);
            }

            // add the final bit of text
            addText(raw);

            return;

        }
    };
});
