const gulp = require("gulp");
const gutil = require('gulp-util');
const inject = require('gulp-inject');
const concat = require("gulp-concat");
const uglify = require('gulp-uglify');
const babel = require("gulp-babel");
const sourcemaps = require('gulp-sourcemaps');
const jshint = require('gulp-jshint');
const connect = require('gulp-connect');

gulp.task("default", ["connect", "jshint", "es6", "inject-tests", "watch"]);

gulp.task("watch", () => {
    gulp.watch("./src/**/*js", ["jshint", "es6", "inject-tests"]);
    gulp.watch("./tests/**/*.test.js", ["inject-tests"]);
    gulp.watch("./tests/index.html", ["live-reload"]);
});

gulp.task("connect", () => {
    connect.server({
        root: 'tests',
        livereload: true
    });
});

gulp.task("es6", () => {
    return gulp.src("./src/**/*js")
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(concat('all.js'))
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) //only uglify if gulp is ran with '--type production'
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task("inject-tests", ["transfer-library-code"], () => {
    console.log(new Date());

    return gulp.src("./tests/index.html")
        .pipe(inject(gulp.src(["./tests/_all/all.js", "./tests/**/*.test.js"], {
            read: false
        }), {
            relative: true
        }))
        .pipe(gulp.dest("./tests"));
});

gulp.task("jshint", () => {
    return gulp.src("./src/**/*js")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("live-reload", () => {
    return gulp.src("./tests/index.html").pipe(connect.reload());
});

gulp.task("transfer-library-code", () => {
    return gulp.src(["./dist/all.js"]).pipe(gulp.dest("./tests/_all"));
});