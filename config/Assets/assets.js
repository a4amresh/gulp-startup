'use strict';

module.exports = {
    Libraries: {
        statics: null,
        scss: ['src/2-project-common/libs/libraries.scss','src/2-project-common/libs/**/*.scss','src/2-project-common/libs/**/*.css'],
         //scss: ['src/2-project-common/libs/**/*.css'],
        js: ['node_modules/jquery/dist/jquery.js','node_modules/bootstrap/dist/js/bootstrap.js','src/2-project-common/libs/**/*.js']
        //js: ['node_modules/jquery/dist/jquery.js','src/2-project-common/libs/**/*.js']
    },
    Project: {
        statics: ['src/1-Static_files/**/*'],
        scss: ['src/2-project-common/project/**/*.scss', 'src/2-project-common/project.scss', 'src/3-views/1-Components/**/*.scss','src/3-views/2-Pages/**/*.scss'],
        js: ['src/2-project-common/project/js/main.js','src/3-views/1-Components/**/*.js','src/3-views/2-Pages/**/*.js'],
        views: ['src/3-views/2-Pages/**/*.ejs'],
        components: ['src/3-views/1-Components/**/*.ejs']
    }
}