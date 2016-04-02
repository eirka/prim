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

    // format the labels with the local date
    var labelFormat = function(value) {
        self.labels.push(dateFilter(value, 'M/d h:mma'));
    };

    // push the data
    var setData = function(value) {
        self.series.push(value.name);
        self.chartdata.push(value.data);
    };

    // Get the image json from pram
    ModHandlers.statistics.get({}, function(data) {
        self.data = data;
        // format the labels
        angular.forEach(data.labels, function(label) {
            labelFormat(label);
        });
        // set the data
        angular.forEach(data.series, function(data) {
            setData(data);
        });
    }, function(error) {
        Utils.apiError(error.status);
    });

});
