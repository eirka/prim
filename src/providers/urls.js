// urls provider for replacing text with links and youtubes
angular.module('prim').provider("urls", function urlsProvider() {

    // global url regex
    var urlRegex = /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/ig;
    // detects protocol to see if its missing
    var protocolRegex = /^[a-z]+\:\/\//i;
    // youtube regex
    var youtubeRegex = /(https?)?:\/\/(www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/i;

    // Expose the public API for the provider.
    return ({
        $get: urls
    });

    function urls() {

        // Return the public API.
        return ({
            createLinks: createLinks
        });

        // I take plain-text content and replace the emoticon tokens with
        // actual HTML tags that represent the graphical emotions.
        function createLinks(text) {

            // If the text is empty, or not text, just pass it through.
            if (!text || !angular.isString(text)) {
                return (text);
            }

            return text.replace(urlRegex, function(text) {

                var url = text;

                // embed youtube video
                if (youtubeRegex.test(url)) {

                    var match = youtubeRegex.exec(url);

                    return '<div class="auto-resizable-iframe"><div><iframe src="https://www.youtube.com/embed/' + match[3] + '" frameborder="0" allowfullscreen></iframe></div></div>'

                }

                // add a protocol to the link if there isnt one
                if (!protocolRegex.test(text)) {
                    url = 'http://' + text;
                }

                // create a link
                return ('<a href="' + url + '" target="_blank">' + text + '</a>');

            });

        }

    }

});
