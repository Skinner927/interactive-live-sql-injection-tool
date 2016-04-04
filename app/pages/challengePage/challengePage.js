(function() {
  'use strict';

  angular.module('challengePage', [
    'challengeSvc',
    'challengeForm'
  ])
    .directive('challengePage', function(){
      return {
        restrict: 'AE',
        scope: {},
        controller: 'challengePageCtrl',
        controllerAs: 'page',
        templateUrl: '/pages/challengePage/challengePage.html'
      };
    })
    .controller('challengePageCtrl', ChallengePageCtrl);


  ChallengePageCtrl.$inject = [
    '$scope',
    '$stateParams',
    'challengeSvc',
    '$sce'
  ];
  function ChallengePageCtrl($scope, $stateParams, challengeSvc, $sce){
    var vm = this;
    vm.formValues = {};

    // Resolve the challenge
    challengeSvc.getChallenge(+$stateParams.id)
      .then(function(challenge){
        vm.challenge = challenge;
        vm.error = '';
        highlightSqlQuery();
      }, function(error){
        vm.error = error;
      });

    // Watch form values for change then re-run the challenge
    // This should be debounced by the ng-model-options
    $scope.$watch(function(){
      return vm.formValues;
    }, function(formValues){
      if(!vm.challenge){
        return;
      }
      // Run the challenge
      vm.challenge.executeQuery(formValues);
      highlightSqlQuery();
    }, true);

    function highlightSqlQuery(){
      if(vm.challenge.result.query){
        vm.formattedQuery = $sce.trustAsHtml(highlightSql(vm.challenge.result.query));
      }
    }
  }

  /**
   * http://thecodeplayer.com/walkthrough/mysql-syntax-highlighter-javascript-regex
   * @param string
   * @returns {*}
   */
  function highlightSql(string){
    //full list of reserved words: http://dev.mysql.com/doc/refman/5.0/en/reserved-words.html
    var k = ["AND", "AS", "ASC", "BETWEEN", "BY", "CASE", "CURRENT_DATE",
      "CURRENT_TIME", "DELETE", "DESC", "DISTINCT", "EACH", "ELSE", "ELSEIF", "FALSE", "FOR", "FROM", "GROUP", "HAVING", "IF", "IN", "INSERT", "INTERVAL", "INTO", "IS", "JOIN", "KEY", "KEYS", "LEFT", "LIKE", "LIMIT", "MATCH", "NOT", "NULL", "ON", "OPTION", "OR", "ORDER", "OUT", "OUTER", "REPLACE", "RIGHT", "SELECT", "SET", "TABLE", "THEN", "TO", "TRUE", "UPDATE", "VALUES", "WHEN", "WHERE"];
    //adding lowercase keyword support
    var len = k.length;
    for(var i = 0; i < len; i++)
    {
      k.push(k[i].toLowerCase());
    }

    var re;
    var c = string; //raw code

    //regex time
    //highlighting special characters. /, *, + are escaped using a backslash
    //'g' = global modifier = to replace all occurances of the match
    //$1 = backreference to the part of the match inside the brackets (....)
    c = c.replace(/(=|%|\/|\*|-|,|;|\+|<|>)/g, "<span class=\"sc\">$1</span>");

    //strings - text inside single quotes and backticks
    c = c.replace(/(['`].*?['`])/g, "<span class=\"string\">$1</span>");

    //numbers - same color as strings
    c = c.replace(/(\d+)/g, "<span class=\"string\">$1</span>");

    //functions - any string followed by a '('
    c = c.replace(/(\w*?)\(/g, "<span class=\"function\">$1</span>(");

    //brackets - same as special chars
    c = c.replace(/([\(\)])/g, "<span class=\"sc\">$1</span>");

    //reserved mysql keywords
    for(i = 0; i < k.length; i++)
    {
      //regex pattern will be formulated based on the array values surrounded by word boundaries. since the replace function does not accept a string as a regex pattern, we will use a regex object this time
      re = new RegExp("\\b"+k[i]+"\\b", "g");
      c = c.replace(re, "<span class=\"keyword\">"+k[i]+"</span>");
    }

    //comments - tricky...
    //comments starting with a '#'
    c = c.replace(/(#.*?\n)/g, clear_spans);

    //comments starting with '-- '
    //first we need to remove the spans applied to the '--' as a special char
    c = c.replace(/<span class=\"sc\">-<\/span><span class=\"sc\">-<\/span>/g, "--");
    c = c.replace(/(-- .*?\n)/g, clear_spans);

    //comments inside /*...*/
    //filtering out spans attached to /* and */ as special chars
    c = c.replace(/<span class=\"sc\">\/<\/span><span class=\"sc\">\*<\/span>/g, "/*");
    c = c.replace(/<span class=\"sc\">\*<\/span><span class=\"sc\">\/<\/span>/g, "*/");
    //In JS the dot operator cannot match newlines. So we will use [\s\S] as a hack to select everything(space or non space characters)
    c = c.replace(/(\/\*[\s\S]*?\*\/)/g, clear_spans);

    return c;

    //as you can see keywords are still purple inside comments.
    //we will create a filter function to remove those spans. This function will noe be used in .replace() instead of a replacement string
    function clear_spans(match)
    {
      match = match.replace(/<span.*?>/g, "");
      match = match.replace(/<\/span>/g, "");
      return "<span class=\"comment\">"+match+"</span>";
    }
  }
})();
