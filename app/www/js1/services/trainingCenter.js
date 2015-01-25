app.factory('trainingCenter', function(woodGrabber, statistics) {
	//module to manage training
	//localStorage.clear();
	var _lastQuestion;

	function saveStats() {
		localStorage.setItem('woodTrainingStats', JSON.stringify(_stats));
	}
	function updateStatistics(newQuestion, guess) {
		if (newQuestion) {
			//save new question // question is

			statistics.addQuestion(newQuestion);
		} else if (guess) {
			//update last question with one more guess // guess is id
			statistics.guessOnLastQuestion(guess);
		}
	}
	function shuffle(array) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex ;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}
	function isPropInObjArray(arr, prop, value) {
		for (var i=0;i<arr.length;i++) {
			if (arr[i][prop] === value) {
				return true;
			}
		}
		return false;
	}
	function generateAnswers(woods, result) {
		var id = Math.floor(Math.random(woods) * woods.length);

		if (result.length<3) {
			if (!isPropInObjArray(result, 'value', woods[id].id)){
				result.push({
					text: woods[id].name_de,
					value: woods[id].id
				});
			}
			return generateAnswers(woods, result);
		}
		return result;
	}
	function generateQuestion(woods) {
		var id = Math.floor(Math.random() * woods.length);
		var answers = generateAnswers(woods, [{
			text: woods[id].name_de,
			value: woods[id].id
		}]);

		return {
			wood: woods[id],
			posibleAnswers: shuffle(answers)
		};
	}

	return {
		getQuestion: function(callBack) {
			woodGrabber.getWoods(function(woods) {
				var question = generateQuestion(woods);
				_lastQuestion = question;
				updateStatistics(question.wood.id);
				callBack(question);
			});
		},
		guess: function(id) {
			updateStatistics(null, id);
			if (id === _lastQuestion.wood.id) {
				return true;
			} else {
				return false;
			}
		}
	};
});