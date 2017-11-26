/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global $, angular */
angular.module('BvK')
.directive('imagecarousel', function factory($timeout) {
	var directiveDefinitionObject = {
		restrict: 'E',
		priority: -10,
		scope: {
			images: '=',
			random: '=',
            control: '=',
		},
        template: '<div class="button-overlay">' +
                        '<div class="button up ion-arrow-up-b" ng-click="moveTypeImages(-1)"></div>' +
                        '<div class="button down ion-arrow-down-b" ng-click="moveTypeImages(1)"></div>' +
                        '<div class="button left" ng-click="moveType(-1)">left</div>' +
                        '<div class="button right" ng-click="moveType(1)">right</div>' +
                    '</div>' +
                    '<div class="imagecarousel wrapper">' +
                        '<ion-slide-box delegate-handle="imageSlides" show-pager="false" drag-content="drag" active-slide="activeSlide" on-slide-changed="slideHasChanged($index)" does-continue="true" show-pager="true">' +
                            '<ion-slide ng-repeat="image in images" ng-init="typeId = $index" class="image-type">' +
                                '<div class="img-desc"><span>{{image.name}}</span> ' +
                                '<span class="img-counter">{{image.current}} / {{image.count}}</span></div>' +
                                '<div class="across-images images">' +
                                    '<div ng-repeat="imgURl in image.urls" class="img-container">' +
                                        '<ion-scroll on-scroll="updateScrollStatus(typeId,$index)" on-release="updateScrollStatus(typeId,$index)" zooming="true" min-zoom="1" direction="xy" delegate-handle="image-{{typeId}}-{{$index}}">' +
                                            '<img ng-src="{{imgURl}}" class="blaaa">' +
                                        '</ion-scroll>' +
                                    '</div>' +
                                '</div>' +
                            '</ion-slide>' +
                        '</ion-slide-box>' + 
                    '</div>',
    	link: function postLink(scope) {
			scope.$watch("images", function(images) {
                if (!images)
                    return;
                
                for( var i = 0; i < images.length; i++) {
                    images[i].count = images[i].urls.length;
                }
                scope.typeId = 0;
                $timeout(function(){
                    var typeId = 0,
                        activeType,
                        imgId = 1;

                    if (scope.random === true) {
                        typeId = Math.floor(Math.random() * images.length);
                    }
                    scope.typeId = typeId;
                    scope.slideToType(typeId);
                    activeType = $('.slider-slides .slider-slide')[typeId];

                    $('.img-container:nth-child(' + imgId + ')').show();
                    for (var i = 0; i < scope.images.length; i++) {
                        imgId = Math.floor(Math.random() * scope.images[0].count) + 1;
                        scope.images[i].current = imgId;
                    }
                },100);
                scope.updateNavigationButtons();
            });  
		},
		controller: function($scope, $element, $ionicGesture, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
			$scope.imageTypesNames = [];
			$scope.currentImageType = 0;
            $scope.drag = false;
            $scope.zoomed = false;
            
            $scope.resetZoom = function() {
                if (!$scope.zoomed)
                    return;
                
                $scope.zoomed = false;
                $ionicScrollDelegate.zoomTo(1);
                $ionicSlideBoxDelegate.enableSlide(false);
            }
            $scope.slideToType = function(typeId) {
                $scope.resetZoom();
                $ionicSlideBoxDelegate.slide(typeId);
            }
            $scope.updateScrollStatus = function(type, img) {
                var handleName = 'image-' + type + "-" + img,
                    scrollPos = $ionicScrollDelegate.$getByHandle(handleName).getScrollPosition();
                if (typeof scrollPos !== "object" || !("zoom" in scrollPos)) 
                    return;
                
                if (scrollPos.zoom == 1) {
                    $ionicSlideBoxDelegate.enableSlide(true);
                    $scope.zoomed = false;
                } else {
                    $ionicSlideBoxDelegate.enableSlide(false);
                    $scope.zoomed = true;
                }
            };
			$scope.moveType = function(direction) {
                $scope.resetZoom();
				if (direction < 0) {
					$ionicSlideBoxDelegate.previous();
				} else {
					$ionicSlideBoxDelegate.next();
				}
			};
			$scope.moveTypeImages = function(direction) {
                $scope.resetZoom();
				var activeIndex = 0,
					imgContainer = $('.image-type:nth-child(' + ($scope.currentImageType + 1) + ')' + ' .img-container'),
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

				$scope.images[$scope.currentImageType].current = activeIndex + 1;
				$('.image-type:nth-child(' + ($scope.currentImageType + 1) + ')' + ' .img-container:nth-child(' + (activeIndex + 1) + ')').show();
			};

			var swipedown = $ionicGesture.on('swipedown', function (e) {
				//show next image type
                if ($scope.zoomed || e.gesture.velocityY < 1)
                    return;
				$scope.moveTypeImages(1);
                $scope.$apply();
			}, $element);

			var swipeup = $ionicGesture.on('swipeup', function (e) {
				//show next image type
                if ($scope.zoomed || e.gesture.velocityY > 1)
                    return;
				$scope.moveTypeImages(-1);
                $scope.$apply();
			}, $element);

			$scope.slideHasChanged = function(index) {
				$scope.currentImageType = index;
                $scope.updateNavigationButtons();
			};
            $scope.updateNavigationButtons = function(){
                //update imageTypesNames array
                for (var i = 0; i < $scope.images.length; i++) {
                    $scope.imageTypesNames[i] = $scope.images[i].short;
                }
                
                var next = 0,
                    prev = $scope.imageTypesNames.length - 1;
                
                if($scope.currentImageType + 1 < $scope.imageTypesNames.length){
                    next = $scope.currentImageType + 1;
                }
                if($scope.currentImageType - 1 >= 0){
                    prev = $scope.currentImageType - 1;
                }
                $('.button-overlay .button.right').html($scope.imageTypesNames[next]);
                $('.button-overlay .button.left').html($scope.imageTypesNames[prev]);
            };
            
            $scope.$on("$destroy",function() {
                $ionicGesture.off(swipedown, "swipedown");
                $ionicGesture.off(swipeup, "swipeup");
                $scope.imageTypesNames = null;
                $scope.currentImageType = null;
                $scope.drag = null;
                $scope.slideBoxDelegate = null;
                $scope.zoomed = null;
                $scope.images = null;
                $scope.moveType = null;
                $scope.moveTypeImages = null;
                angular.forEach(angular.element(".blaaa"), function(value){
                    var s = angular.element(value).scope()
                    s.$parent.$parent.image = null;
                    s.$destroy();
                });
            });
		}
	};
	return directiveDefinitionObject;
});
