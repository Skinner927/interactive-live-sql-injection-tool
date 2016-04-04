(function() {
  'use strict';

  angular.module('challengePage', ['challengeSvc'])
    .directive('challengePage', function(){
      return {
        restrict: 'AE',
        scope: {},
        controller: 'challengePageCtrl',
        controllerAs: 'challenge',
        templateUrl: '/pages/challengePage/challengePage.html'
      };
    })
    .controller('challengePageCtrl', ChallengePageCtrl);


  ChallengePageCtrl.$inject = ['$stateParams', 'challengeSvc'];
  function ChallengePageCtrl($stateParams, challengeSvc){
    var vm = this;

    challengeSvc.getChallenge(+$stateParams.id)
      .then(function(challenge){
        vm.challenge = challenge;

        // DEBUG;
        console.log('challenge', challenge); // eslint-disable-line


        var res = challenge.executeQuery({
          username: 'admin',
          password: 'f9242721e561a7d35f4e512e30129469'
        });

        console.log(res.results); // eslint-disable-line
      }, function(error){
        console.error('fuck', error); // eslint-disable-line
      });
  }
})();
