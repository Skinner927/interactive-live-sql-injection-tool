(function(exports) {
  'use strict';

  exports.config = {
    title: 'Nearly blind article injection',
    description: "Get the 'admin' user's password hash and paste it into the " +
    "'Enter the flag' box. " +
    "The db schemas are different from the other challenges. Now would be the " +
    "time to learn how to enumerate the number of columns returned and discover " +
    "the schema of the users table.",
    hideResult: true,
    hideSQL: true,
    manualValidator: function(value){
      // We ensure the only row displayed (the first one) contains the admin's hash
      var adminPwHash = '03a69effe70e17962c818ac28e77fc55';

      return value === adminPwHash;
    }
  };

})(this);
