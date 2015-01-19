/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global $, app */
app.directive('imageswitch', function factory($timeout, woodGrabber) {
	var directiveDefinitionObject = {
		restrict: 'E',
		priority: -10,
		scope: {
			woodId: '=',
			random: '='
		},
		template: 	'<div class="button-overlay">' +
						'<div class="button up" ng-click="moveTypeImages(-1)">up</div>' +
						'<div class="button down" ng-click="moveTypeImages(1)">down</div>' +
						'<div class="button left" ng-click="moveType(-1)">left</div>' +
						'<div class="button right" ng-click="moveType(1)">right</div>' +
					'</div>' +
					'<ion-slide-box active-slide="activeSlide" on-slide-changed="slideHasChanged($index)" does-continue="true" show-pager="true">' +
						'<ion-slide>' +
							'<span>{{images[0].name}}</span> ' +
							'<span>{{images[0].current}} / {{images[0].count}}</span>' +
							'<div class="across-images images">' +
								'<div ng-repeat="imgURl in images[0].urls" class="img-container">' +
									'<ion-scroll zooming="true" min-zoom="1" direction="xy" >' +
										'<img ng-src="{{imgURl}}" />' +
									'</ion-scroll>' +
								'</div>' +
							'</div>' +
						'</ion-slide>' +
						'<ion-slide>' +
							'<span>{{images[1].name}}</span> ' +
							'<span>{{images[1].current}} / {{images[1].count}}</span>' +
							'<div class="profile-images images">' +
								'<div ng-repeat="imgURl in images[1].urls" class="img-container">' +
									'<ion-scroll zooming="true" min-zoom="1" direction="xy" >' +
										'<img ng-src="{{imgURl}}" />' +
									'</ion-scroll>' +
								'</div>' +
							'</div>' +
						'</ion-slide>' +
						'<ion-slide>' +
							'<span>{{images[2].name}}</span> ' +
							'<span>{{images[2].current}} / {{images[2].count}}</span>' +
							'<div class="bark-images images">' +
								'<div ng-repeat="imgURl in images[2].urls" class="img-container">' +
									'<ion-scroll zooming="true" min-zoom="1" direction="xy" >' +
										'<img ng-src="{{imgURl}}" />' +
									'</ion-scroll>' +
								'</div>' +
							'</div>' +
						'</ion-slide>' +
					'</ion-slide-box>',
    	link: function postLink(scope, iElement, iAttrs, $ionicSlideBoxDelegate) {
			scope.$watch("woodId", function(newValue) {
				//rebuild images
				if (typeof newValue !== 'number') { return; }
				woodGrabber.getWoodByID(newValue, function(wood) {

					scope.images = [
						{
							name: 'Längsschnitt',
							urls: wood.URLacross,
							count: wood.longi,
							current: 1
						},
						{
							name: 'Querschnitt',
							urls: wood.URLprofile,
							count: wood.profile,
							current: 1
						},
						{
							name: 'Rinde',
							urls: wood.URLbark,
							count: parseInt(wood.bark),
							current: 1
						}
					];

					$timeout(function(){
						var typeId = 0,
							activeType,
							imgId = 1;

						if (scope.random === true) {
							typeId = Math.floor(Math.random() * 3);
						}
						scope.slideBoxDelegate.slide(typeId);
						activeType = $('.slider-slides .slider-slide')[typeId];
						if (scope.random === true) {
							var imgCount = $('.img-container', activeType).length;
							imgId = Math.floor(Math.random() * imgCount) + 1;
						}
						$('.img-container:nth-child(' + imgId + ')').show();
						scope.images[0].current = imgId;
						scope.images[1].current = imgId;
						scope.images[2].current = imgId;
					},100);
				});
		    });

		},
		controller: function($scope, $element, $ionicGesture, $ionicSlideBoxDelegate) {
			var answerID,
				currentImageType = 0,
				imageTypesClasses = ['.across-images', '.profile-images','.bark-images' ];

			$scope.slideBoxDelegate = $ionicSlideBoxDelegate;
			$scope.moveType = function(direction) {
				console.log('nice')
				if (direction < 0) {
					$ionicSlideBoxDelegate.previous();
				} else {
					$ionicSlideBoxDelegate.next();
				}
			};
			$scope.moveTypeImages = function(direction) {
				var activeIndex = 0,
					imgContainer = $(imageTypesClasses[currentImageType] + ' .img-container'),
					i = 0;

				for (;i<imgContainer.length;i++) {
					if ($(imgContainer[i]).css('display') === 'block') {
						activeIndex = i;
						break;
					}
				}
				$(imgContainer).hide();
				if (direction > 0) {
					activeIndex = activeIndex + 1;
					if (activeIndex >= imgContainer.length) {
						activeIndex = 0;
					}
				} else {
					activeIndex = activeIndex - 1;
					if (activeIndex < 0) {
						activeIndex = imgContainer.length - 1;
					}
				}
				// komisch wenn ich die nachste zeile in den callback darunter schieb
				// gehts nich mehr mit den buttons, aber ohne $scope.$apply gehts garnich
				$scope.images[currentImageType].current = activeIndex + 1;
				$scope.$apply(function () {
				//	$scope.images[currentImageType].current = activeIndex + 1;
				});

				$(imageTypesClasses[currentImageType] + ' .img-container:nth-child(' + (activeIndex + 1) + ')').show();

			};

			$ionicGesture.on('swipedown', function (event) {
				//show next image type
				$scope.moveTypeImages(1);
			}, $element);

			$ionicGesture.on('swipeup', function (event) {
				//show next image type
				$scope.moveTypeImages(-1);
			}, $element);
			$scope.slideHasChanged = function(index) {
				currentImageType = index;
			};
		}
	};
	return directiveDefinitionObject;
});
