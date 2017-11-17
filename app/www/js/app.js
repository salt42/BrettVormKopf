// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

//var serverUrl = 'http://localhost:3000/data/',
var serverUrl = 'http://bvk-saltme.rhcloud.com/data/',
    woodsUrl = serverUrl + 'img/woods/',
    imageCacheReadyEvent = new Event('imageCacheReady');

    function initImageChache() {
        ImgCache.options.debug = false;
        ImgCache.options.usePersistentCache = true;
        ImgCache.init(function() {
            setTimeout(function() {
                document.dispatchEvent(imageCacheReadyEvent);
            }, 30);
        });
    }
    if (typeof(cordova) !== 'undefined') {
        // cordova test
        console.log('cordova start');
        document.addEventListener('deviceready', initImageChache, false);
    } else {
        // normal browser test
        initImageChache();
    }
angular.module('BvK', ['ionic', 'angular-progress-arc', 'jett.ionic.filter.bar', "BvK.controllers", "BvK.services", 'BvK.training'])
.config( function( $compileProvider, $ionicConfigProvider ) {   
//    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.views.transition('none');
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|filesystem):|data:image\//);//  |filesystem:chrome-extension:
    // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
})
.run(function($ionicPlatform, $ionicPopup) {
    $ionicPlatform.ready(function() {
        if (window.Connection && navigator.connection.type === Connection.NONE) {
            $ionicPopup.confirm({
                title: "Internet Disconnected",
                content: "The internet is disconnected on your device. Please Connect and restart the App"
            })
                .then(function (result) {
                    if (!result) {
                        ionic.Platform.exitApp();
                    }
                });
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