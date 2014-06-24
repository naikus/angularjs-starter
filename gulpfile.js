var gulp = require("gulp"),
      jshint = require("gulp-jshint"),
      clean = require("gulp-clean"),
      concat = require("gulp-concat"),
      uglify = require("gulp-uglify"),
      watch = require("gulp-watch"),
      less = require("gulp-less"),
      Q = require("q"),
      connect = require("gulp-connect");



/** 
 * Global level build configuration
 */
var config = {
   angular: [
      "lib/angularjs/1.2.13/angular.min.js",
      "lib/angularjs/1.2.13/angular-sanitize.min.js",
      "lib/angularjs/1.2.13/angular-touch.min.js",
      "lib/angularjs/1.2.13/angular-route.min.js",
      "lib/angularjs/1.2.13/angular-resource.min.js",
      "lib/angularjs/1.2.13/angular-animate.min.js"
   ],
   
   modernizr: "lib/modernizr/2.6.2/modernizr.min.js",
   
   src: {
      dir: "src/",
      assets: ["lib", "fonts", "img"]
   },
   
   dist: {
      app_dir: "dist/webapp/",
      css_dir: "dist/webapp/css/"
   }
};



/**
 * The default task
 */
gulp.task("default", function() {
   console.log("Available tasks:");
   console.log([
      "------------------------------------------------------------------------",
      "jshint        Run jshint on all the source files",
      "webapp        Build webapp in the dest directory",
      "clean         Clean the dest directory",
      "server        Start a local server (on 8080) that serves from dist/webapp",
      "------------------------------------------------------------------------"
   ].join("\n"));
});



/**
 * Clean up the dest directory
 */
gulp.task("clean", function() {
   return gulp.src(config.dist.app_dir, {read: false})
         .pipe(clean({force: true}));
});



/**
 * Setup jshint for all app files
 */
gulp.task("jshint", function() {
   return gulp.src("src/app/**/*.js")
         .pipe(jshint())
         .pipe(jshint.reporter("default"));
});



/**
 * Less compilation setup
 */
gulp.task("lessc", function() {
   return gulp.src("src/app.less")
         .pipe(less())
         .pipe(gulp.dest(config.dist.css_dir));
});



/**
 * Our main task to build webapp. Here we ensure that clean task runs before
 * others
 */
gulp.task("webapp", ["clean"], function() {
   // do other build things
   gulp.start("jshint", "lessc");      
 
   // copy other assets
   config.src.assets.forEach(function(ass) {
      gulp.src(config.src.dir + ass + "/**")
              .pipe(gulp.dest(config.dist.app_dir + ass));
   });
         
   // just copy application files for now
   return gulp.src([
            "src/**/*.js", 
            "src/**/*.html", 
            "src/**/*.css", 
            "!src/**/*.spec.js"
         ])
         .pipe(gulp.dest(config.dist.app_dir));
});


gulp.task("server", function() {
   connect.server({
      root: "dist/webapp",
      port: 8080
   });
});
