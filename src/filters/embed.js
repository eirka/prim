angular.module('prim').filter('embed', function($sce) {
    return function(input) {

        if (input === undefined || input === null) {
            return;
        }
        if (typeof input === "object") {
            return input;
        }

        // global url regex
        var urlRegex = /(https?:\/\/|(www\.)|[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/ig;

        // detects protocol to see if its missing
        var protocolRegex = /^[a-z]+\:\/\//i;

        // youtube regex
        var youtubeRegex = /(https?)?:\/\/(www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/i;

        // image regex
        var imageRegex = /(https?:\/\/|(www\.)|[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019](?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)/i;

        strReplaced = input.replace(urlRegex, function(text) {

            var url = text;

            // add a protocol to the link if there isnt one
            if (!protocolRegex.test(text)) {
                url = 'http://' + text;
            }

            // embed image
            if (imageRegex.test(url)) {

                var match = imageRegex.exec(url);

                return '<a href="' + url + '" target="_blank"><img class="external_image" src="' + url + '" /></a>';

            }

            // embed youtube video
            if (youtubeRegex.test(url)) {

                var match = youtubeRegex.exec(url);

                return '<div class="auto-resizable-iframe"><div><iframe src="https://www.youtube.com/embed/' + match[3] + '" frameborder="0" allowfullscreen></iframe></div></div>';

            }

            // create a link
            return '<a href="' + url + '" target="_blank">' + text + '</a>';

        });

        return $sce.trustAsHtml(strReplaced);

    };

});
