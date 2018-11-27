const gulp = require("gulp")
const runSequence = require("run-sequence")
const p = require("gulp-load-plugins")()
const autoprefixer = require("autoprefixer")
const mqpacker = require("css-mqpacker")
const csswring = require("csswring")
const del = require("del");
const replace = require("gulp-replace")
const pug = require("gulp-pug")
const ts = require("gulp-typescript")

const src = {
  styles: ["src/webapp/views/styles/**/*.styl", "src/webapp/views/pages/**/*.styl", "src/webapp/views/components/**/*.styl"],
  pug: ["webapp/views/pages/**/*.pug"],
  json: ["src/webapp/i18n/*.json"]
}

const dist = "dist"
const distWebapp = dist + "/webapp"
const distAssets = distWebapp + "/assets"

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
  .pipe(pug({
      client: true,
      basedir: "src/webapp/views/components"
  }))
  // replace the function definition
  .pipe(replace("function template(locals)", "module.exports = function(locals, pug)"))
  .pipe(gulp.dest(distWebapp + "/views") )
);


//////////
// Building assets from sources
//////////
gulp.task("styles", () =>
  gulp.src(src.styles)
    .pipe(p.plumber())
    .pipe(p.stylus({
      paths: ["src/webapp/views/styles/lib"],
      import: ["defaults"],
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


//////////
// Optimizing previously build assets
//////////
gulp.task("optimize", ["styles:optimize"])


//////////
// Watching source changes
//////////
gulp.task("watch", cb => {
  gulp.watch(["**/*.ts"], ["ts"])
  gulp.watch(src.styles, ["styles"])
  gulp.watch(src.json, ["json"])
})


//////////
// Revisioning previously built and optimized assets
//////////
gulp.task("rev", ["optimize"], () =>
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
gulp.task("develop", () => runSequence(["json", "ts", "styles"], ["watch"]))
gulp.task("production", () => runSequence(["clean"], ["json", "ts", "rev", "views"]))
