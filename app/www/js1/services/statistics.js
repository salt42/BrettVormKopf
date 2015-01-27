/*
also von anfang bis ende
jede neue frage erstellt ein frage obj auf nem stack
die wird mit den antworten erweitert und dann kommt die nächste
der stack wird dann cronjob mässig geparsed und in die statistik gerechnet

auserdem wird für jedes holz eine kleine extra statistik geführt.
da steht dann drin wie gut man des stück beherscht

die generele statistik: da stellt sich mir die frage wo da der mehrwert is weil des wichtigste is eigentlich
zu wissen wie gut man die einzelnen hölzer kann

 */

app.factory('statistics', function() {
	//localStorage.clear();
	var _stats = loadStats();

	if (_stats === null) {
		_stats = {
			questionStack: [],
			calcedStats: {
				score: 1,
				answered: 0,
				instantRight: 0
			}
		};
		saveStats();
	}
	function saveStats() {
		localStorage.setItem('woodTrainingStats', JSON.stringify(_stats));
	}
	function loadStats() {
		return _stats = JSON.parse(localStorage.getItem('woodTrainingStats'));
	}
	function calculate (calculationFunction) {
		var len = _stats.questionStack.length,
			i = 0;

		for (;i<len;i++) {
			if (typeof calculationFunction === 'function') {
				calculationFunction.call(_stats.calcedStats, _stats.questionStack[i]);
			}
		}
		_stats.questionStack = [];
		saveStats();
	}
	return {
		addQuestion: function (woodID) {
			var questionStats = {
				woodID: woodID,
				guesses: [],
				answered: false
			}

			_stats.questionStack.push(questionStats);
			saveStats();
		},
		guessOnLastQuestion: function (woodID) {
			var lastQuestion = _stats.questionStack.pop();
			lastQuestion.guesses.push(woodID);
			if (lastQuestion.woodID === woodID) {
				lastQuestion.answered = true;
			}
			_stats.questionStack.push(lastQuestion);
			saveStats();
			return lastQuestion.answered;
		},
		forceCalculate: function () {
			calculate(function(questionStats) {
				if (questionStats.answered !== true) { return; }
				var score = 0;
				if (questionStats.guesses.length === 1) {
					score = 3;
					this.instantRight++;
				} else if (questionStats.guesses.length === 2) {
					score = 1;
				}
				this.score = this.score + score;
				this.answered++;
			});
		},
		getStats: function () {
			return _stats.calcedStats;
		}
	};
});