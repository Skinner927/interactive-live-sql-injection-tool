(function() {
  'use strict';

  angular.module('sideNavigation', [])
    .controller('sideNavigationCtrl', SideNavigationCtrl)
    .directive('sideNavigation', function(){
      return {
        restrict: 'AE',
        scope: {},
        templateUrl: '/components/sideNavigation/sideNavigation.html',
        controller: 'sideNavigationCtrl',
        controllerAs: 'nav'
      };
    });

  SideNavigationCtrl.$inject = ['$http'];
  function SideNavigationCtrl($http){
    var vm = this;

    // Pull the challenge config file to see how many we have
    $http.get('/challenges/index.json')
      .then(function(data){
        vm.challenges = data.data.challenges;
      });
  }

})();
