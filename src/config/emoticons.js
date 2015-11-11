// configure the emoticons
angular.module('prim').config(function configureEmoticons(emoticonsProvider, config) {

    // Override the token collection with our more robust offering.
    emoticonsProvider.setTokens([{
        text: "smug",
        image: "smug.gif"
    }, {
        text: "shepface",
        image: "shepface.gif"
    }, {
        text: "byodood",
        image: "byodood.gif"
    }, {
        text: "chord",
        image: "chord.gif"
    }, {
        text: "coolspot",
        image: "coolspot.gif"
    }, {
        text: "eyepop",
        image: "eyepop.gif"
    }, {
        text: "frogcool",
        image: "frogcool.gif"
    }, {
        text: "frogout",
        image: "frogout.gif"
    }, {
        text: "getin",
        image: "getin.gif"
    }, {
        text: "negative",
        image: "negative.png"
    }, {
        text: "newlol",
        image: "newlol.gif"
    }, {
        text: "owned",
        image: "owned.gif"
    }, {
        text: "smugdog",
        image: "smugdog.gif"
    }, {
        text: "smugmrgw",
        image: "smugmrgw.png"
    }]);

    // set the image server for the emoticon image src
    emoticonsProvider.setImageServer(config.img_srv);

});
