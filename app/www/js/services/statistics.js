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
angular.module("BvK.services")
.factory('statistics', function() {
	//localStorage.clear();
	var _stats = loadStats();
  
    //_stats = null;
	if (_stats === null) {
		_stats = {
			questionStack: [],
            woods: [], //key == woodID
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
	return {
        add: function(stats) {
            //calc stas
            _stats.questionStack.push(stats.questionAnswer.id);
            //create stats by id if dosen't exist
            if (!_stats.woods[stats.questionAnswer.id]) {
                _stats.woods[stats.questionAnswer.id] = {
                    id: stats.questionAnswer.id,
                    learned: 0,
                    asked: 0,
                    count: 0,//counts for perfect row
                };
            }
            //check how many tryes was needed
            if (stats.answers.length == 1) {
                _stats.woods[stats.questionAnswer.id].learned += _stats.woods[stats.questionAnswer.id].count * 0.05 + 0.01;
                _stats.woods[stats.questionAnswer.id].count += 1;
            } else if(stats.answers.length == 2) {
                if (_stats[stats.answers[0].id]) {
                    _stats[stats.answers[0].id].count = 0;
                }
                if (_stats[stats.answers[1].id]) {
                    _stats[stats.answers[1].id].count = 0;
                }
                _stats.woods[stats.questionAnswer.id].count = 0;
                _stats.woods[stats.questionAnswer.id].learned += 0.01;
            } else if (stats.answers.length == 3){
                if (_stats[stats.answers[0].id]) {
                    _stats[stats.answers[0].id].count = 0;
                }
                if (_stats[stats.answers[1].id]) {
                    _stats[stats.answers[1].id].count = 0;
                }
                if (_stats[stats.answers[2].id]) {
                    _stats[stats.answers[2].id].count = 0;
                }
                _stats.woods[stats.questionAnswer.id].count = 0;
                _stats.woods[stats.questionAnswer.id].learned -= 0.02;
            }
            if (_stats.woods[stats.questionAnswer.id].count > 4) {
                _stats.woods[stats.questionAnswer.id].count = 0;
                _stats.woods[stats.questionAnswer.id].learned += 0.1;
            }
            _stats.woods[stats.questionAnswer.id].asked++;
            if (_stats.woods[stats.questionAnswer.id].learned > 1) { _stats.woods[stats.questionAnswer.id].learned = 1; }
            if (_stats.woods[stats.questionAnswer.id].learned < 0) { _stats.woods[stats.questionAnswer.id].learned = 0; }
            saveStats();
        },
		getWoodStats: function (woodID) {
            if (typeof _stats.woods[woodID] != "object" || _stats.woods[woodID] === null) {
                return {
                    id: woodID,
                    learned: 0,
                    count: 0,
                    asked: 0,
                };
            }
            return _stats.woods[woodID];
		},
		guessOnLastQuestion: function (woodID) {

		},
		forceCalculate: function () {

		},
		getStats: function () {
		}
	};
});