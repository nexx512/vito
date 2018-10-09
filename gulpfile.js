const gulp = require("gulp")
const runSequence = require("run-sequence")
const p = require("gulp-load-plugins")()
const autoprefixer = require("autoprefixer")
const mqpacker = require("css-mqpacker")
const csswring = require("csswring")
const del = require("del");
const replace = require("gulp-replace")
const pug = require("gulp-pug")

const src = {
  styles: ["webapp/views/styles/*.styl", "webapp/views/pages/**/*.styl", "webapp/views/components/**/*.styl"]
}

const assets = "webapp/assets"
const dist = "webapp/dist"
const distAssets = dist + "/assets"

//////////
// Clean dist folders
//////////
gulp.task('clean', () => del([dist, assets]));


//////////
// Precompiling views
//////////
gulp.task("views", () =>
  // get all the pug files and compile them for client
  gulp.src([
      "webapp/views/pages/**/*.pug"
  ]).pipe(pug({
      client: true,
      basedir: "webapp/views/components"
  }))
  // replace the function definition
  .pipe(replace("function template(locals)", "module.exports = function(locals, pug)"))
  .pipe(gulp.dest(dist + "/views") )
);


//////////
// Building assets from sources
//////////
gulp.task("styles", () =>
  gulp.src(src.styles)
    .pipe(p.plumber())
    .pipe(p.stylus({
      paths: ["webapp/views/styles/lib"],
      import: ["defaults"],
      url: { name: "embedurl" }
    }))
    .pipe(p.concat("styles.css"))
    .pipe(p.postcss([autoprefixer({ browsers: ["last 2 versions", "ie >= 10"] })]))
    .pipe(gulp.dest(assets + "/styles"))
)

gulp.task("styles:optimize", ["styles"], () =>
  gulp.src(assets + "/styles/*.css")
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
  gulp.watch(src.styles, ["styles"])
})


//////////
// Revisioning previously built and optimized assets
//////////
gulp.task("rev", ["optimize"], () => {
  return gulp.src([distAssets + "/**/*"])
    .pipe(p.revAll.revision())
    .pipe(p.revDeleteOriginal())
    .pipe(gulp.dest(distAssets))
    .pipe(p.revAll.manifestFile())
    .pipe(gulp.dest(distAssets))
})


//////////
// Main tasks used to create a full set of assets
//////////
gulp.task("build", ["styles"])
gulp.task("develop", () => runSequence(["build"], ["watch"]))
gulp.task("production", () => runSequence(["clean"], ["rev", "views"]))
