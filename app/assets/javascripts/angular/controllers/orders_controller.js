(function() {
var app = angular.module('taxi', ['ngRoute', 'ngDialog']);

app.controller('CreateOrderController', ['$scope', '$http', function($scope, $http) {
  $scope.options = {
    availableOptions: [
      {value: '1'}, {value: '2'}, {value: '3'}, {value: '4'},
      {value: '5'}, {value: '6'}, {value: '7'}, {value: '8'}
    ],
    selectedOption: {value: '1'}
  };
  $scope.phone_pattern = /(0)[0-9]{9}/;
  $scope.email_pattern = /^(.+)@(.+)$/;
  $scope.disabled = false;

  $scope.addOrder = function() {
    if (!$scope.ngDialogData.email) {
      $scope.ngDialogData.email = '';
    }
    $scope.ngDialogData.email = $scope.ngDialogData.email.toLowerCase();
    $scope.ngDialogData.passengers = $scope.options.selectedOption.value;
    $http.post('/orders', {order: $scope.ngDialogData}).success(function(data){
      alert('Ваш заказ принят!');
      $scope.disabled = true;
      $scope.orderForm.$setPristine();
      $scope.orderForm.$setUntouched();
      $scope.ngDialogData = {};
    });
  };

}]);


app.controller('DriversController', ['$scope', '$http', function($scope, $http) {

  $http.get('/drivers/orders.json').success(function(data){
    $scope.orders = data;
  });

  $scope.deleteOrder = function(order) {
    var index = $scope.orders.indexOf(order);
    $scope.orders.splice(index, 1);
  };

  $scope.putMethod = function(order) {
    var url = '/drivers/orders/' + order.id;
    $http.put(url, {order: order});
  };

  $scope.acceptOrder = function(order) {
    order.status = 'accepted';
    $scope.putMethod(order);
  };

  $scope.declineOrder = function(order) {
    order.status = 'declined';
    $scope.putMethod(order);
    $scope.deleteOrder(order);
  };

  $scope.arrivedToOrder = function(order) {
    order.status = 'arrived';
    $scope.putMethod(order);
  };

  $scope.orderFulfilled = function(order) {
    order.status = 'done';
    $scope.putMethod(order);
    $scope.deleteOrder(order);
  };

}]);

app.controller('DispatchersController', ['$scope', '$http', 'ngDialog', function($scope, $http, ngDialog) {
  $scope.options = {
    availableOptions: [
      {value: '1'}, {value: '2'}, {value: '3'}, {value: '4'}, 
      {value: '5'}, {value: '6'}, {value: '7'}, {value: '8'}
    ],
    selectedOption: {value: '1'}
  };
  $scope.phone_pattern = /(0)[0-9]{9}/;
  $scope.email_pattern = /^(.+)@(.+)$/;
  $scope.isDispatcher = true;

  $http.get('/dispatchers/orders.json').success(function(data){
    $scope.orders = data;
  });

  $http.get('/drivers.json').success(function(data){
    $scope.drivers = data;
  });

  $scope.create = function(){
    ngDialog.open({ template: 'templates/order.html', controller: 'DispatchersController', className: 'ngdialog-theme-default' });
  };

  $scope.addOrder = function(){
    $scope.ngDialogData.passengers = $scope.options.selectedOption.value;
    if ($scope.ngDialogData.driver_id) {
      $scope.ngDialogData.driver_id = $scope.ngDialogData.driver_id.id;
      $scope.ngDialogData.status = 'waiting';
    }
    $http.post('/orders', {order: $scope.ngDialogData}); //need to check url
    return true;
  };

  $scope.update = function(order){
    order.isUpdating = true;
    ngDialog.open({ template: 'templates/order.html', data: order, controller: 'DispatchersController', className: 'ngdialog-theme-default' });
  };

  $scope.updateOrder = function() {
    if ($scope.ngDialogData.driver_id) {
      $scope.ngDialogData.driver_id = $scope.ngDialogData.driver_id.id;
      $scope.ngDialogData.status = 'waiting';
    }
    $http.put('/orders/', {order: $scope.ngDialogData});
    return true;
  };

  $scope.confirmCancel = function(order){
    ngDialog.open({ template: 'confirm', data: order, controller: 'DispatchersController', className: 'ngdialog-theme-default' });
  }

  $scope.cancelOrder = function() {
    $scope.ngDialogData.status = 'canceled'; 
    $http.put('/orders/', {order: $scope.ngDialogData}).success(function(data){
      var index = $scope.orders.indexOf(data);
      $scope.orders.splice(index, 1);
    });
    return true;
  };

// will be received by $http methods (need to check url's), just to test
  $scope.orders = [
    {
     phone: '0987654321',
     id: 1,
     created_at: "17.10.2016 18:15",
     start_point: 'start point 1',
     end_point: 'end point 1',
     passengers: '3',
     baggage: true,
     comment: 'comment 1'  
    },
    {
     phone: '0932323221',
     id: 2,
     created_at: "17.10.2016 18:05",
     start_point: 'start point 2',
     end_point: 'end point 2',
     passengers: '1',
     baggage: false,
     comment: 'comment 2'
    },
    {
     phone: '0988585541',
     id: 3,
     created_at: "17.10.2016 17:55",
     start_point: 'start point 3',
     end_point: 'end point 3',
     passengers: '2',
     baggage: true,
     comment: 'comment 3'
    }
  ];

  $scope.drivers = [
   {
    id: 1,
    name: 'Вася Иванов',
    avatar: 'avatars/cat.jpg',
    phone: '0998855221',
    car_type: 'Lada Priora',
    passengers: '4',
    trunk: '2'
   },
   {
    id: 2,
    name: 'Петя Сидоров',
    avatar: null,
    phone: '0955142356',
    car_type: 'Lada Sedan',
    passengers: '4',
    trunk: '2'
   }
  ];

}]);

app.directive('orderForm', function(){
  return {
    restrict: 'E',
    templateUrl: 'templates/order.html'
  };
});

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
    .when('/', {
      templateUrl: 'templates/home.html',
      controller: 'CreateOrderController'
    })
    .when('/drivers/orders', {
      templateUrl: 'templates/driver.html',
      controller: 'DriversController'
    })
    .when('/dispatchers/profile', {
      templateUrl: 'templates/dispatcher.html',
      controller: 'DispatchersController'
    })
    .otherwise({
      redirectTo: '/'
    })
}]);

}) ();
