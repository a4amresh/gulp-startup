'use strict';

const assets = require('./dev/config/Assets');
const path = require('path');
const fs = require('fs');
const {
  src,
  dest,
  parallel,
  series
} = require('gulp');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const sassGlob = require('gulp-sass-glob');
const ejs = require("gulp-ejs");
const rename = require('gulp-rename')
const ejsData = {
  prifix: assets.prefix,
  projectTitle: 'page title'
}
const ejsOptions = {
  async: false
}

function customRename(params) {
  return params.dirname = path.join(params.dirname, "../");
}

// async function ejsCustom() {
//   const data = await JSON.parse(fs.readFileSync('./data.json'));
//   return data;
// }


function copyStatic() {}

function projectSass() {
  return src(assets.Project.scss)
    .pipe(sassGlob())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(rename(assets.prefix + '-main.css'))
    .pipe(dest(assets.assetsDest + "/css"));
}

function vendorsSass() {
  return src(assets.Libraries.scss)
    .pipe(sass(sass.sync().on('error', sass.logError)))
    .pipe(rename(assets.prefix + '-vendors.css'))
    .pipe(dest(assets.assetsDest + "/css"));
}

function compileView() {
  return src(assets.Project.views.pages)
    .pipe(ejs(ejsData, ejsOptions))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(rename(customRename))
    .pipe(dest(assets.viewDest));
}

exports.view = compileView;
exports.default = compileView;
