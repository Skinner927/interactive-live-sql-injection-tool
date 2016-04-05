## How to define challenges

### form.html
This should be an HTML document with at least 1 form. The form should also have 
a submit button. We will take the form, then bind our own submit handler. The 
form should have inputs with `name`s that will directly map to params in the 
query.

### query.html
This is a short text file that should be the literal query to run against the 
database. Use angular variable binding notion (double curly braces) for 
variable replacement. The variable names will directly map to the input names in
the `form.html`.

### schema.sql
This is a sql file that will be run when each challenge is constructed. This 
file must be valid SQLite syntax. You should properly drop any table if it 
exists and then create your own table. In addition, this is where you would fill
the database in `INSERT` statements. Basically, do all your SQL work here. It is
safe to make multiple tables as well. 

### config.js
This is is a javascript object that uses some odd attempt Node or commonJs 
export in order to resolve the config object. Take a look at some defined 
configs for example, but basically bind an object to `this.config`. 

jshashes hashing library is available via the `this.Hashes` variable:
https://github.com/h2non/jshashes

The config object supports the following properties:

**beforeQuery** `{function}` - This function gets called before each query. The
return value from this function will be passed into the query. It is expected 
this function will return an object/dict of key:value pairs that eval to 
primitives. Passed param is a single object/dict.

**afterQuery** `{function}` - This function gets called after the query returns 
results. If the query errors, this will not be called. First param is an 
array of objects that represent the rows returned. Second param is a `success()`
function that will notify the framework that the resulting query is what we were
looking for.

**title** `{string}` - This is the title of the challenge. It will be displayed.

**description** `{string}` - This is the description of the the challenge. It
will be displayed. 
