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
                    //hide old images
                    //$(".question-images").hide();
                    scope.currentImages = newQuestion.answer.images;
				    scope.current = newQuestion.answer;
                    var answerArray = [
                        {value: scope.current.id,
                         text: scope.current.name,
                         answer: newQuestion.answer,
                         rightAnswer: true,},
                        {value: newQuestion.failAnswers[0].id,
                         text: newQuestion.failAnswers[0].name,
                         answer: newQuestion.failAnswers[0],
                         rightAnswer: false,},
                        {value: newQuestion.failAnswers[1].id,
                         text: newQuestion.failAnswers[1].name,
                         answer: newQuestion.failAnswers[1],
                         rightAnswer: false,}
                    ];
                    scope.multipleChoiceList = shuffle(answerArray);
                    //timeout show images
                    setTimeout(function() {
                        //$(".question-images").show();
                        window.dispatchEvent(new Event('resize'));
                    }, 20);
                    //reset buttons
                });
                
                scope.$on("$destroy",function(e) {
                    //scope.$destroy();
                });
			},
            controller:  function ($scope, $state, statistics, $ionicSlideBoxDelegate, $timeout){
                var answered = false,
                    stats = {};
                
                stats.questionAnswer = $scope.question.answer;
                stats.answers = [];
                stats.difficulty = 1;
                //fucking ng-change needs ng-model
                $scope.answer = {
                    selected: -1
                };
                //$scope.current = $scope.$parent.question.answer;
                $scope.resetState = function() {
                    //prepare for new question
                    $('.question-images imagecarousel').removeClass("hidden");
                    $('.question-images infotable').hide();
                    $('#infoButton').html('Info');
                    $("#nextButton").hide();
                    $("#infoButton").hide();
                    stats = {};
                    stats.questionAnswer = $scope.question.answer;
                    stats.answers = [];
                    stats.difficulty = 1;
                    $scope.answer.selected = -1;
                    answered = false;
                    window.dispatchEvent(new Event('resize'));
                }
                $scope.next = function() {
                    $scope.callback()({
                        type: "next",
                    });
                    $scope.resetState();
                };
                $scope.info = function() {
                    //$scope.answer.selected
                    var $infoTable = $('.question-images infotable');
                    if ($infoTable.css('display') !== 'none') {
                        $('.question-images infotable').hide();
                        $('.question-images imagecarousel').removeClass("hidden");
                        $('#infoButton').html('Info');
                    } else {
                        $('.question-images infotable').show();
                        $('.question-images imagecarousel').addClass("hidden");
                        $('#infoButton').html('Bilder');
                    }
                    window.dispatchEvent(new Event('resize'));
                };
                $scope.changeAnswer = function(item) {
                    if (answered) {
                        //change images
                        if (item.value === $scope.question.answer.id) {
                            $scope.current = $scope.question.answer;
                            $scope.currentImages = $scope.question.answer.images;
                        } else if (item.value === $scope.question.failAnswers[0].id) {
                            $scope.current = $scope.question.failAnswers[0];
                            $scope.currentImages = $scope.question.failAnswers[0].images;
                        } else {
                            $scope.current = $scope.question.failAnswers[1];
                            $scope.currentImages = $scope.question.failAnswers[1].images;
                        }
                        setTimeout(function(){
                            window.dispatchEvent(new Event('resize'));
                        },10);
                        return;
                    }
                    stats.answers.push(item.answer);
                    var answerNodes = $('#myAnswer .multiple-choice-answer-list')[0].children,
                        i= 0;

                    if (item.rightAnswer){
                        statistics.add(stats);
                        answered = true;
                        $scope.randomImages = false;
                        $("#nextButton").show();
                        $("#infoButton").show();
                    }
                    for(;i<3;i++) {
                        var value = parseInt(answerNodes[i].attributes.getNamedItem('value').value);
                        if (item.value == value){
//                            //nur der ausgewählte in der richtigen farbe
                            if (item.rightAnswer) {
                                answerNodes[i].style.color = "green";
                            } else {
                                answerNodes[i].style.color = "red";
                            }
                        } else if(answered) {
                            answerNodes[i].style.color = "red";
                        }
                    }
                };
            },
			template:
				'<div class="question-images">' +
					'<ion-content class="dirtyInfoScrollerContent" scroll="true"><infotable infos="current.properties" style="display:none;"></infotable></ion-content>' +
					'<imagecarousel images="currentImages" random="true"></imagecarousel>' +
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
			difficulty: 0,
		};
	});
