(function(exports) {
  'use strict';

  exports.config = {
    title: 'URL injection - Harder',
    description: "Retrieve the 'admin' user's password hash from the 'users' table in order to " +
    "create a more perfect UNION. Tip: Only specific columns of the first row are displayed in the " +
    "article. You have to get the admin's password hash into one of these columns to win",
    afterQuery: function(results, success){
      // We ensure the only row displayed (the first one) contains the admin's hash
      var adminPwHash = 'a4d731d37c88f9c4acc6dfbcedaf3eb6';

      if(results.length === 0){
        return;
      }

      try{
        if(JSON.stringify([results[0].author, results[0].body]).indexOf(adminPwHash) !== -1){
          success();
        }
      } catch(e){
        // do nothing
      }
    }
  };

})(this);
