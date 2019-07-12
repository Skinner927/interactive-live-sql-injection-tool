(function(exports) {
  'use strict';

  exports.config = {
    title: 'Simple SQL injection',
    description: 'Bypass the login form by making the query return at least one row.',
    afterQuery: function(results, success){
      if(results.length){
        success();
      }
    }
  };

})(this);
