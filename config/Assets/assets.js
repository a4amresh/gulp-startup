'use strict';
const external = require("../../external-assets.json");
console.log(external.js.join());
module.exports = {
    Libraries: {
        statics: null,
        scss: external.scss.concat('src/2-project-common/libs/libraries.scss', 'src/2-project-common/libs/**/*.scss', 'src/2-project-common/libs/**/*.css'),
        js: external.js.concat('src/2-project-common/libs/**/*.js')
    },
    Project: {
        statics: ['src/1-Static_files/**/*'],
        scss: ['src/2-project-common/project/**/*.scss', 'src/2-project-common/project.scss', 'src/3-views/1-Components/**/*.scss', 'src/3-views/2-Pages/**/*.scss'],
        js: ['src/2-project-common/project/js/main.js', 'src/3-views/1-Components/**/*.js', 'src/3-views/2-Pages/**/*.js'],
        views: ['src/3-views/2-Pages/**/*.ejs'],
        components: ['src/3-views/1-Components/**/*.ejs']
    }
}
