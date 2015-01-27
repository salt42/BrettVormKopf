angular.module("BvK.training.questionnaires")
	.directive("allimages", function() {

        //+ Jonas Raoni Soares Silva
        //@ http://jsfromhell.com/array/shuffle [v1.0]
        function shuffle(o) { //v1.0
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        };
        //END

		return {
			restrict: "E",
			link: function(scope) {
				//set current showing answer
                scope.$watch('question', function(newQuestion){
				    scope.current = newQuestion.answer;
                    console.log(scope);
                    var answerArray = [
                        {value: scope.current,
                         text: scope.current.name,
                         rightAnswer: true,},
                        {value: newQuestion.failAnswers[0],
                         text: newQuestion.failAnswers[0].name,
                         rightAnswer: false,},
                        {value: newQuestion.failAnswers[1],
                         text: newQuestion.failAnswers[1].name,
                         rightAnswer: false,}
                    ];
                    scope.multipleChoiceList = shuffle(answerArray);
                });
			},
            controller: function($scope, $state){
                var answerID,
                    answered = false;

                //fucking ng-change needs ng-model
                $scope.answer = {
                    selected: -1
                };
                $scope.current = $scope.$parent.question.answer;
                $scope.next = function() {
//                    $("#nextButton").hide();
//                    $("#infoButton").hide();
                    $state.go($state.get('app.question'), {}, {reload: true});
                };
                $scope.info = function() {
                    //$scope.answer.selected
                    var $imgSwitch = $('.question-wood-images imagecarousel');
                    if ($imgSwitch.css('display') === 'none') {
                        $imgSwitch.show();
                        $('.question-wood-images .wood-description').hide();
                        $('#infoButton').html('Info');
                    } else {
                        $imgSwitch.hide();
                        $('.question-wood-images .wood-description').show();
                        $('#infoButton').html('Bilder');
                    }
                };
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

                    if (item.rightAnswer){
                        answered = true;
                        $scope.randomImages = false;
                        $("#nextButton").show();
                        $("#infoButton").show();
                    }
                    for(;i<3;i++) {
                        var value = parseInt(answerNodes[i].attributes.getNamedItem('value').value);

                        if (answered || item.value === value){
//                            //nur der ausgewählte in der richtigen farbe
                            if (item.rightAnswer) {
                                answerNodes[i].style.color = "green";
                            } else {
                                answerNodes[i].style.color = "red";
                            }
                        }
                    }
                };
                window.test = $scope.info;
            },
			template:
				'<div class="question-wood-images">' +
					//'<div ng-include="\'templates/woodDescription.html\'"></div>' + //eventuel die item info aus nem extra template dann können alle questionnaires des benutzen
					'<infotable infos="current.properties" style="display:none;"></infotable>' +
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
			difficulty: 0,
		};
	});
