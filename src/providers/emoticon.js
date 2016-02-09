// emoticons provider for replacing text with emoticons
angular.module('prim').provider("emoticons", function emoticonsProvider() {

    // I am the collection of tokens that can be used to identify emoticons
    // in the plain-text content. These tokens will also be used to define
    // the CSS classes in the markup. For example, "emoticon emoticon-smile".
    var tokens = [];

    // holds the image server address for the img src
    var imgsrv;

    // I define the RegExp patterns that are used to search for and validate
    // emoticon tokens.
    var tokenValidationPattern = /^([\w+-]+)$/i;

    function setImageServer(server) {
        imgsrv = server;
        return imgsrv;
    }

    // I allow the tokens to be overridden during the configuration phase.
    function setTokens(newTokens) {
        // Because the tokens are located in plain-text using a regular
        // expression pattern, we need to ensure that each token adheres to
        // a particular format.
        for (var i = 0, length = newTokens.length; i < length; i++) {
            testToken(newTokens[i]);
        }
        // If we made it this far, all the new tokens are valid.
        tokens = newTokens;
    }

    // I test the format of the given token to make sure that it conforms to
    // the pattern we will be searching for in the text. If the token is not
    // valid, an error is thrown; otherwise, returns quietly.
    function testToken(newToken) {
        if (newToken.text.search(tokenValidationPattern) !== 0) {
            throw (new Error("Token [" + newToken + "] is not a valid emoticon."));
        }
    }

    // I am the actual emoticons service.
    function emoticons() {

        // Rather than having to convert tokens to tags over and over again,
        // we can pre-compose the HTML tags during service initialization.
        // This way, we only eat that cost once. Returns a hash of tokens
        // mapped to their corresponding HTML tag.
        function createTokenMap(tokens) {

            var tagMap = {};

            for (var i = 0, length = tokens.length; i < length; i++) {

                var token = tokens[i];

                tagMap[token.text] = token;

            }
            return tagMap;
        }

        // I am a hash that maps the token values to pre-composed HTML tag
        // that represents the emoticon markup.
        var tokenMap = createTokenMap(tokens);

        // Return the public API.
        return ({
            tokenMap: tokenMap
        });

    }

    // Expose the public API for the provider.
    return ({
        setImageServer: setImageServer,
        setTokens: setTokens,
        $get: emoticons
    });

});
