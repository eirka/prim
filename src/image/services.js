// utilities for the image controller
angular.module('prim').factory('ImageService', function($sce, config) {
    return {
        // generates the src link for an image with the img server from the config
        getImgSrc: function(filename) {
            return $sce.trustAsResourceUrl(config.img_srv + '/src/' + filename);
        }
    };
});
