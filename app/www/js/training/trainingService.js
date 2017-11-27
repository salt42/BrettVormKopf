//service für den trainingManager
//api:
//next()
//registerQuestionary()
angular.module("BvK.training.questionnaires", [])
angular.module('BvK.training', ['BvK.training.questionnaires'])
	.config(function() {})
	.factory('coach', function(statistics) {
        var _level = 1,
            _dataBase;
    
        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex ;
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }
        function getByID(id) {
            for (var i = 0; i < _dataBase.length; i++) {
                if (_dataBase[i].id === id ) {
                    return _dataBase[i];
                }
            }
            return false;
        }
        function getByValue(src, name, value) {
            var res = [];
            for (var i = 0; i < src.length; i++) {
                if (src[i][name] === value ) {
                    res.push(src[i]);
                }
            }
            return res;
        }
        
        /** calcs the next questionAnswer
         *  @return {number} answer id
         */
        function selectAnswer() {
            //filter alle die schlecht sind getWoodStats
            return Math.floor(Math.random() * _dataBase.length);
        }
        /** 
         *  @return {array} of id's
         */
        function selectFailAnswers(answerId) {
            var res = [],
                answer = getByID(answerId),
                learned = statistics.getWoodStats(answerId).learned,
                aType = (answer.woodtype > 0)?1:0;

            // filter database for potential fail answers and remove the confusion
            var fails = _dataBase.slice();
            fails.splice(answerId, 1);
            for (var i = 0; i < fails.length; i++) {
                if (answer.confusionIds.indexOf(fails[i].id) >= 0) {
                    fails.splice(i, 1);
                    i--;
                    continue;
                }
                //@todo vroni fragen wegen den 3? woodtypes
                var type = (fails[i].woodtype > 0)?1:0;
                if (type != aType) {
                    fails.splice(i, 1);
                    i--;
                }
            }
            //add random fail
            var index = Math.floor(Math.random() * fails.length);
            res.push(fails[index].id);
            fails.splice(index, 1);
            if (learned < 0.5) {
                index = Math.floor(Math.random() * fails.length);
                res.push(fails[index].id);
            } else {
                if (answer.confusionIds.length > 0) {
                    //add a confusion
                    res.push(answer.confusionIds[Math.floor(Math.random() * answer.confusionIds.length)]);
                } else {
                    index = Math.floor(Math.random() * fails.length);
                    res.push(fails[index].id);
                }
            }
            return res;
        }

        /** 
         *  @return {object} answer object
         */
        function generateAnswer(id) {
            var answerItem = getByID(id);
            
            if (!answerItem) return false;
            var answer = {
                name: answerItem.name_de,
                id: id,
                images: [
                    {
                        name: 'Längsschnitt',
                        short: 'Längs',
                        urls: answerItem.URLacross
                    },
                    {
                        name: 'Querschnitt',
                        short: 'Quer',
                        urls: answerItem.URLprofile
                    },
                    {
                        name: 'Rinde',
                        short: 'Rinde',
                        urls: answerItem.URLbark
                    }
                ],
                properties: answerItem.properties
            };
            return answer;
        }
        /** 
         *  @return {object} question qbject
         */
        function generateQuestion() {
            var answerID = selectAnswer(),
                failAnswerIds = selectFailAnswers(answerID),
                answer = generateAnswer(answerID),
                question = {};
            
            question.answer = answer;
            question.failAnswers = [];
            question.difficulty = 1;
            question.questionnaire = 'allimages'; // random, (severity), explizit name
            for (var i=0; i<failAnswerIds.length; i++) {
                question.failAnswers.push(generateAnswer(failAnswerIds[i]) );
            }
            return question;
        }
        /** calc current level from stats
         *  @return {number} level
         */
        function calcLevel() {
            var learned = 0;
            
            for(var i = 0; i < _dataBase.length; i++) {
                learned += statistics.getWoodStats(_dataBase[i].id).learned;
            }
            learned /= _dataBase.length;
            if (learned >= 1)
                return 4;
            return Math.floor(learned * 4) + 1;//level 5 is complet
        }
        /** 
         *  @return {object} question qbject
         */
		function nextQuestion() {
            _level = calcLevel();
            var d = generateQuestion();
            return d;
		}
		return {
			nextQuestion: nextQuestion,
            
			setDataBase: function(data){
                _dataBase = data;
            },
            isReady: function () {
                if (_dataBase) {
                    return true;
                } else {
                    return false;
                }
            }
		};
	});
