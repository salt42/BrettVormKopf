/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global angular, document */
angular.module('BvK.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal) {

})
.controller('InitCtrl', function($scope, $state, woodGrabber, $ionicPopup, $ionicHistory, coach) {
    $scope.progress = 1;
    $scope.progressPercent = 0;
    $scope.lastJob = "";

    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    var $safeApply = function($scope, fn) {
        fn = fn || function() {};
        if($scope.$$phase) {
            fn();
        }
        else {
            $scope.$apply(fn); 
        }
    };
//    code to debug run loadbar
//    function tick() {
//        $scope.progress -= 0.01;
//        $safeApply($scope);
//        if($scope.progress <= 0)
//            return;
//        
//        setTimeout(tick, 100);
//    }
//    tick();
    document.addEventListener('imageCacheReady', function(e) {
        woodGrabber.init(
            function success() {
                $state.go($state.get('app.woods'), {});
            },
            function progress(percent, job) {
                $scope.lastJob = job || $scope.lastJob;
                $scope.progress = (1 - percent);
                $scope.progressPercent = Math.min(100, Math.floor(percent * 100));
                $safeApply($scope);
            },
            function error(msg) {
                $scope.error(msg);
            }
        );
    }, false);
    $scope.error = function(msg) {
        if (window.Connection && navigator.connection.type === Connection.NONE) return;
        var alertPopup = $ionicPopup.alert({
            title: 'Error!',
            template: msg
        });
        alertPopup.then(function(res) {
            //exit app
            ionic.Platform.exitApp();
        });
    };

})
.controller('QuestionCtrl', function($scope, coach, $ionicHistory) {
    $scope.question = coach.nextQuestion();

    $scope.questionCallBack = function(event) {
        if (event.type === "next") {
            //next question
            //$state.go("app.question", {}, {reload:true});
            $scope.question = coach.nextQuestion();
        }
    };
})
.controller('TrainingCtrl', function($scope, $state, $ionicHistory, coach, woodGrabber) {
    woodGrabber.getWoods(function(woods) {
        $scope.Woods = woods;
    });
    $scope.startTraining = function() {
        coach.setDataBase($scope.Woods);
        $state.go($state.get('app.question'), {});
    }

})
.controller('ExitCtrl', function($state) {
    try {
        navigator.Platform.exitApp();
    } catch(e) {
        $state.go($state.get('app.woods'), {});
        //go back to woods
    }
    //ionic.platform.exitApp();
});