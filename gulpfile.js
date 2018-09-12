const gulp = require("gulp")
const runSequence = require("run-sequence")
const p = require("gulp-load-plugins")()
const autoprefixer = require("autoprefixer")
const mqpacker = require("css-mqpacker")
const csswring = require("csswring")

const src = {
  styles: ["webapp/views/components/*/*.styl"]
}

const assets = "webapp/assets"
const dist = "webapp/dist"
const distAssets = dist + "/assets"

//////////
// Building assets from sources
//////////

gulp.task("styles", cb =>
  gulp.src(src.styles)
    .pipe(p.plumber())
    .pipe(p.stylus())
    .pipe(p.concat("styles.css"))
    .pipe(p.postcss([autoprefixer({ browsers: ["last 2 versions", "ie >= 10"] })]))
    .pipe(gulp.dest(assets + "/styles"))
)

gulp.task("styles:optimize", ["styles"], cb =>
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

gulp.task("rev", ["optimize"], cb => {
  return gulp.src([dist + "/**/*"])
    .pipe(p.revAll.revision())
    .pipe(p.revDeleteOriginal())
    .pipe(gulp.dest(dist))
    .pipe(p.revAll.manifestFile())
    .pipe(gulp.dest(dist))
})



//////////
// Main tasks used to create a full set of assets
//////////

gulp.task("build", ["styles"])
gulp.task("develop", cb => runSequence(["build"], ["watch"], cb))
gulp.task("production", ["rev"]);
