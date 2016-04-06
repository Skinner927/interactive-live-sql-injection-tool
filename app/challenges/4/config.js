(function(exports) {
  'use strict';

  var MD5 = new exports.Hashes.MD5;

  exports.config = {
    title: 'URL injection',
    description: 'Retrieve the "admin" user from the "users" table in order to ' +
    'create a more perfect UNION.',
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
            'f6a0ee697eb8d0304690d91c82287167': false
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
    },
    previewQueries: {
      users: 'SELECT id, username, "*HIDDEN*" as password FROM users',
      articles: 'SELECT * FROM articles'
    }
  };

})(this);
