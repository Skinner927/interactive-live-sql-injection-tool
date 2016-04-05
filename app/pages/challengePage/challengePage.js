(function() {
  'use strict';

  angular.module('challengePage', [
    'challengeSvc',
    'challengeForm',
    'sqlHighlight',
    'resultsTable'
  ])
    .directive('challengePage', function(){
      return {
        restrict: 'AE',
        scope: {},
        controller: 'challengePageCtrl',
        controllerAs: 'page',
        templateUrl: '/pages/challengePage/challengePage.html'
      };
    })
    .controller('challengePageCtrl', ChallengePageCtrl);


  ChallengePageCtrl.$inject = [
    '$scope',
    '$stateParams',
    'challengeSvc',
    '$rootScope'
  ];
  function ChallengePageCtrl($scope, $stateParams, challengeSvc, $rootScope){
    var vm = this;
    vm.formValues = {};

    // Resolve the challenge
    challengeSvc.getChallenge(+$stateParams.id)
      .then(function(challenge){
        vm.challenge = challenge;
        vm.error = '';
      }, function(error){
        vm.error = error;
      });

    // Watch form values for change then re-run the challenge
    // This should be debounced by the ng-model-options
    $scope.$watch(function(){
      return vm.formValues;
    }, function(formValues){
      if(!vm.challenge){
        return;
      }
      // Run the challenge
      vm.challenge.executeQuery(formValues);
    }, true);

    $scope.$watch(function(){
      return (vm.challenge || {}).success;
    }, function(newVal){
      if(angular.isDefined(newVal)){
        $rootScope.challengeSuccess = !!newVal;
      }
    })
  }

})();
