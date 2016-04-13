(function(exports) {
  'use strict';

  var MD5 = new exports.Hashes.MD5;

  exports.config = {
    title: 'Blind article injection',
    description: 'Retrieve the "admin" user from the "users" table in order to ' +
    'create a more perfect UNION.',
    hideResult: true,
    afterQuery: function(results, success){
      if(results.length > 0){
        results.forEach(function(row){
          // This is really, "maybe admin row"
          var isAdminRow = Object.keys(row).some(function(key){
            // Verify a column has the 'admin' username
            return row[key] === 'admin';
          });
          // Verify this is the row and not just trickery
          var correctVals = {
            'admin': false,
            'a4d731d37c88f9c4acc6dfbcedaf3eb6': false
          };
          if(isAdminRow){
            // Idk, maybe they returned the rows in backward order, this is the
            // "best" way to check
            Object.keys(row).forEach(function(key){
              var val = row[key];
              correctVals[val] = true;
            });
            var isWinrar = Object.keys(correctVals).every(function(key){
              return !!correctVals[key];
            });
            if(isWinrar){
              success();
            }
          }
        });
      }
    }
  };

})(this);
