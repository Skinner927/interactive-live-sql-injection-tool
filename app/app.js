(function() {
  'use strict';

  angular.module('sqliApp', [
    'ui.router',

    // Pages
    'challengePage',
    'sideNavigation'
  ])
    .config(Config);



  Config.$inject = ['$stateProvider', '$urlRouterProvider'];
  function Config($stateProvder, $urlRouterProvider){

    $urlRouterProvider.otherwise("/challenge/1");

    $stateProvder
      .state('challenge', {
        url: '/challenge/{id:[0-9]+}',
        template: '<challenge-page></challenge-page>'
      });
  }
})();
