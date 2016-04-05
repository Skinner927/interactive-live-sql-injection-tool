(function(exports) {
  'use strict';

  var MD5 = new exports.Hashes.MD5;

  exports.config = {
    title: 'User specific injection',
    description: 'Bypass the login form by logging in as the user "admin".',
    beforeQuery: function(params){
      if(params.password){
        params.password = MD5.hex(params.password);
      }

      return params;
    },
    afterQuery: function(results, success){
      if(results.length){
        return results[0].username === 'admin';
      }
    }
  };

})(this);
