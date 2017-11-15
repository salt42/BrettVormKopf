angular.module('BvK.training')
	.directive('questionnaire', function ($compile) {
		var _question = null,
			_questionnaires = [],
			_questionnairesHash = [],
			_template = '';

		//laod questionnaires
		var invokeQueue = angular.module("BvK.training.questionnaires")._invokeQueue;
		for (var i=0;i<invokeQueue.length;i++) {
			_questionnaires.push(invokeQueue[i][2][1].call({
				uselessButGood2know: function() {
				},
			}));
			_questionnairesHash.push(invokeQueue[i][2][0]);
		}

		function createTemplateFrom(index) {
			_template = '<' + _questionnairesHash[index] + '></' + _questionnairesHash[index] + '>';
		}
		function configure(question) {
			var index = 0;

			if (typeof question !== 'object') { return false; }
			switch(question.questionnaire) {
				case 'random':
					//random select
					index = Math.floor(Math.random() * _questionnaires.length);
					createTemplateFrom(index);
					break;
				case 'difficulty':
					//select questionnaire random based on difficulty
					break;
				default:
					//explicit
					index = _questionnairesHash.indexOf(question.questionnaire);
					if(index > -1) {
						createTemplateFrom(index);
					} else {
						console.error('questionnaire not found', _questionnairesHash);
					}
			}
			_question = question;
		}

		var linker = function(scope, element, attrs) {
            createTemplateFrom(0);
            var childScope = scope.$new(false, scope);
            var compiledDirective = $compile(_template);
            var directiveElement = compiledDirective(childScope);
            element.append(directiveElement);
			scope.$watch("question", function(newQuestion) {
				//configure(newQuestion);
				//element.html(_template).show();
				//$compile(element.contents())(scope);
			});
            scope.$on("$destroy",function() {
                //$( window ).off( "resize.Viewport" );
				//element.unbind();
                childScope.$destroy();
                element.empty();
                childScope = null;
            });    
		}

		return {
			restrict: "E",
			link: linker,
			scope: {
				question: "=",
				callback: "&"
			}
		};
	});
