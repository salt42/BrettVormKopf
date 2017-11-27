/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global angular, document */
angular.module('BvK.controllers')
.controller('WoodsCtrl', function($scope, woodGrabber, statistics, $ionicFilterBar) {
    var filterBarInstance,
        allWoods;
    
    woodGrabber.getWoods(function(woods) {
        var listData = []
        for (var i=0; i < woods.length; i++) {
            listData[i] = {};
            listData[i].id = woods[i].id;
            listData[i].name_de = woods[i].name_de;
            listData[i].name_bo = woods[i].name_bo;
            listData[i].woodtype = woods[i].woodtype;
            listData[i].heartwood = woods[i].heartwood;
            listData[i].stats = statistics.getWoodStats(woods[i].id);
            listData[i].preview = woods[i].preview;
            if (listData[i].stats) {
                listData[i].stats.learnedPercent = Math.round((listData[i].stats.learned || 0) * 100);
            }
        }
        allWoods = listData;
        $scope.woods = allWoods.slice();
    });
    $scope.showFilterBar = function () {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.woods,
            update: function (filteredItems, filterText) {
                $scope.woods = filteredItems;
                if (filterText) {
                }
            }
        });
    };
})
.controller('WoodCtrl', function($scope, $state, $stateParams, woodGrabber, $timeout, $ionicHistory) {
    woodGrabber.getWoodByID($stateParams.woodid, function(wood) {
        wood.images = [
            {
                name: 'Längsschnitt',
                short: 'Längs',
                urls: wood.URLacross
            },
            {
                name: 'Querschnitt',
                short: 'Quer',
                urls: wood.URLprofile
            },
            {
                name: 'Rinde',
                short: 'Rinde',
                urls: wood.URLbark
            }
        ];
        $scope.Wood = wood;
    });
    $scope.backToWoods = function() {
        if ($ionicHistory.backView() != null) {
              history.back();

        } else {
            $state.go($state.get('app.woods'), {});
        }
    };
    $timeout(function() {
//        $('.wood-images').hide();
        $('.wood-images').css('margin-top', '0px');
    }, 100);
});