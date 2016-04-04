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

      var form   = $http.get(prefix + '/form.html'),
          query  = $http.get(prefix + '/query.txt'),
          schema = $http.get(prefix + '/schema.sql');

      return $q.all([form, query, schema])
        .then(function(data){
          form = data[0].data;
          query = data[1].data;
          schema = data[2].data;

          return new ChallengeModel(form, query, schema);
        }, function(){
          return $q.reject('Could not retrieve challenge');
        });
    }
  }


  ChallengeModel.$inject = ['$interpolate'];
  function ChallengeModel($interpolate) {

    function Challenge(form, query, schema) {

      // Let's create the DB (does this melt the browser? lol)
      var db = new SQL.Database();
      db.run(schema);

      this._form = form;
      this._query = query;
      this._schema = schema;
      this._db = db;
    }

    /**
     * Executes the stored query with the given arguments
     * @param args Object that should have keys that map to the query variables
     * @returns {{query: String the compiled string run against the db, results: Array Array of objects which are the rows returned}}
     */
    Challenge.prototype.executeQuery = function executeQuery(args){
      var query = this.getParsedQuery(args);
      var stmt = this._db.prepare(query);

      // Fill the results
      var results = [];
      while(stmt.step()){
        results.push(stmt.getAsObject());
      }
      // Lessen memory leaks :D
      stmt.free();

      return {
        query: query,
        results: results
      };

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
  }
})();
