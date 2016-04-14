# Interactive Live SQL Injection Tool

This is a tool to help anyone who's trying to learn or has had a hard time 
trying to learn SQL injections. This tool was created out of necessity as I was 
seeing people new to SQL injection attacks really struggling to wrap their minds 
around escaping parameters. Thus this was born.

Checkout the live app: 
[http://sqli.dennisskinner.com](http://sqli.dennisskinner.com)

## Features
- SQL queries update as you type.
    + This lets you visualize the actual query you're performing against the db.
    + Helps you understand _how_ the injection is actually happening.
- Rows returned by the query are displayed.
- Tables can be shown if the challenge is complicated.
- HTML forms can be created to mock actual websites.
- No backend required.
    + This tool runs completely on the client -- yea, even the database!
- Easy to create new challenges.
    + You don't have to be a professional programmer to create new challenges.

## Big thanks
Big thanks to `kripken`. Without their work compiling SQLite into JS, it would 
have been much more difficult to build this tool. Here's a link to the repo: 
[https://github.com/kripken/sql.js/](https://github.com/kripken/sql.js/)

## Dependencies
Only dependencies are `Node` and `Gulp`. 

## Running/Deploying/Developing 
Once you have `Node` installed, `Gulp` can be instaled with npm: 
`npm install -g gulp`

Then install dependencies in `package.json`: `npm install`

Run `gulp`, the default task is to build and watch all files. It also spins up
a local web server on port `8080` with live reload (you'll need the browser 
plugin). The gulp script has much room for improvement, but it works for the 
moment.

Gulp will spit files into `app/css` and `app/js`, don't modify these files as 
these files will be overwritten.

To deploy, just copy over the `app` directory to your web host. 

### Running locally
The default `gulp` task will run a local web server that should work well enough,
but alternatively you can use built in PHP or Python servers to do the same.
 
`cd` into the `app` directory and run:

`python -m SimpleHTTPServer`

or

`php -S localhost:8080`

to spin up a temporary server.


## How to define challenges
Challenges are pretty simple to create. Over time this process will probably be 
improved and tweaked. To create a challenge, add a numbered directory to 
`app/challenges`. Ensure this new directory is the next number in the sequence.

The `app/challenges/index.json` file is used to define challenges. Add a string 
to the array in the file (open the file, this will make sense). The index your 
string is at +1 (ie 1 being the first index) is the directory that corresponds 
to said challenge. This string you enter is what will show on the side 
navigation.

The following required files should be placed inside your numbered challenge 
directory:

### schema.sql
This is a sql file that will be run when each challenge is constructed. This 
file must be valid SQLite syntax. You should properly drop any table if it 
exists and then create your own table. In addition, this is where you would fill
the database with `INSERT` statements. Basically, do all your SQL work here. It 
is safe to make multiple tables as well. 

### form.html
This should be an HTML document (with `style` and `script` tags added if you'd
like) that displays to the user what the proposed real-world form would look 
like. The html should have at least 1 input element. We currently support 
automatic hookup of `input`, `textarea`, and `select` elements as long as these 
elements have a `name` or `id` attribute. A `value` attribute can be set on the 
element to specify the default value (if you want one). 

Whatever `name` or `id` is resolved (in that order) will be used as the variable 
name in the `query.txt` file. As the fields are filled out, they will auto fill 
the SQL query and the query will be run against the DB. 

If you're familiar with AngularJs, you can gain a litle more power from this 
html. This html will be `$compiled` and have a `$scope`. You may access  
`$scope.rows` in order to get the rows returned by the user's query. 
This allows you to make rich inputs that can show feedback in a way someone 
might see a sql injection in the wild.

### query.txt
This is a short text file that should be the literal query to run against the 
database. Use angular variable binding notion (double curly braces eg: 
`SELECT * FROM users WHERE username='{{username}}'`) for 
variable replacement. The variable names will directly map to the input names in
the `form.html`. This is the query that the end users will be injecting into.

### config.js
This is is a javascript object that uses some odd attempt at an export system 
in order to resolve the config object. Take a look at some defined 
configs for example, but basically bind an object to `this.config`. 

jshashes hashing library is available via the `this.Hashes` variable:
https://github.com/h2non/jshashes

The config object supports the following optional properties:

**title** `{string}` - This is the title of the challenge. It will be displayed 
at the top of the page.

**description** `{string}` - This is the description of the the challenge. It
will be displayed under the title.

**beforeQuery** `{function}` - This function gets called before each query and 
takes one param: an object with properties that map to the input names defined 
in `form.html`. In your function, you can manipulate or append/delete values. 
Your function should return an object with which it's key:value pairs will be 
used in the actual SQL query.

**afterQuery** `{function}` - This function gets called after the query returns 
results. If the query errors, this will not be called. First param is an 
array of objects that represent the rows returned (if there are no results, the 
array will be empty). Second param is a `success()` function that when called 
will notify the framework that the resulting query is what we were looking for.
In other words, if the condition you're looking for exists (specific row, 
number of rows, etc) call this function. Do not use both an `afterQuery` and 
`manualValidator` for validation.

**manualValidator** `{function}` - Instead of trying to figure out if the user 
can blindly pull a value you're looking for in the `afterQuery` function, you 
can make them enter the flag manually. If the `manualValidator` function is 
defined, an input box above the form will be shown. If the `manualValidator` 
function returns true, the challenge will be marked as a success. Do not use 
both an `afterQuery` and `manualValidator` for validation.

**previewQueries** `{object}` - This object is used to define queries to run 
in order to show the user what's inside specific tables. This can be useful in 
more complicated challenges where giving the user a peek inside is polite. The 
properties of the object should be the name of the table and the value should be
a SQL query (string) that returns the data that the user should see from the DB.
You may specify multiple tables.

**hideQuery** `{boolean}` - If set to true, the live query will be hidden.

**hideErrors** `{boolean}` - If set to true, SQL errors will not be pushed up.

**hideSQL** `{boolean}` - If set to true, will hide the entire SQL pane. Use 
this option if you'd like both the results & query turned off.

**hideResult** `{boolean}` - If set to true, result table will be hidden.


## Contributing
If you've come up with general improvements or challenges I'd greatly appreciate
a pull request. I'd like to add more challenges to this tool and if you can help
me that would be great. 

## Disclaimer
This tool was initially written over the course of 3 days. Some code is a 
little slapped together. I hold no responsibility for what you do with this 
tool or what you learn from it. This is an educational tool for proof of 
concept work.

## License
I'm licensing this under the WTFPL (Do What the Fuck You Want to Public License).
I'm not going to even bother to include the license. Take this code and run free. 
This code is distributed as-is with no warranties expressed or implied.  
