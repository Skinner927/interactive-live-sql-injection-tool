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
          form = data[0].data;
          query = data[1].data;
          schema = data[2].data;
          var configSrc = data[3].data;

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

      // Let's create the DB (does this melt the browser? lol)
      var db = new SQL.Database();
      db.run(schema);

      this._config = config || {};
      this._query = query;
      this._schema = schema;
      this._db = db;
      this._success = false;

      this.id = this._config.id;
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
      this._success = false;

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
