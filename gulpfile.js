'use strict';

// Load dependencies
const Assets = require('./config/Assets/assets');
const gulp = require("gulp");
var browserSync = require('browser-sync').create();
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var path = require('path');
//var del = require('del');

// Local variables
const prifix = "bayside";
const development = plugins.environments.development;
const production = plugins.environments.production;
const fileName = production() ? prifix+".min" : prifix;
const destDir = '.ak';

/**
 * Task:: Generate html templates
 */
gulp.task("view", function () {
    gulp.src(Assets.Project.views)
        .pipe(plugins.ejs({ prifix: prifix, projectTitle: "Bayside Group"}, {}, { ext: '.html' }))
        .pipe(plugins.rename(function(params) {
            params.dirname = path.join(params.dirname, "../");
        }))
        .pipe(gulp.dest(destDir));
});

/**
 * ---------------------
 * Runtime:: Tasks
 * ---------------------
 */

// Project scss task
gulp.task('project-sass', function () {
    return gulp.src(Assets.Project.scss)
        .pipe(development(plugins.sourcemaps.init()))
        .pipe(plugins.sass())
        .pipe(plugins.concat(fileName+".css"))
        .pipe(development(plugins.sourcemaps.write('.')))
        .pipe(production(plugins.uglifycss({"uglyComments": true})))
        .pipe(gulp.dest(destDir+"/assets/css/"))
        .pipe(browserSync.stream());
});
// Project JS task
gulp.task("project-js", function () {
    gulp.src(Assets.Project.js)
        // this will only init sourcemaps in development
        .pipe(development(plugins.sourcemaps.init()))
        .pipe(plugins.concat(fileName+".js"))
        // only write out sourcemaps in development
        .pipe(development(plugins.sourcemaps.write('.')))
        // only minify the compiled JS in production mode
        .pipe(production(plugins.uglify()))
        .pipe(gulp.dest(destDir+"/assets/js/"))
        .pipe(browserSync.stream());
});

// Library scss task
gulp.task('libs-sass', function () {
    return gulp.src(Assets.Libraries.scss)
        .pipe(development(plugins.sourcemaps.init()))
        .pipe(plugins.sass())
        .pipe(plugins.concat(fileName+"-externals.css"))
        .pipe(development(plugins.sourcemaps.write('.')))
        .pipe(production(plugins.uglifycss({"uglyComments": true})))
        .pipe(gulp.dest(destDir+"/assets/css/"))
        .pipe(browserSync.stream());
});
// Libraries JS Task
gulp.task("libs-js", function () {
    gulp.src(Assets.Libraries.js)
        // this will only init sourcemaps in development
        .pipe(development(plugins.sourcemaps.init()))
        .pipe(plugins.concat(fileName+"-externals.js"))
        // only write out sourcemaps in development
        .pipe(development(plugins.sourcemaps.write('.')))
        // only minify the compiled JS in production mode
        .pipe(production(plugins.uglify()))
        .pipe(gulp.dest(destDir+"/assets/js/"))
        .pipe(browserSync.stream());
});

// gulp.task("dev-clean", function (cb) {
//     del([".amresh"]).then((res) => {
//         console.log("Cleaned directory");
//         gulp.run("serve");
//     });
// });

// Copy static files
gulp.task("copy-static", function () {
    gulp.src(Assets.Project.statics)
    .pipe(gulp.dest(destDir));
});

// gulp.task("script-copy", function () {
//     gulp.src("./src/assets/js/**/*.js")
//         .pipe(gulp.dest('.amresh/assets/js'));
// });

//  gulp.task("ap-watch", function() {
//      gulp.watch('./src/scss/**/*.scss', function() {
//          console.log(gulp.run);

// Static Server + watching scss/html files
gulp.task('serve', ["copy-static","project-sass", "libs-sass", "view", "libs-js","project-js"], function () {
    browserSync.init({
        server: destDir
    });
    gulp.watch([Assets.Project.views, Assets.Project.components], ["view"]).on('change', browserSync.reload);
    gulp.watch([Assets.Project.scss], ['project-sass']);
    gulp.watch([Assets.Libraries.scss], ['libs-sass']);
    gulp.watch([Assets.Project.js], ['project-js']);
});

gulp.task("default", ['serve']);
gulp.task("build", ["copy-static","project-sass", "libs-sass", "view", "libs-js","project-js"]);