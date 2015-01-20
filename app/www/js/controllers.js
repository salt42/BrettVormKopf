/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global angular, document */
var serverUrl = 'http://62.75.165.72:3000/data/',
	woodsUrl = serverUrl + 'img/woods/';

var app = angular.module('starter.controllers', []);

app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

//  // Open the login modal
//  $scope.login = function() {
//    $scope.modal.show();
//  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
});
app.controller('HomeCtrl', function($scope) {

});
app.controller('WoodsCtrl', function($scope, woodGrabber) {
	woodGrabber.getWoods(function(woods) {
		$scope.woods = woods;
	});
});

app.controller('WoodCtrl', function($scope, $stateParams, woodGrabber, $timeout) {
	woodGrabber.getWoodByID($stateParams.woodid, function(wood) {
		$scope.Wood = wood;
	});
	$scope.switch = function() {
		var $desc = $('.wood-description');
		if ($desc.is(':hidden')) {
			$desc.show();
			$('#openImages').html('Bilder');
			$('.wood-images').hide();
		} else {
			$desc.hide();
			$('#openImages').html('Info');
			$('.wood-images').show();
		}
	}
	$timeout(function() {
		$('.wood-images').hide();
		$('.wood-images').css('margin-top', '0px');
    }, 100);

	
});
app.controller('StatsCtrl', function($scope, statistics) {
	$scope.stats = statistics.getStats();
});
app.controller('TrainingCtrl', function($scope, $state, statistics) {
	statistics.forceCalculate();
	$scope.startTraining = function() {
		$state.go($state.get('app.question'), {}, {reload: ''});
	};
});
app.controller('QuestionCtrl', function($scope, woodGrabber, $state, $stateParams, trainingCenter) {
	var answerID,
		answered = false;
	
	//fucking ng-change needs ng-model
	$scope.answer = {
		selected: -1
	};
    $scope.randomImages = true;
	//event hendler
	$scope.changeAnswer = function(item) {
		if (answered) {
			//change images
			$scope.Wood = $scope.woods[item.value];
			$scope.woodImagesId = item.value;
			return;
		}
		
		answerID = item.value;
		var answerNodes = $('#myAnswer .multiple-choice-answer-list')[0].children,
			i= 0;

		if (trainingCenter.guess(item.value)) {
			answered = true;
			$scope.randomImages = false;
			$("#nextButton").show();
			$("#infoButton").show();
		}

		for(;i<3;i++) {
			var value = parseInt(answerNodes[i].attributes.getNamedItem('value').value);
			
			if (answered || item.value === value){
				//nur der ausgewählte in der richtigen farbe
				if (value === $scope.answerwood.id) {
					answerNodes[i].style.color = "green";
				} else {
					answerNodes[i].style.color = "red";
				}
			}
		}
	};
	$scope.next = function() {
		$("#nextButton").hide();
		$("#infoButton").hide();
		$state.go($state.get('app.question'), {}, {reload: true});
	};
	$scope.info = function() {
		//$scope.answer.selected
		var $imgSwitch = $('.question-wood-images imageswitch');
		if ($imgSwitch.css('display') === 'none') {
			$imgSwitch.show();
			$('.question-wood-images .wood-description').hide();
			$('#infoButton').html('Info');
		} else {
			$imgSwitch.hide();
			$('.question-wood-images .wood-description').show();
			$('#infoButton').html('Bilder');
		}
	}
	//load data from training module
	trainingCenter.getQuestion(function(question) {
		$scope.Wood = question.wood;
		$scope.answerwood = question.wood;
		$scope.multipleChoiceList = question.posibleAnswers;
	});
	woodGrabber.getWoods(function(woods) {
		$scope.woods = woods;
	});
});