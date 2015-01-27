/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global $, angular */
angular.module('BvK')
.directive('infotable', function factory($timeout) {
	var directiveDefinitionObject = {
		restrict: 'E',
		priority: -10,
		scope: {
			infos: '=',
		},
		template: 	'<table class="info-table">' +
                        '<tr ng-repeat="(key, value) in infos">' +
                            '<td>{{key}}</td>' +
                            '<td>{{value}}</td>' +
                        '</tr>' +
                    '</table>'
	};
	return directiveDefinitionObject;
});
