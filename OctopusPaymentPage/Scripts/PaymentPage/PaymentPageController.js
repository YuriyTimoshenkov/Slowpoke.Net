var appMy = angular.module("PaymentPage", ['ngRoute'])
    .factory('BooksFactory', function () {
        var books = [{ Name: 'book1', Price: 33 }, { Name: 'book2', Price: 44.3 }];
        var factory = {};
        factory.GetBooks = function () { return books; };

        return factory;
    })
    .controller("SimpleController", function SimpleController($scope, BooksFactory) {
        $scope.Books = BooksFactory.GetBooks();
    });