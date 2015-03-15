var appMy = angular.module("PaymentPage", ['ngRoute'])
    .factory('PaymentFactory', function () {
        var payment = [{Name:"to Service", Value: "Gold"},{Name: "Company",Value:"Slowpoke"}, {Name:"Amount", Value:13.33}];
        var factory = {};
        factory.GetPayment = function () { return payment; };

        return factory;
    })
    .controller("PaymentFlowController", function ($scope, PaymentFactory, $location) {
        $scope.payment = PaymentFactory.GetPayment();
        $scope.Pay = function () {
            $scope.payment.Result = "Succesfull !";
            $location.path("/PaymentResult");
        };
    })
    .config(function ($routeProvider) {
        $routeProvider.when('/', { controller: 'PaymentFlowController', templateUrl: '/StaticViewTemplates/PaymentStart.html' })
            .when('/PaymentDetails', { controller: 'PaymentFlowController', templateUrl: '/StaticViewTemplates/PaymentDetails.html' })
            .when('/PaymentResult', { controller: 'PaymentFlowController', templateUrl: '/StaticViewTemplates/PaymentResult.html' })
    });