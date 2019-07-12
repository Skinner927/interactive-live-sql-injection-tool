(function(exports) {
  'use strict';

  exports.config = {
    title: 'Nearly blind article injection',
    description: "Display the 'admin' user's password hash in the article below.",
    hideSQL: true,
    afterQuery: function(results, success){
      // We ensure the only row displayed (the first one) contains the admin's hash
      var adminPwHash = 'aa407e606284780081cbe987386cd385';

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
