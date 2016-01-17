// BoardStatisticsCtrl generates a chart and shows the statistics for an imageboard
angular.module('prim').controller('BoardStatisticsCtrl', function($route, dateFilter, ModHandlers, Utils) {

    // using controllerAs
    var self = this;

    // chart labels
    self.labels = [];
    // the chart series names
    self.series = [];
    // the chart datapoints
    self.chartdata = [];

    self.colors = ['#BF4848', '#4883BF'];

    // chart options
    self.options = {
        scaleShowGridLines: false,
        pointDot: false,
        datasetStroke: false,
        scaleFontSize: 8,
        scaleSteps: 10,
        bezierCurve: false,
    };

    // Get the image json from pram
    ModHandlers.statistics.get({}, function(data) {
        self.data = data;

        // format the dates
        angular.forEach(data.labels, function(value) {
            self.labels.push(dateFilter(value, 'M/d h:mma'));
        });

        // push the data
        angular.forEach(data.series, function(value) {
            self.series.push(value.name);
            self.chartdata.push(value.data);
        });

    }, function(error) {
        Utils.apiError(error.status);
    });

});
