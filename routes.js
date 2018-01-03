/* Express route loader */
var express = require('express');
var methods = require('methods');

var path = require('path');
var fs = require('fs');

// Stash some stuff away for the loader
class Route {
	constructor(route) {
		this.route = route;
		this.router = express.Router();
	}
	
	all(...args) {
		console.log("Adding [ALL] "+(this.route=='/'?'':this.route)+args[0]);
		this.router['all'].apply(this.router, args);
	}
	
	param(...args) {
		this.router['param'].apply(this.router, args);
	}
	
	route(...args) {
		this.router['route'].apply(this.router, args);
	}
	
	use(...args) {
		this.router['use'].apply(this.router, args);
	}
}

// create Route#VERB functions as passthroughs to express' router
methods.concat('all').forEach(function(method) {
	Route.prototype[method] = function(...args) {
		console.log("Adding "+method.toUpperCase()+' '
		+(this.route=='/'?'':this.route)+args[0]);
		this.router[method].apply(this.router, args);
	}
});

class RouteLoader {
	constructor() {
		this.loadedRoutes = {};
	}
	
	add(app, route, routeFile = undefined) {
		app.use(route.route, route.router);
		
		// Most routes will only have one file, but you know what they say
		//  about assumptions...
		if(this.loadedRoutes[route.route] === undefined)
			this.loadedRoutes[route.route] = [routeFile];
		else
			this.loadedRoutes[route.route].push(routeFile);
	}
	
	load(app, routeFile) {
		console.log("Loading " + routeFile);
		this.add(app, require(routeFile), routeFile);
	}
	
	loadDir(app, routeDir) {
		// We're doing this synchronously because it *should* only be
		//  called during app init (and someday maybe reloading?)
		var stat = fs.lstatSync(routeDir);
		
		if(stat.isDirectory()) {
			var files = fs.readdirSync(routeDir);
			
			for(var i = 0; i < files.length; ++i)
				this.loadDir(app, path.join(routeDir, files[i]));
		}
		else if(path.extname(routeDir) == '.js')
			this.load(app, routeDir);
	}
	
	Route(route) {
		return new Route(route);
	}
}

module.exports = new RouteLoader();