angular.module('prim').filter('embed', function($sce) {
    return function(input) {

        if (input === undefined || input === null) {
            return;
        }
        if (typeof input === "object") {
            return input;
        }

        // global url regex
        var urlRegex = /\b(?:(https?|ftp|file):\/\/|www\.)[-A-Z0-9+()&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/ig;

        // detects protocol to see if its missing
        var protocolRegex = /^[a-z]+\:\/\//i;

        // youtube regex
        var youtubeRegex = /(https?)?:\/\/(www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/i;

        strReplaced = input.replace(urlRegex, function(text) {

            var url = text;

            // embed youtube video
            if (youtubeRegex.test(url)) {

                var match = youtubeRegex.exec(url);

                return '<div class="auto-resizable-iframe"><div><iframe src="https://www.youtube.com/embed/' + match[3] + '" frameborder="0" allowfullscreen></iframe></div></div>';

            }

            // add a protocol to the link if there isnt one
            if (!protocolRegex.test(text)) {
                url = 'http://' + text;
            }

            // create a link
            return '<a href="' + url + '" target="_blank">' + text + '</a>';

        });

        return $sce.trustAsHtml(strReplaced);

    };

});
