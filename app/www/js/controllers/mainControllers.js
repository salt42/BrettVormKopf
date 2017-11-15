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
    if(coach.isReady()) {
        $state.go($state.get('app.woods'), {});
        return;
    }
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
//        return;
        woodGrabber.init(
            function success(data) {
                $state.go($state.get('app.woods'), {});
            },
            function progress(percent, job) {
                $scope.lastJob = job;
                $scope.progress = (1 - percent);
                $scope.progressPercent = Math.round(percent * 100);
                $safeApply($scope);
            },
            function error(msg) {
                $scope.error(msg);
            }
        );
    }, false);
//    $scope.downlaod = function() {
//        woodGrabber.prepareOffline(function succsess() {
//            $state.go($state.get('app.woods'), {});
//        }, function progress(percent) {
//            $scope.progress = percent;
//            $scope.progressPercent = Math.round($scope.progress * 100);
//            $scope.$apply();
//        });
//    };
    $scope.error = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Not connected!',
            template: 'for the first time i need internet to download data!'
        });
        alertPopup.then(function(res) {
            //exit app
        });
    };

})
.controller('QuestionCtrl', function($scope, coach, $state, woodGrabber) {
    if(!coach.isReady()) {
        woodGrabber.getWoods(function(woods) {
            coach.setDataBase(woods);
            $scope.question = coach.nextQuestion();
        });
        //$state.go($state.get('app.training'), {}, {reload: ''});
    } else {
        $scope.question = coach.nextQuestion();
    }
    $scope.questionCallBack = function(event) {
        if (event.type === "next") {
            //next question
            //$state.go("app.question", {}, {reload:true});
            $scope.question = coach.nextQuestion();
        }
    };
})
.controller('TrainingCtrl', function($scope, $state, coach, woodGrabber) {
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