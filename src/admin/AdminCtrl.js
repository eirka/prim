// AdminCtrl is a stub admin panel controller
angular.module('prim').controller('AdminCtrl', function(_) {

    // using controllerAs
    var self = this;

    self.data = {};

    // the list of panels
    self.panels = [{
        name: 'Statistics',
        template: 'pages/admin/statistics.html'
    }];

    // the default panel
    self.panel = self.panels[0].template;

    // panel switcher
    self.switchPanel = function(name) {
        if (angular.isDefined(name)) {
            var panel = _.find(self.panels, ['name', name]);
            self.panel = panel.template;
        }
        return;
    };

});
