(function(exports) {
  'use strict';

  exports.config = {
    title: 'Simple SQL injection',
    description: 'Bypass the login form by logging in as anyone.',
    beforeQuery: function(params){
      //return {username: 'another name'}
      return params;
    },
    afterQuery: function(results, success){
      if(results.length){
        success();
      }
    }
  };

})(this);
