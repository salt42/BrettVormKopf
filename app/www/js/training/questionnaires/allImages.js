angular.module("BvK.training.questionnaires")
	.directive("allimages", function() {
		return {
			restrict: "E",
			link: function(scope) {
				//set current showing answer
				scope.current = scope.question.answer;
			},
			template:
				'<div class="question-wood-images">' +
					//'<div ng-include="\'templates/woodDescription.html\'"></div>' + //eventuel die item info aus nem extra template dann können alle questionnaires des benutzen
					'<div ng-repeat="(key, value) in current.properties">' +
						'<p>{{key}} : {{value}}</p>' +
					'</div>' +
					'<imagecarousel images="current.images" random="true"></imagecarousel>' +
				'</div>' +
				'<div class="answer-box" id="myAnswer">' +
					'<div class="multiple-choice-answer-list">' +
						'<ion-radio ng-repeat="item in multipleChoiceList"' +
							'ng-value="item.value"' +
							'ng-model="answer.selected"' +
							'ng-change="changeAnswer(item)"' +
							'class="multiple-choice-answer">' +
								'{{ item.text }}' +
						'</ion-radio>' +
					'</div>' +
					'<div>' +
						'<button id="infoButton" class="button button-balanced" ng-click="info()">Info</button>' +
						'<button id="nextButton" class="button button-balanced" ng-click="next()">Next</button>' +
					'</div>' +
				'</div>',
			//BvK.training vars
			severity: 0
		};
	});
