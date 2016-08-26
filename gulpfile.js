const gulp = require("gulp");
const gutil = require('gulp-util');
const inject = require('gulp-inject');
const concat = require("gulp-concat");
const uglify = require('gulp-uglify');
const babel = require("gulp-babel");
const sourcemaps = require('gulp-sourcemaps');
const jshint = require('gulp-jshint');

const paths = {
    js: [
        "./src/**/*js"
    ],
    css: [

    ],
    sass: [

    ]
};

gulp.task("default", ["jshint", "es6", "inject-tests", "watch"]);

gulp.task("jshint", () => {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("es6", () => {
    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(concat('all.js'))
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) //only uglify if gulp is ran with '--type production'
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task("inject-tests", () => {
    return gulp.src("./tests/__index.html")
        .pipe(inject(gulp.src(["./dist/all.js", "./tests/**/*js"], { read: false }), { relative: true }))
        .pipe(gulp.dest("./tests"));
});

gulp.task("watch", () => {
    gulp.watch(paths.js, ["jshint", "es6", "inject-tests"]);
});