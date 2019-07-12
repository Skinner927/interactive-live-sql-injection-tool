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

(function() {

  angular.module('challengeSvc', [])
    .service('challengeSvc', ChallengeService)
    .factory('ChallengeModel', ChallengeModel);


  ChallengeService.$inject = ['$http', '$q', 'ChallengeModel'];
  function ChallengeService($http, $q, ChallengeModel) {

    this.getChallenge = getChallenge;

    /**
     * Retrieves a challenge object by ID
     * @param id
     */
    function getChallenge(id) {

      // We ensure it's a number and loose false means it's 0 or NaN
      // which we don't support
      if (!angular.isNumber(id) || !id) {
        return $q.reject('Invalid challenge ID');
      }
      var prefix = '/challenges/' + id;

      /**
       * Creates a $http.get request that always resolves successfully
       *
       * If the original request fails, `undefined` will be returned
       * @param url
       * @returns {*}
       */
      function successGet(url){
        var defer = $q.defer();

        $http.get(url)
          .then(function(data){
            defer.resolve(data);
          }, function(){
            defer.resolve(undefined);
          });

        return defer.promise;
      }

      var form   = successGet(prefix + '/form.html'),
          query  = successGet(prefix + '/query.txt'),
          schema = successGet(prefix + '/schema.sql'),
          config = successGet(prefix + '/config.js');

      return $q.all([form, query, schema, config])
        .then(function(data){
          form = (data[0] || {}).data;
          query = (data[1] || {}).data;
          schema = (data[2] || {}).data;
          var configSrc = (data[3] || {}).data;

          if(!form){
            return genericError('Could not load form file.');
          }
          if(!query){
            return genericError('Could not load query file.');
          }
          if(!schema){
            return genericError('Could not load schema file.');
          }
          if(!configSrc){
            return genericError('Could not load config file.');
          }

          function genericError(msg){
            return $q.reject(msg + ' Try refreshing the page. If errors persist, create a Github issue.');
          }

          // Here is the most roundabout way I could figure how to turn
          // js from a string to executable js.
          config = new (function(){
            this.Hashes = Hashes;
            eval(configSrc);
          });
          config = config.config;

          // Inject the challenge ID on the config if it doesn't have one (it shouldn't)
          if(!config.id){
            config.id = id;
          }

          return new ChallengeModel(config, form, query, schema);
        }, function(){
          return $q.reject('Could not retrieve challenge. Challenge may not exist.');
        });
    }
  }


  ChallengeModel.$inject = ['$interpolate'];
  function ChallengeModel($interpolate) {

    function Challenge(config, form, query, schema) {
      var challenge = this;

      // Let's create the DB (does this melt the browser? lol)
      var db = new SQL.Database();
      db.run(schema);

      this._config = config || {};
      this._query = query;
      this._schema = schema;
      this._db = db;
      this._success = false;

      this.id = this._config.id;
      this.hideResult = !!this._config.hideResult;

      this.hideQuery = !!this._config.hideQuery;
      this.hideErrors = !!this._config.hideErrors;
      this.hideSQL = !!this._config.hideSQL || (this.hideQuery && this.hideErrors);

      this.manualValidator = this._config.manualValidator;

      this.form = form;
      this.title = this._config.title;
      this.description = this._config.description;
      // Will go true if current query is successful. Modified by
      // config.afterQuery
      Object.defineProperty(this, 'success', {
        get: function(){
          return this._success;
        }
      });

      // This is a way to access the result after it's happened
      this.result = new ChallengeResult();
      this.executeQuery();

      // Load any preview tables
      this.previewTables = {};
      if(angular.isObject(challenge._config.previewQueries)){
        Object.keys(challenge._config.previewQueries).forEach(function(name){
          var query = challenge._config.previewQueries[name];
          if(angular.isString(query)){
            //init
            challenge.previewTables[name] = [];
            try {
              var stmt = challenge._db.prepare(query);
              while(stmt.step()){
                challenge.previewTables[name].push(stmt.getAsObject());
              }
            } catch(e){
              // we failed
              delete challenge.previewTables[name];
            }
          }
        });
      }
    }

    /**
     * Executes the stored query with the given arguments
     * @param args Object that should have keys that map to the query variables
     * @returns ChallengeResult
     */
    Challenge.prototype.executeQuery = function executeQuery(args){
      args = args || {};
      args = angular.copy(args);

      // Reset success
      if(!angular.isFunction(this.manualValidator)){
        this._success = false;
      }

      if(this._config && angular.isFunction(this._config.beforeQuery)){
        args = this._config.beforeQuery(args);
      }

      var query = this.getParsedQuery(args);

      /**
       * Used to set success on afterQuery callback
       * @type {function(this:Challenge)}
       */
      var successCallback = function(){
        this._success = true;
      }.bind(this);

      // Fill the results
      var results = [];
      var error, stmt;
      try {
        stmt = this._db.prepare(query);
        while(stmt.step()){
          results.push(stmt.getAsObject());
        }

        if(this._config && angular.isFunction(this._config.afterQuery)){
          this._config.afterQuery(results, successCallback);
        }
      } catch(e){
        error = e.message || e;
      }

      // Lessen memory leaks :D
      if(stmt){
        stmt.free();
      }

      this.result = new ChallengeResult(
        query,
        results,
        error
      );

      return this.result;
    };

    /**
     * Gets the raw stored query. This will have the angular variables in it.
     * @returns string
     */
    Challenge.prototype.getRawQuery = function getRawQuery(){
      return this._query;
    };

    /**
     * Gets the query string with variables filled in from the args object.
     * @param args Object that should have keys that map to the query variables
     * @returns string
     */
    Challenge.prototype.getParsedQuery = function getParsedQuery(args) {
      // We use angular's interpolate instead of SQL's to allow stupid injections
      return $interpolate(this.getRawQuery())(args);
    };

    /**
     * Call this with a value that will determine if the passed value is what we
     * were looking for to solve the challenge.
     *
     * This is used if you don't want to use the `afterQuery` `success()` option.
     * @param val
     */
    Challenge.prototype.manualValidatorValidator = function manualValidatorValidator(val){
      this._success = !!(angular.isFunction(this.manualValidator) && this.manualValidator(val));
    };


    return Challenge;

    /**
     * Contians the results of a query execution
     * @param query String the compiled string run against the db
     * @param rows Array Array of objects which are the rows returned from the query
     * @param error String Any error message that should be pushed up
     * @constructor
     */
    function ChallengeResult(query, rows, error){
      this.query = query;
      this.rows = rows || [];
      this.error = error;
    }
  }
})();

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
