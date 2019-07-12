(function() {
  'use strict';

  angular.module('resultsTable', [])
    .controller('resultsTableCtrl', ResultsTableCtrl)
    .directive('resultsTable', function(){
      return {
        restrict: 'A',
        scope: {},
        templateUrl: '/components/resultsTable/resultsTable.html',
        controller: 'resultsTableCtrl',
        controllerAs: 'tbl',
        bindToController: {
          rows: '=resultsTable'
        }
      };
    });

  function ResultsTableCtrl(){

  }

})();
