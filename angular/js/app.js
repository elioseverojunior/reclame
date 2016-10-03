'use strict';

var reclameApp = angular.module('reclameApp',
                              ['ngRoute', 'ngAnimate', 'ui.bootstrap',
                              'ui.bootstrap.modal', 'nvd3'] );

reclameApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/inicio', {
		            templateUrl: 'templates/inicio.html',
		            controller:  'AppCtrl'
	    })
    .when('/relogio', {
  		            templateUrl: 'templates/relogio.html',
  		            controller:  'ClockCtrl'
  	})
    .when('/dashboard', {
		            templateUrl: 'templates/dashboard.html',
		            controller:  'DashCtrl'
	    })
    .when('/lista', {
  	            templateUrl: 'templates/lista.html',
  	            controller:  'ListaCtrl'
  	  })
      .otherwise({
		            redirectTo: '/inicio'
        });
  }]);

  angular.module('reclameApp').factory('company', function(){
    var company = {};
    company.id = '';
    company.fantasyName = '';
    company.complaints = [];
    company.selectedTone = '';
    return company;
  });

reclameApp.controller('AppCtrl', function ($scope, $uibModal, $log, $http, company) {
    $scope.openLoad = function (size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'LoadModalContent.html',
        controller: 'LoadModalInstanceCtrl',
        size: size,
        resolve: {}
      });
    };
});

reclameApp.controller('ClockCtrl', function($scope, $timeout, $http, $location, $interval, company) {
  $scope.alerts = [];
  $scope.inprogress = 1;
  var promise = {};
  var consulta = function (){
    $http.get('/api/complaints/pollinprogress?companyid=' + company.id ).
    success(function(data, status, headers, config) {
      $scope.inprogress = data.inprogress;
      if ($scope.inprogress == 0) {
        $interval.cancel(promise);
        $location.path('/dashboard');
      }
    }).
    error(function(data, status, headers, config) {
      $scope.alerts.push({ type: 'danger', msg: 'Erro ao fazer polling. Status: ' + status });
    });
  };
  if (company.id != ''){
    promise = $interval(consulta, 5000, 60); //max 5min
    $scope.$on('$destroy',function(){
        if(promise)
            $interval.cancel(promise);
    });
  } else {
    $location.path('/inicio');
  };
});

reclameApp.controller('ListaCtrl', function($scope, $http, $location, company) {
  if (company.id != ''){
    $scope.alerts = [];
    $scope.company = company;
    $scope.complaints = [];
    $scope.show = false;
    $http.get('/api/complaints/listacomplaints?companyid=' + company.id +
                                              '&tone=' + company.selectedTone).
      success(function(data, status, headers, config) {
        $scope.show = true;
        $scope.complaints = data[0];
      }).
      error(function(data, status, headers, config) {
        $scope.alerts.push({ type: 'danger', msg: 'Erro ao consultar. Status: ' + status });
      });
  } else {
      $location.path('/inicio');
  };
});

reclameApp.controller('DashCtrl', function ($scope, $uibModal, $log, $http,
                                            $location, company) {
  $scope.company = company;
  $scope.alerts = [];
  $scope.show = false;
  $scope.emotion_options = {
      chart: {
          type: 'discreteBarChart',
          height: 450,
          noData: '',
          margin : {
              top: 20,
              right: 20,
              bottom: 60,
              left: 55
          },
          x: function(d){ return d.label; },
          y: function(d){ return d.value; },
          showValues: true,
          valueFormat: function(d){
              return d3.format(',.0f')(d);
          },
          transitionDuration: 500,
          xAxis: {
              axisLabel: 'Emoção'
          },
          yAxis: {
              axisLabel: 'qtd',
              axisLabelDistance: 30
          },
          discretebar: {
            dispatch: {
              elementClick:
                function (e){
                  company.selectedTone = e.data.label;
                  $location.path('/lista');
                  $scope.$apply();
                }
            }
          }
      }
  };
  $scope.emotion_data = { };
  $scope.language_options = {
      chart: {
          type: 'discreteBarChart',
          height: 450,
          noData: '',
          margin : {
              top: 20,
              right: 20,
              bottom: 60,
              left: 55
          },
          x: function(d){ return d.label; },
          y: function(d){ return d.value; },
          showValues: true,
          valueFormat: function(d){
              return d3.format(',.0f')(d);
          },
          transitionDuration: 500,
          xAxis: {
              axisLabel: 'Linguagem'
          },
          yAxis: {
              axisLabel: 'qtd',
              axisLabelDistance: 30
          },
        discretebar: {
          dispatch: {
            elementClick:
              function (e){
                company.selectedTone = e.data.label;
                $location.path('/lista');
                $scope.$apply();
              }
          }
        }
      }
  };
  $scope.language_data = { };
  $scope.social_options = {
      chart: {
          type: 'discreteBarChart',
          height: 450,
          noData: '',
          margin : {
              top: 20,
              right: 20,
              bottom: 60,
              left: 55
          },
          x: function(d){ return d.label; },
          y: function(d){ return d.value; },
          showValues: true,
          valueFormat: function(d){
              return d3.format(',.0f')(d);
          },
          transitionDuration: 500,
          xAxis: {
              axisLabel: 'Social'
          },
          yAxis: {
              axisLabel: 'qtd',
              axisLabelDistance: 30
          },
        discretebar: {
          dispatch: {
            elementClick:
              function (e){
                company.selectedTone = e.data.label;
                $location.path('/lista');
                $scope.$apply();
              }
          }
        }
      }
  };
  $scope.social_data = { };
  if (company.id != ''){
    $http.get('/api/companies/tonessummary?companyid=' + company.id ).
    success(function(data, status, headers, config) {
      $scope.emotion_data = [data.emotion];
      $scope.language_data = [data.language];
      $scope.social_data = [data.social];
      $scope.show = true;
    }).
    error(function(data, status, headers, config) {
      $scope.alerts.push({ type: 'danger', msg: 'Erro ao obter resumo dos tons. Status: ' + status });
    });
  } else {
    $location.path('/inicio');
  }
});

reclameApp.controller('LoadModalInstanceCtrl', function ($scope, $uibModalInstance, $http, $location, company) {
  //form defaults
  $scope.selectedCompany = {};
  $scope.alerts = [];
  $scope.companies = [];
  $scope.step='1';
  $scope.search = function () {
    var companyname = $scope.searchfield;
    $http.get('/api/companies/search?companyname=' + companyname ).
    success(function(data, status, headers, config) {
      $scope.companies = data;
      if (data.length > 0)
        $scope.step='2';
      else
        $scope.alerts.push({ type: 'danger', msg: companyname + ' não encontrada.' });
    }).
    error(function(data, status, headers, config) {
      $scope.alerts.push({ type: 'danger', msg: 'Erro ao carregar os dados. Status: ' + status });
    });
  };
  $scope.load = function () {
    $http.get('/api/complaints/load?&company=' + $scope.selectedCompany.id).
    success(function(data, status, headers, config) {
      $scope.alerts.push({ type: 'success', msg: 'Dados carregados com sucesso!' });
    }).
    error(function(data, status, headers, config) {
      $scope.alerts.push({ type: 'danger', msg: 'Erro ao carregar os dados. Status: ' + status });
    });
  };
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
  $scope.processar = function () {
    if ($scope.selectedCompany.id != null) {
      $uibModalInstance.close();
      company.id = $scope.selectedCompany.id;
      company.fantasyName = $scope.selectedCompany.fantasyName;
      $scope.load();
      $location.path('/relogio');
    };
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
