// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var imageCacheReadyEvent = new Event('imageCacheReady');

angular.module('BvK', ['ionic', 'angular-progress-arc', 'jett.ionic.filter.bar', "BvK.controllers", "BvK.services", 'BvK.training'])
.config( function( $compileProvider, $ionicConfigProvider ) {   
//    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.views.transition('none');
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|filesystem):|data:image\//);//  |filesystem:chrome-extension:
    // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
})
.run(function($ionicPlatform, $ionicPopup, woodGrabber) {
    $ionicPlatform.ready(function() {
        function checkConnection() {
            if (window.Connection && navigator.connection.type === Connection.NONE) {
                $ionicPopup.confirm({
                    title: "Internet Disconnected",
                    content: "The internet is disconnected on your device. Please Connect and restart the App",
                    cancelText: 'Close App',
                    okText: 'Retry'
                })
                    .then(function (result) {
                        console.log(result);
                        if (!result) {
                            ionic.Platform.exitApp();
                        } else {
                            checkConnection();
                        }
                    });
            } else {
                document.dispatchEvent(imageCacheReadyEvent);
            }
        }
        if (woodGrabber.hasData()) {
            //timeout needed for browser support
            setTimeout(function() {
                document.dispatchEvent(imageCacheReadyEvent);
            }, 80);
        } else {
            checkConnection();
        }
        if(window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.init', {
      url: "/init",
      views: {
        'mainContent' : {
            templateUrl: "templates/init.html",
            controller: "InitCtrl"
        }
      }
    })
    .state('app.training', {
      url: "/training",
      cache: false,
      views: {
        'mainContent' : {
            templateUrl: "templates/training.html",
            controller: 'TrainingCtrl'
        }
      }
    })
    .state('app.question', {
        url: "/question",
        cache: false,
        views: {
          'mainContent' : {
            templateUrl: "templates/question.html",
            controller: 'QuestionCtrl'
          }
        }
      })
    .state('app.woods', {
      url: "/woods",
      cache: false,
      views: {
        'mainContent' : {
          templateUrl: "templates/woods.html",
          controller: "WoodsCtrl"
        }
      }
    })
    .state('app.wood', {
      url: "/woods/:woodid",
      cache: false,
      views: {
        'mainContent' : {
          templateUrl: "templates/wood.html",
          controller: 'WoodCtrl'
        }
      }
    })
    .state('app.exit', {
      url: "/exit",
      views: {
        'mainContent' : {
          templateUrl: "templates/exit.html",
          controller: "ExitCtrl"
        }
      }
    });
    $urlRouterProvider.otherwise('/app/init');
});