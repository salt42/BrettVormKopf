/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global angular, document */
var serverUrl = 'http://62.75.165.72:3000/data/',
	woodsUrl = serverUrl + 'img/woods/';

angular.module('BvK.controllers', [])
	.controller('AppCtrl', function($scope, $ionicModal) {

	})
	.controller('HomeCtrl', function($scope) {
		//$scope.stats = statistics.getStats();
		console.log('home controller')
	})
	.controller('QuestionCtrl', function($scope, coach) {
		$scope.question = coach.nextQuestion();
	})
	.controller('TrainingCtrl', function($scope, $state) {
		//$scope.stats = statistics.getStats();
		$scope.startTraining = function() {
			$state.go($state.get('app.question'), {}, {reload: ''});
		}

	});