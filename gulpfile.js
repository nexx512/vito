const path = require("path")
const gulp = require("gulp");
const runSequence = require("run-sequence");
const p = require("gulp-load-plugins")();
const autoprefixer = require("autoprefixer");
const mqpacker = require("css-mqpacker");
const csswring = require("csswring");
const del = require("del");
const ts = require("gulp-typescript")
const webpackStream = require("webpack-stream");
const webpack = require("webpack");

const viewsDir = "src/webapp/views";
const stylesBaseDir = viewsDir + "/styles";
const componentsDir = viewsDir + "/components";
const scriptsBaseDir = viewsDir + "/scripts";

const src = {
  styles: [stylesBaseDir + "/*.styl", viewsDir + "/pages/**/*.styl", componentsDir + "/**/*.styl"],
  scripts: [scriptsBaseDir + "/*.js"],
  componentScripts: [componentsDir + "/*/*.js"],
  icons: ["src/webapp/assets/icons/*.svg"],
  pug: ["webapp/views/pages/**/*.pug"],
  json: ["src/webapp/i18n/*.json"]
};

const dist = "dist";
const distWebapp = dist + "/webapp";
const distAssets = distWebapp + "/assets";


//////////
// Clean dist folders
//////////
gulp.task('clean', () => del([dist]));


//////////
// Copy json files
//////////
gulp.task("json", () => {
  gulp.src(src.json, {
    base: "src"
  })
  .pipe(gulp.dest(dist))
})


//////////
// Compile TypeScript files
//////////
gulp.task("ts", () => {
  let tsProject = ts.createProject("tsconfig.json")
  tsProject.src()
  .pipe(tsProject())
  .js
  .pipe(gulp.dest(dist))
});


//////////
// Precompiling views
//////////
gulp.task("views", () =>
  // get all the pug files and compile them for client
  gulp.src(src.pug)
  .pipe(p.pug({
      client: true,
      basedir: componentsDir
  }))
  // replace the function definition
  .pipe(p.replace("function template(locals)", "module.exports = function(locals, pug)"))
  .pipe(gulp.dest(distWebapp + "/views") )
);


//////////
// Building assets from sources
//////////
gulp.task("styles", () =>
  gulp.src(src.styles)
    .pipe(p.plumber())
    .pipe(p.stylus({
      paths: [stylesBaseDir + "/lib"],
      import: ["defaults", "mediaqueries"],
      url: { name: "embedurl" }
    }))
    .pipe(p.concat("styles.css"))
    .pipe(p.postcss([autoprefixer({ browsers: ["last 2 versions", "ie >= 10"] })]))
    .pipe(gulp.dest(distAssets + "/styles"))
)

gulp.task("styles:optimize", ["styles"], () =>
  gulp.src(distAssets + "/styles/*.css")
    .pipe(p.plumber())
    .pipe(p.postcss([mqpacker, csswring]))
    .pipe(gulp.dest(distAssets + "/styles"))
)

// generates one file that imports all componenet javascript modules.
// the generated file is imported by main.js
// for config options see:
// - https://github.com/lee-chase/gulp-index
gulp.task('scripts:components', cb =>
  gulp.src(componentsDir + "/*/*.js", {read: false})
    .pipe(p.plumber())
    .pipe(p.index({
      'prepend-to-output': () => ``,
      'append-to-output': () => ``,
      'title-template': () =>``,
      'pathDepth': 1,
      'section-template': (sectionContent) => `${sectionContent}`,
      'section-heading-template': () => ``,
      'list-template': (listContent) => `${listContent}`,
      'item-template': (filepath, filename) => `export * from '../../${filepath}/${filename.replace('.js', '')}'
`,
      'tab-string': '',
      'outputFile': './components.js'
    }))
    .pipe(gulp.dest(scriptsBaseDir))
)

createWebPackConfig = (mode) => {
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

gulp.task('scripts', ['scripts:components'], cb =>
  gulp.src(src.scripts)
    .pipe(p.plumber())
    .pipe(webpackStream(createWebPackConfig("development"), webpack))
    .pipe(gulp.dest(distAssets + '/scripts'))
)

gulp.task('scripts:optimize', ['scripts:components'], cb =>
  gulp.src(src.scripts)
    .pipe(p.plumber())
    .pipe(webpackStream(createWebPackConfig("production"), webpack))
    .pipe(gulp.dest(distAssets + '/scripts'))
)


//////////
// Optimizing previously build styles
//////////
gulp.task("optimize", ["styles:optimize", "scripts:optimize"])


//////////
// Copy sprites
//////////
gulp.task("icons", () => {
  gulp.src(src.icons)
  .pipe(p.plumber())
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
  .pipe(gulp.dest(distAssets + "/icons"))
})


//////////
// Watching source changes
//////////
gulp.task("watch", cb => {
  gulp.watch(["**/*.ts"], ["ts"])
  gulp.watch(src.scripts.concat([componentsDir + "/**/*.js"]), ["scripts"])
  gulp.watch(src.styles, ["styles"])
  gulp.watch(src.json, ["json"])
  gulp.watch(src.sprites, ["sprites"])
})


//////////
// Revisioning previously built and optimized assets
//////////
gulp.task("rev", ["optimize", "icons", "scripts"], () =>
  gulp.src([distAssets + "/**/*"])
    .pipe(p.revAll.revision())
    .pipe(p.revDeleteOriginal())
    .pipe(gulp.dest(distAssets))
    .pipe(p.revAll.manifestFile())
    .pipe(gulp.dest(distAssets))
)


//////////
// Main tasks used to create a full set of assets
//////////
gulp.task("develop", () => runSequence(["json", "ts", "styles", "scripts", "icons"], ["watch"]))
gulp.task("production", () => runSequence(["clean"], ["json", "ts", "rev", "views"]))
