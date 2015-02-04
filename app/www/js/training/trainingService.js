//service für den trainingManager
//api:
//next()
//registerQuestionary()
angular.module("BvK.training.questionnaires", [])
angular.module('BvK.training', ['BvK.training.questionnaires'])
	.config(function() {})
	.factory('coach', function() {
		//load topic's


		function nextQuestion() {
			return {
				answer: {
					name: 'testHolz',
					images: [
						{
							name: 'Längsschnitt',
							short: 'Längs',
							urls: ['http://www.rheinneckarblog.de/files/2013/09/bock_logo_k.jpg', 'https://www.bmbf.de/_img/publications/Vorschaubild_Flyer_BAfoeG_n.jpg']
						},
						{
							name: 'Querschnitt',
							short: 'Quer',
							urls: ['http://www.rheinneckarblog.de/files/2013/09/bock_logo_k.jpg', 'https://www.bmbf.de/_img/publications/Vorschaubild_Flyer_BAfoeG_n.jpg']
						},
						{
							name: 'Rinde',
							short: 'Rinde',
							urls: ['http://www.rheinneckarblog.de/files/2013/09/bock_logo_k.jpg', 'https://www.bmbf.de/_img/publications/Vorschaubild_Flyer_BAfoeG_n.jpg']
						}
					],
					properties: {
						name_bo: 'testHolz',
						holzart: 'nadelholz'
					}
				},
				failAnswers: [
					{
						name: 'failHolz1',
						images: [
							{
								name: 'Längsschnitt',
								short: 'Längs',
								urls: ['http://www.rheinneckarblog.de/files/2013/09/bock_logo_k.jpg', 'http://www.rheinneckarblog.de/files/3/09/bock_logo_k.jpg']
							},
							{
								name: 'Querschnitt',
								short: 'Quer',
								urls: ['http://www.rheinneckarblog.de/files/2013/09/bock_logo_k.jpg', 'http://www.rheinneckarblog.de/files/23/09/bock_logo_k.jpg']
							},
							{
								name: 'Rinde',
								short: 'Rinde',
								urls: ['http://www.rheinneckarblog.de/files/2013/09/bock_logo_k.jpg', 'http://www.rheinneckarblog.de/files/3/09/bock_logo_k.jpg']
							}
						],
						properties: {
							name_bo: 'failHolz1',
							holzart: 'nadelholz'
						}
					},{
						name: 'failHolz2',
						images: [
							{
								name: 'Längsschnitt',
								short: 'Längs',
								urls: ['http://www.rheinneckarblog.de/files/2013/09/bock_logo_k.jpg', 'http://www.rheinneckarblog.de/files/2/09/bock_logo_k.jpg']
							},
							{
								name: 'Querschnitt',
								short: 'Quer',
								urls: ['http://www.rheinneckarblog.de/files/2013/09/bock_logo_k.jpg', 'http://www.rheinneckarblog.de/files/20/09/bock_logo_k.jpg']
							},
							{
								name: 'Rinde',
								short: 'Rinde',
								urls: ['http://www.rheinneckarblog.de/files/2013/09/bock_logo_k.jpg', 'http://www.rheinneckarblog.de/files/2/09/bock_logo_k.jpg']
							}
						],
						properties: {
							name_bo: 'failHolz2',
							holzart: 'laubholz'
						}
					}
				],
				difficulty: 1,
				questionnaire: 'allimages' // random, (severity), explizit name
			}
		}

		return {
			nextQuestion: nextQuestion,
			guess: function(){},

			setTopic: function(topicName){},
			setDifficulty: function(){}
		};
	});
