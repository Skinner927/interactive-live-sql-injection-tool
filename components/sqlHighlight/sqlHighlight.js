(function() {
  /*global Prism:false */
  'use strict';

  angular.module('sqlHighlight', [])
    .directive('sqlHighlight', function(){
      return {
        restrict: 'A',
        scope: {
          sql: '=sqlHighlight'
        },
        compile: function(el){
          el.addClass('language-sql');

          return function postLink(scope, el){
            scope.$watch('sql', function(sql){
              el.html(sql);
              Prism.highlightElement(el[0]);
            });
          };
        }

      }
    });

})();
