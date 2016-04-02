// AdminCtrl is a stub admin panel controller
angular.module('prim').controller('AdminCtrl', function() {

    // using controllerAs
    var self = this;

    self.data = {};

    // the list of panels
    self.panels = [{
        name: 'Statistics',
        template: 'pages/admin/statistics.html'
    }, {
        name: 'Board Log',
        template: 'pages/admin/boardlog.html'
    }, {
        name: 'Mod Log',
        template: 'pages/admin/modlog.html'
    }];

    // the default panel
    self.panel = self.panels[0].template;

    // panel switcher
    self.switchPanel = function(name) {
        if (angular.isDefined(name)) {
            angular.forEach(self.panels, function(panel) {
                if (angular.equals(panel.name, name)) {
                    self.panel = panel.template;
                }
            });
        }
        return;
    };

    // check if tab is active
    self.isActive = function(panel) {
        return angular.equals(panel.template, self.panel);
    };

});
