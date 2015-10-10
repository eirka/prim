angular.module('prim').config(function($sceDelegateProvider, config) {

    // whitelist our api and image servers
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http:' + config.api_srv + '/**',
        'https:' + config.api_srv + '/**',
        'http:' + config.img_srv + '/**',
        'https:' + config.img_srv + '/**'
    ]);

});
