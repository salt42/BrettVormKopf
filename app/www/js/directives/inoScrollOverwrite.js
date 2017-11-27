/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global $, angular */
angular.module('BvK')
.directive('iionScroll', function factory($timeout) {
	var directiveDefinitionObject = {
		restrict: 'E',
		priority: -10,
    	link: function postLink(scope) {
			scope.$watch("images", function(images) {
			 });
		},
		controller: function($scope, $element, $ionicGesture, $ionicSlideBoxDelegate) {

		}
	};
	return directiveDefinitionObject;
});
