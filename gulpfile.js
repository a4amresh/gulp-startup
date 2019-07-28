'use strict';

const assets = require('./dev/config/Assets');
const path = require('path');
const fs = require('fs');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

//.pipe(sourcemaps.init())
const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');

const envS = require('gulp-environments');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const sassGlob = require('gulp-sass-glob');
const ejs = require("gulp-ejs");
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const uglifyCss = require('gulp-uglifycss');
const clean = require('gulp-clean');

const production = envS.production;
const development = envS.development;
const filePrefix = production() ? assets.prefix + '.min' : assets.prefix;

const ejsData = {
  prefix: filePrefix,
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


function copyStatic() {
  return src(assets.Project.statics)
    .pipe(dest(assets.assetsDest));
}
function copyVendorStaticJs(done) {
  const vendorsSJs = assets.Libraries.statics.js;
  if (vendorsSJs.length <= 0) {
    done();
    return false;
  }
  return src(vendorsSJs)
    .pipe(dest(assets.assetsDest + "/assets/js"));
}
function copyVendorStaticCss(done) {
  const vendorsSCss = assets.Libraries.statics.css;
  if (vendorsSCss <= 0) {
    done();
    return false;
  }
  return src(vendorsSCss)
    .pipe(dest(assets.assetsDest + "/assets/css"));
}

function projectSass() {
  return src(assets.Project.scss)
    .pipe(development(sourcemaps.init()))
    .pipe(sassGlob())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(rename(filePrefix + '-main.css'))
    .pipe(development(sourcemaps.write(".")))
    .pipe(production(uglifyCss()))
    .pipe(dest(assets.assetsDest + "/assets/css"))
    .pipe(browserSync.stream());
}

function projectJs() {
  return src(assets.Project.js)
    .pipe(development(sourcemaps.init()))
    .pipe(concat(filePrefix + '-main.js'))
    .pipe(development(sourcemaps.write(".")))
    .pipe(production(uglify()))
    .pipe(dest(assets.assetsDest + "/assets/js"));
}

function vendorsSass() {
  return src(assets.Libraries.scss)
    .pipe(development(sourcemaps.init()))
    .pipe(sass(sass.sync().on('error', sass.logError)))
    .pipe(rename(filePrefix + '-vendors.css'))
    .pipe(development(sourcemaps.write(".")))
    .pipe(production(uglifyCss()))
    .pipe(dest(assets.assetsDest + "/assets/css"))
    .pipe(browserSync.stream());
}

function vendorsJs() {
  return src(assets.Libraries.js)
    .pipe(development(sourcemaps.init()))
    .pipe(concat(filePrefix + '-vendors.js'))
    .pipe(development(sourcemaps.write(".")))
    .pipe(production(uglify()))
    .pipe(dest(assets.assetsDest + "/assets/js"));
}

function vendorsFonts(done) {
  const fontsUrl = assets.Libraries.statics.fonts;
  if (fontsUrl.length <= 0) {
    done();
    return false;
  }
  return src(assets.Libraries.statics.fonts)
    .pipe(dest(assets.assetsDest + "/assets/fonts"));
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

function cleanDist(done) {
  if (production()) {
    return src(assets.assetsDest, { read: false })
      .pipe(clean());
  } else {
    done();
    return false;
  }
}

function devServer(done) {
  browserSync.init({
    server: {
      baseDir: './' + assets.viewDest,
      routes: {
        ['./' + assets.viewDest]: '/'
      }
    }
  });

  watch(
    assets.Project.views.pages.concat(assets.Project.views.components),
    compileView).on('change', browserSync.reload);

  watch(assets.Project.scss, projectSass);
  watch(assets.Libraries.scss, vendorsSass);
  watch(assets.Project.js, projectJs).on('change', browserSync.reload);
  watch(assets.Libraries.js, vendorsJs).on('change', browserSync.reload);

  done();

}
const pTasks = parallel(projectSass, vendorsSass, projectJs, vendorsJs,
  vendorsFonts, copyVendorStaticJs, copyVendorStaticCss);
//exports.fonts = vendorsFonts;
exports.build = series(cleanDist, copyStatic, pTasks, compileView);
exports.default = series(copyStatic, pTasks, compileView, devServer);
