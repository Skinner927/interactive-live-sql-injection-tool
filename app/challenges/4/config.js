(function(exports) {
  'use strict';

  var MD5 = new exports.Hashes.MD5;

  exports.config = {
    title: 'URL injection',
    description: 'Retrieve the "admin" user from the "users" table in order to ' +
    'create a more perfect UNION.',
    afterQuery: function(results, success){

      // For this one as long as admin is returned somewhere
      // we're good
      var adminPwHash = 'f6a0ee697eb8d0304690d91c82287167';

      try{
        if(JSON.stringify(results).indexOf(adminPwHash) !== -1){
          success();
        }
      } catch(e){
        // do nothing
      }
    },
    previewQueries: {
      users: 'SELECT id, username, "*HIDDEN*" as password FROM users',
      articles: 'SELECT * FROM articles'
    }
  };

})(this);
