const path = require("path");
const gulp = require("gulp");
const p = require("gulp-load-plugins")();
const autoprefixer = require("autoprefixer");
const mqpacker = require("css-mqpacker");
const cssnano = require("cssnano");
const del = require("del");
const typescript = require("gulp-typescript")
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const stylusSvg = require("stylus-svg")

const viewsDir = "src/webapp/views";
const stylesBaseDir = viewsDir + "/styles";
const componentsDir = viewsDir + "/components";
const scriptsBaseDir = viewsDir + "/scripts";
const stylesSvgsDir = __dirname + "/" + stylesBaseDir + "/generated"

const src = {
  styles: [stylesBaseDir + "/*.styl", viewsDir + "/pages/**/*.styl", componentsDir + "/**/*.styl"],
  stylessvgs: ["src/webapp/assets/**/*.svg"],
  scripts: [scriptsBaseDir + "/*.js"],
  componentScripts: [componentsDir + "/*/*.js"],
  icons: ["src/webapp/assets/icons/*.svg"],
  pug: ["src/webapp/views/pages/**/*.pug"],
  json: ["src/webapp/i18n/*.json"]
};

const dist = "dist";
const distWebapp = dist + "/webapp";
const distAssets = distWebapp + "/assets";


//////////
// Clean dist folders
//////////
function clean() {
  return del([dist]);
}


//////////
// Copy json files
//////////
function json() {
  return gulp.src(src.json, {
    base: "src"
  })
  .pipe(gulp.dest(dist));
}


//////////
// Compile TypeScript files
//////////
function ts() {
  let tsProject = typescript.createProject("tsconfig.json")
  return tsProject.src()
  .pipe(tsProject())
  .js
  .pipe(gulp.dest(dist));
}


//////////
// Precompiling views
//////////
function views() {
  // get all the pug files and compile them
  return gulp.src(src.pug)
  .pipe(p.pug({
      client: true,
      basedir: componentsDir
  }))
  // replace the function definition
  .pipe(p.replace("function template(locals)", "module.exports = function(locals, pug)"))
  .pipe(gulp.dest(distWebapp + "/views"));
}


//////////
// minimize svgs for styles
//////////
function stylessvgs() {
  return gulp.src(src.stylessvgs)
  .pipe(p.svgmin({
    plugins: [{
      removeComments: true
    }, {
      removeTitle: true
    }, {
      cleanupNumericValues: {
        floatPrecision: 2
      }
    }]
  }))
  .pipe(gulp.dest(stylesSvgsDir));
}


//////////
// Building assets from sources
//////////
styles = gulp.series(stylessvgs, function styles() {
  return gulp.src(src.styles)
    .pipe(p.stylus({
      paths: [stylesBaseDir + "/lib"],
      import: ["defaults", "mediaqueries", "mixins"],
      url: {name: "embedurl"},
      use: [stylusSvg({svgDirs: stylesSvgsDir + "/svgs"})]
    }))
    .pipe(p.concat("styles.css"))
    .pipe(p.postcss([autoprefixer()]))
    .pipe(gulp.dest(distAssets + "/styles"));
});

styles_optimize = gulp.series(styles, function styles_optimize() {
    return gulp.src(distAssets + "/styles/*.css")
      .pipe(p.postcss([mqpacker, cssnano({ preset: "advanced" })]))
      .pipe(gulp.dest(distAssets + "/styles"));
  });


// generates one file that imports all componenet javascript modules.
// the generated file is imported by main.js
// for config options see:
// - https://github.com/lee-chase/gulp-index
function scripts_components() {
  return gulp.src(componentsDir + "/*/*.js", {read: false})
    .pipe(p.index({
      'prepend-to-output': () => ``,
      'append-to-output': () => ``,
      'title-template': () =>``,
      'pathDepth': 1,
      'section-template': (sectionContent) => `${sectionContent}`,
      'section-heading-template': () => ``,
      'list-template': (listContent) => `${listContent}`,
      'item-template': (filepath, filename) => `export * from '../../../${filepath}/${filename.replace('.js', '')}'\n`,
      'tab-string': '',
      'outputFile': './components.js'
    }))
    .pipe(gulp.dest(scriptsBaseDir + "/generated"));
}

function createWebPackConfig(mode) {
  return {
    mode: mode,
    entry: './src/webapp/views/scripts/main.js',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/webapp/assets/scripts'),
      publicPath: "/assets/scripts"
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }]
    }
  }
}

scripts = gulp.series(scripts_components, function scripts() {
    return gulp.src(src.scripts)
      .pipe(webpackStream(createWebPackConfig("development"), webpack))
      .pipe(gulp.dest(distAssets + '/scripts'))
  });

scripts_optimize = gulp.series(scripts_components, function scripts_optimize() {
    return gulp.src(src.scripts)
      .pipe(webpackStream(createWebPackConfig("production"), webpack))
      .pipe(gulp.dest(distAssets + '/scripts'))
  });


//////////
// Optimizing previously build styles
//////////
optimize = gulp.parallel(styles_optimize, scripts_optimize);


//////////
// Copy icons
//////////
function icons() {
  return gulp.src(src.icons)
  .pipe(p.svgmin({
    plugins: [{
      removeComments: true
    }, {
      removeTitle: true
    }, {
      cleanupNumericValues: {
        floatPrecision: 2
      }
    }]
  }))
  .pipe(p.rename({prefix: 'icon-'}))
  .pipe(p.svgSprite({
    mode: {
      inline: true,
      symbol: {
        dest: ".",
        sprite: "icons.svg"
      }
    }
  }))
  .pipe(gulp.dest(distAssets + "/icons"));
}


//////////
// Watching source changes
//////////
function watch() {
  gulp.watch(["**/*.ts"], ts)
  gulp.watch(src.scripts.concat([componentsDir + "/**/*.js"]), scripts)
  gulp.watch(src.styles.concat([stylesBaseDir + "/lib/*.styl"]).concat(src.stylessvgs), styles)
  gulp.watch(src.json, json)
  gulp.watch(src.icons, icons)
}


//////////
// Revisioning previously built and optimized assets
//////////
rev = gulp.series(gulp.parallel(optimize, icons), function rev() {
  return gulp.src([distAssets + "/**/*"])
    .pipe(p.rev())
    .pipe(p.revDeleteOriginal())
    .pipe(gulp.dest(distAssets))
    .pipe(p.rev.manifest())
    .pipe(gulp.dest(distAssets))
});


//////////
// Main tasks used to create a full set of assets
//////////
exports.develop = gulp.series(gulp.parallel(json, ts, styles, scripts, icons), watch);
exports.production = gulp.series(clean, gulp.parallel(json, ts, rev, views));
