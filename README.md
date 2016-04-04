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
