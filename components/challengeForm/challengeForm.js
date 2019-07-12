(function() {
  'use strict';

  angular.module('challengeForm', [])
    .controller('challengeFormCtrl', ChallengeFormCtrl)
    .directive('challengeForm', ['$compile', function($compile){
      return {
        restrict: 'AE',
        require: 'ngModel',
        scope: {
          challengeForm: '=',
          rows: '=challengeRows'
        },
        controller: 'challengeFormCtrl',
        controllerAs: 'cForm',
        link: ChallengeFormLinkWrapper($compile)
      };
    }]);


  function ChallengeFormLinkWrapper($compile){
    return function ChallengeFormLink(scope, el, attrs, ngModelCtrl){
      // Watch form data for change then alert model listeners
      scope.$watch('formData', function(newVal){
        ngModelCtrl.$setViewValue(newVal);
      }, true);

      // One-time watch for challengeForm to change. We need to wait for the
      // challenge to be resolved.
      var formWatch = scope.$watch('challengeForm', function(newVal){
        if(angular.isUndefined(newVal)){
          return;
        }
        // Unbind the watch
        formWatch();
        hookupForm();
      });

      /**
       * Binds all the magic to the resolved form html
       */
      function hookupForm(){

        var wholeForm = $(scope.challengeForm);

        // Bind up inputs to ng-models
        wholeForm.find('input, textarea, select').each(function(){
          var elem = $(this);
          var name = elem.attr('name') || elem.attr('id');
          if(name){
            elem.attr('ng-model', 'formData.' + name);

            // Assign any specified default value
            scope.formData[name] = elem.attr('value');
          }
        });

        // Stick it in the dom
        $(el).html(wholeForm);

        $compile(wholeForm)(scope);
      }
    };
  }

  ChallengeFormCtrl.$inject = ['$scope'];
  function ChallengeFormCtrl($scope){

    // Form submit should do nothing.
    $scope.formSubmit = function(){};

    // This will get bound to by the linker
    $scope.formData = {};
  }
})();
