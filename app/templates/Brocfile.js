'use strict';

const Autoprefixer = require('broccoli-autoprefixer');
const browserify = require('broccoli-browserify');
const CssOptimizer = require('broccoli-csso');
const LiveReload = require('broccoli-inject-livereload');
const makeModules = require('broccoli-es6-module-filter');
const Merge = require('broccoli-merge-trees');
const Sass = require('broccoli-sass-source-maps');

const isProduction = process.env.EMBER_ENV === 'production';
const pubFiles = (isProduction) ? new LiveReload('public') : 'public';

const stylePaths = [
  'styles',
  'node_modules/normalize-css',
  'node_modules/font-awesome/scss',
  'node_modules/yoga-sass/assets',
];

const modules = makeModules('src', {
  moduleType: 'cjs',
  compatFix: true
});

const js = browserify(modules, {
  entries: ['./index.js'],
  outputFile: 'app.js'
});

const compiledSass = new Sass(stylePaths, 'app.scss', 'app.css', {});
const optimizedCSS = new CssOptimizer(compiledSass);
const styles = new Autoprefixer(optimizedCSS);

module.exports = new Merge([pubFiles, styles, js]);
