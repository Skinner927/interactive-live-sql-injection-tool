(function(exports) {
  'use strict';

  var MD5 = new exports.Hashes.MD5;

  exports.config = {
    title: 'User specific injection - A little harder now',
    description: 'Bypass the login form by logging in as the user "admin". ' +
    'The password will be hashed as before. The challenge now is to get the ' +
    'data you need without being able to ignore the password field.',
    beforeQuery: function(params){
      if(params.password){
        params.password = MD5.hex(params.password);
      }

      return params;
    },
    afterQuery: function(results, success){
      if(results.length && results[0].username === 'admin'){
        success();
      }
    }
  };

})(this);
