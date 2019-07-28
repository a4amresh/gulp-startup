'use strict';
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json'));

const srcDir = pkg.config.srcDir;
const vendorsStatics = pkg.config.vendors;

module.exports = {
    Libraries: {
        statics: {
            fonts: vendorsStatics.fonts,
            css: vendorsStatics.css,
            js: vendorsStatics.js,
        },
        scss: [srcDir + '/3-vendors/scss/**/*.scss'],
        js: [srcDir + '/3-vendors/js/*.js']
    },
    Project: {
        statics: [srcDir + '/1-static-assets/**/*'],
        scss: [
            srcDir + '/2-project-common/scss/**/*.scss',
            srcDir + '/4-views/1-components/**/*.scss',
            srcDir + '/4-views/2-Pages/**/*.scss'
        ],
        js: [
            srcDir + '/2-project-common/js/main.js',
            srcDir + '4-views/1-Components/**/*.js',
            srcDir + '/4-views/2-Pages/**/*.js'
        ],
        views: {
            pages: [
                srcDir + '/4-views/2-Pages/**/*.ejs'
            ],
            components: [
                srcDir + '/4-views/1-components/**/*.ejs'
            ]
        }
    },
    viewDest: pkg.config.viewDest,
    assetsDest: pkg.config.assetsDest,
    srcDir: srcDir,
    prefix: pkg.config.prefix
}
