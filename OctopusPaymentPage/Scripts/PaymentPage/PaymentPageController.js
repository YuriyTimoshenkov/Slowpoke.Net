var app = angular.module("PaymentPage", ['ngRoute'])
    .factory('PaymentFactory', function () {
        return {

        };
    })
    .controller("PaymentFlowController", function ($scope, $http, PaymentRequest, PaymentFactory, $location) {
        $scope.orderDetails = [
            { Name: "to Service", Value: PaymentRequest.ServiceName },
            { Name: "Company", Value: PaymentRequest.CompanyName },
            { Name: "Amount", Value: PaymentRequest.Amount }];

        $scope.payment = { CardNumber: '1111-1111-1111-1111' };

        $scope.returnUrl = PaymentRequest.ReturnUrl;
        $scope.orderId = PaymentRequest.OrderId;
        $scope.payment.Confirmation = false;

        if (PaymentFactory.Payment) {
            $scope.payment.Result = PaymentFactory.Payment.Result;
        }

        $scope.Pay = function () {
            $scope.payment.Confirmation = true;

            $http.get('/paymentapi/confirm/' + $scope.orderId).then(function (result)
            {
                var self = $scope;
                if (result.data == true)
                {
                    PaymentFactory.Payment = { Result : { isSuccess: true, Message: 'Successful' }};
                }
                else
                {
                    PaymentFactory.Payment = { Result: { isSuccess: false, Message: 'Unsuccessful' } };
                }

                $location.path("/PaymentResult");
                
            }, function (errResponse)
            {
                $scope.payment.Result = { isSuccess: false, message: 'Unsuccessful' };
                $location.path("/PaymentResult");
            });
        }
    })
    .config(function ($routeProvider) {
        $routeProvider.when('/', { controller: 'PaymentFlowController', templateUrl: '/StaticViewTemplates/PaymentStart.html' })
            .when('/PaymentDetails', { controller: 'PaymentFlowController', templateUrl: '/StaticViewTemplates/PaymentDetails.html' })
            .when('/PaymentResult', { controller: 'PaymentFlowController', templateUrl: '/StaticViewTemplates/PaymentResult.html' })
    });