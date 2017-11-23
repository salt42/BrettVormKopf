/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global $, angular */
angular.module('BvK')
.directive('infotable', function($timeout) {
	var directiveDefinitionObject = {
		restrict: 'E',
		priority: -10,
		link: function(scope, element) {
		},
		controller: function($scope) {},
		scope: {
			infos: '=',
		},
		template: 	'<div class="info-table">' +
                        '<div class="info-value" ng-repeat="(key, value) in infos">' +
                            '<div class="value-name">{{value.name}}</div>' +
                            '<div class="value-content">{{value.value}}</div>' +
						'</div>' +
                    '</div>'
	};
	return directiveDefinitionObject;
});
