# Socks-Routes

A basic package for cleaning up some boilerplate behind express routes.

## Usage:

Usage is very simple! When initializing your app, you should add this to your
express code:

### ./app.js:

    var express = require('express');
    var path = require('path');
    
    [...] // Require your various other modules here
    
    var routes = require('socks-routes');
    var app = express();
    
    [...] // Set up your app here, such as sessions and other middleware
    
    // Load the routes
    routes.loadDir(app, path.join(__dirname, 'routes'));
    
    [...] // Any final routes and middleware, and app start-up

### ./routes/index.js

For the routes themselves, I've boiled it down to a one-liner of boilerplate:

    // Simple one-line drop in replacement for express's default route
    //  boilerplate, that specifies the route for `/`
    var router = require('socks-routes').Route('/');
    
    // The rest is the same as express's default route skeleton
    
    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('index', { title: 'Express' });
    });

Note that, as with bare express routes, you can specify multiple routers that
can handle the same route if you feel that certain aspects of your app make
more sense in separate files.

Socks-Routes will grab all the javascript routes in `./routes` and its
subdirectories and load them into the app. No more having to manually `require`
and `app.use()` each and every route, they and their relevant information are
tucked away in one convenient file for you to modify as your needs change.
