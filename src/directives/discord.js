angular.module('prim').directive('discordWidget', function($resource, config) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: "pages/discord.html",
        link: function(scope) {

            // the url for the discord widget json
            var discord_endpoint = $resource(config.discord_widget, {}, {
                get: {
                    cache: true
                }
            });

            // query the endpoint and get the data
            discord_endpoint.get({}, function(data) {
                // the instant invite link
                scope.invite_link = data.instant_invite;
                // the number of current users
                scope.user_count = data.members.length;
            });

        }
    };
});
