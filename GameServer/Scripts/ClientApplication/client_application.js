var app = angular.module('slowpoke_client_app', ['ngDialog']);

app.service('slowpokeClient', function () {
    this.game = new gameBuilder('canvas').buildGame();
})
    .controller('MainCtrl', function ($scope, ngDialog, slowpokeClient) {
        $scope.activeDialog = false;
        $scope.loader = { gameLoading: true };

        //Loosed connection handler
        slowpokeClient.game.reconnectionDialogHandler =
            function () {
                if (slowpokeClient.activeDialog === true)
                    return

                slowpokeClient.activeDialog = true;
                $scope.disconnectedDialog = ngDialog.openConfirm({
                    template: 'modalDialogId',
                    className: 'ngdialog-theme-default',
                    controller: 'DisconnectedCtrl',
                    scope: $scope
                })
            };

        //Gameover handler handler
        slowpokeClient.game.gameOverDialogHandler =
           function () {
               if (slowpokeClient.activeDialog === true)
                   return

               slowpokeClient.activeDialog = true;

               $scope.disconnectedDialog = ngDialog.openConfirm({
                   template: 'modalDialogId',
                   className: 'ngdialog-theme-default',
                   controller: 'GameOverCtrl',
                   scope: $scope
               })
           };

        slowpokeClient.game.run(function () {
            $scope.loader.gameLoading = false
            $scope.$apply()
        });
    })
    .controller('DisconnectedCtrl', function ($scope, ngDialog, slowpokeClient, $window) {
        $scope.WindowName = 'Connection lost.'
        $scope.Message = 'Do you want to retry?'
        $scope.$parent.disconnectedDialog.then(function (value) {
            slowpokeClient.activeDialog = false
            slowpokeClient.game.run()
        }, function (reason) {
            slowpokeClient.activeDialog = false
            $window.location.href = 'http://www.google.com'
        })
    })
    .controller('GameOverCtrl', function ($scope, ngDialog, slowpokeClient, $window) {
        $scope.WindowName = 'Game over'
        $scope.Message = 'You has been killed dude! Do you want to start new game?'
        $scope.$parent.disconnectedDialog.then(function (value) {
            slowpokeClient.activeDialog = false
            slowpokeClient.game.run()
        }, function (reason) {
            slowpokeClient.activeDialog = false
            $window.location.href = 'http://www.google.com'
        })
    })